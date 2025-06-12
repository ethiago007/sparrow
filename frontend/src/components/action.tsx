import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, FileText, X, ChevronRight, ArrowLeft, RotateCcw } from 'lucide-react';

type ApiResponse = {
  summary?: string;
  questions?: string[];
};

type AnswerResponse = {
  answer: string;
};

type SavedState = {
  results: ApiResponse | null;
  fileName: string;
  answer: AnswerResponse | null;
  userQuestion: string;
};

const Summarizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAskingQuestion, setIsAskingQuestion] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<AnswerResponse | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save state to memory (since sessionStorage is not available)
  const [_savedState, setSavedState] = useState<SavedState>({
    results: null,
    fileName: '',
    answer: null,
    userQuestion: ''
  });

  // Save state whenever it changes
  useEffect(() => {
    const state: SavedState = {
      results,
      fileName,
      answer,
      userQuestion
    };
    setSavedState(state);
  }, [results, fileName, answer, userQuestion]);

  const handleBack = (): void => {
    console.log('Navigate back');
  };

  const handleUploadAnother = (): void => {
    // Reset all state to allow uploading a new file
    setFile(null);
    setResults(null);
    setError('');
    setUserQuestion('');
    setAnswer(null);
    setFileName('');
    setIsProcessing(false);
    setIsAskingQuestion(false);
  };

  const handleFileUpload = async (): Promise<void> => {
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setResults(null);
    setAnswer(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process PDF');
      }

      const data: ApiResponse = await response.json();
      setResults(data);
      setFileName(file.name);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAskQuestion = async (): Promise<void> => {
    if (!file || !userQuestion.trim()) return;

    setIsAskingQuestion(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question', userQuestion);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get answer');
      }

      const data: AnswerResponse = await response.json();
      console.log('Answer response:', data);
      setAnswer(data);
    } catch (err) {
      console.error('Error asking question:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setFile(null);
  };

  const handleQuestionClick = (question: string): void => {
    setUserQuestion(question);
  };

  const handleQuestionInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserQuestion(e.target.value);
  };

  // Function to format text with markdown-like formatting
  const formatText = (text: string) => {
    const lines = text.split('\n');
    // @ts-ignore
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        // Header
        const headerText = trimmedLine.slice(2, -2);
        elements.push(
          <h3 key={index} className="font-bold text-lg text-gray-800 mt-4 mb-2 first:mt-0">
            {headerText}
          </h3>
        );
      } else if (trimmedLine.startsWith('•')) {
        // Bullet point
        const bulletText = trimmedLine.slice(1).trim();
        elements.push(
          <div key={index} className="flex items-start gap-2 mb-2 ml-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700 leading-relaxed">{bulletText}</p>
          </div>
        );
      } else if (trimmedLine) {
        // Regular paragraph
        elements.push(
          <p key={index} className="text-gray-700 leading-relaxed mb-3">
            {trimmedLine}
          </p>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-30">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button - always show at the top */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors group"
          type="button"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">PDF Summarizer</h1>
          
          {/* File Upload - hide when results are shown */}
          {!results && (
            <>
              <div className="mb-6">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  
                  {file ? (
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <FileText className="text-[#090909]" />
                      <span className="font-medium text-sm sm:text-base break-all">{file.name}</span>
                      <button 
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-700"
                        type="button"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-gray-600">Click to upload PDF</p>
                      <p className="text-sm text-gray-400 mt-1">Max 25MB • 100 pages max</p>
                    </>
                  )}
                </div>
                
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
              </div>
              
              {/* Process Button */}
              <button
                onClick={handleFileUpload}
                disabled={!file || isProcessing}
                className={`w-full py-3 px-4 mb-6 rounded-md font-medium text-white transition-colors disabled:cursor-not-allowed ${
                  isProcessing ? 'bg-gray-600' : 'bg-[#090909] hover:bg-gray-800'
                }`}
                type="button"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Summarize PDF'
                )}
              </button>
            </>
          )}
          
          {/* Results */}
          {results?.summary && (
            <div className="space-y-6">
              {/* Upload Another File Button - positioned at the top of results */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText size={16} />
                  <span className="text-sm break-all">Processed: {fileName}</span>
                </div>
                <button
                  onClick={handleUploadAnother}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium"
                  type="button"
                >
                  <RotateCcw size={16} />
                  <span className="text-sm sm:text-base">Upload Another File</span>
                </button>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                <h2 className="font-bold text-lg sm:text-xl mb-4 text-blue-800">Document Summary</h2>
                <div className="text-sm sm:text-base leading-relaxed">
                  {formatText(results.summary)}
                </div>
              </div>
              
              {/* Questions */}
              {results.questions && results.questions.length > 0 && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h2 className="font-bold text-lg sm:text-xl mb-4 text-gray-800">Key Questions</h2>
                  <ul className="space-y-2">
                    {results.questions.map((question: string, i: number) => (
                      <li 
                        key={i} 
                        className="flex items-start cursor-pointer hover:bg-white p-3 rounded-md transition-colors border border-transparent hover:border-gray-200"
                        onClick={() => handleQuestionClick(question)}
                      >
                        <ChevronRight className="h-4 w-4 mt-1 mr-3 flex-shrink-0 text-blue-500" />
                        <span className="text-sm sm:text-base">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Question Input */}
              <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg shadow-sm">
                <h2 className="font-bold text-lg sm:text-xl mb-4 text-gray-800">Ask About This Document</h2>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={handleQuestionInputChange}
                    placeholder="Type your question here..."
                    className="flex-1 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={isAskingQuestion || !userQuestion.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                    type="button"
                  >
                    {isAskingQuestion ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        <span>Asking...</span>
                      </div>
                    ) : (
                      'Ask'
                    )}
                  </button>
                </div>
                
                {/* Error display for questions */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm sm:text-base">{error}</p>
                  </div>
                )}
                
                {/* Answer display */}
                {answer && (
                  <div className="bg-green-50 border border-green-200 p-4 sm:p-6 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h3 className="font-bold text-green-800">Answer</h3>
                    </div>
                    <div className="text-sm sm:text-base">
                      {formatText(answer.answer)}
                    </div>
                  </div>
                )}
              </div>

              {/* Data Persistence Notice */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 sm:p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-2">Important Notice:</p>
                    <p className="leading-relaxed">Your summaries and answers are not permanently stored. If you find the information valuable, please copy and save it elsewhere before leaving this page.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summarizer;