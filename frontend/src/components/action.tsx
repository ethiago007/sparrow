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
  const [error, setError] = useState<string>('');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<AnswerResponse | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save state to memory (since sessionStorage is not available)
  const [savedState, setSavedState] = useState<SavedState>({
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
    // This would navigate to the previous page in a real app
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

      const response = await fetch('http://localhost:8000/process', {
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

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question', userQuestion);

      const response = await fetch('https://sparrow-95mb.onrender.com', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get answer');
      }

      const data: AnswerResponse = await response.json();
      setAnswer(data);
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

  return (
    <div className="max-w-2xl mx-auto p-4 pt-30">
      {/* Back Button - always show at the top */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors group"
        type="button"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-6">PDF Summarizer</h1>
      
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
                <div className="flex items-center justify-center gap-3">
                  <FileText className="text-[#090909]" />
                  <span className="font-medium">{file.name}</span>
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
            className={`w-full py-2 px-4 mb-6 rounded-md font-medium ${
              isProcessing ? 'bg-[#090909]' : 'bg-[#090909] hover:bg-[#090909]'
            } text-white transition-colors disabled:cursor-not-allowed`}
            type="button"
          >
            {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : 'Summarize PDF'}
          </button>
        </>
      )}
      
      {/* Results */}
      {results?.summary && (
        <div className="space-y-6">
          {/* Upload Another File Button - positioned at the top of results */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <FileText size={16} />
              <span className="text-sm">Processed: {fileName}</span>
            </div>
            <button
              onClick={handleUploadAnother}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium"
              type="button"
            >
              <RotateCcw size={16} />
              Upload Another File
            </button>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-bold text-lg mb-2">Document Summary</h2>
            <div className="prose max-w-none">
              {results.summary.split('\n').map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          
          {/* Questions */}
          {results.questions && results.questions.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">Key Questions</h2>
              <ul className="space-y-2">
                {results.questions.map((question: string, i: number) => (
                  <li 
                    key={i} 
                    className="flex items-start cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <ChevronRight className="h-4 w-4 mt-1 mr-2 flex-shrink-0 text-blue-500" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Question Input */}
          <div className="bg-white border p-4 rounded-lg">
            <h2 className="font-bold text-lg mb-2">Ask About This Document</h2>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={userQuestion}
                onChange={handleQuestionInputChange}
                placeholder="Type your question here..."
                className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAskQuestion}
                disabled={isProcessing || !userQuestion.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                type="button"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Ask'}
              </button>
            </div>
            {answer && (
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <p className="font-medium">Answer:</p>
                <p>{answer.answer}</p>
              </div>
            )}
          </div>

          {/* Data Persistence Notice */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notice:</p>
                <p>Your summaries and answers are not permanently stored. If you find the information valuable, please copy and save it elsewhere before leaving this page.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summarizer;