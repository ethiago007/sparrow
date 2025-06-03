from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import os
import io
import re
import httpx
from typing import List
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PDF Summarizer API with Groq", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Groq API configuration - GET FREE API KEY FROM groq.com
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Add this to your .env file

if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY not found! Get one free at groq.com")

def extract_text_from_pdf(pdf_file) -> str:
    """Extract text from PDF with better error handling"""
    try:
        # Reset file pointer to beginning
        pdf_file.seek(0)
        
        # Read the file content
        pdf_content = pdf_file.read()
        pdf_file_obj = io.BytesIO(pdf_content)
        
        pdf_reader = PyPDF2.PdfReader(pdf_file_obj)
        
        if len(pdf_reader.pages) == 0:
            raise ValueError("PDF has no pages")
        
        # Extract text from all pages
        text_parts = []
        for i, page in enumerate(pdf_reader.pages):
            try:
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text_parts.append(page_text.strip())
                logger.info(f"Extracted text from page {i+1}")
            except Exception as e:
                logger.warning(f"Could not extract text from page {i+1}: {str(e)}")
                continue
        
        if not text_parts:
            raise ValueError("No text could be extracted from the PDF")
        
        full_text = "\n".join(text_parts)
        logger.info(f"Total extracted text length: {len(full_text)} characters")
        
        return full_text
        
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Could not extract text from PDF: {str(e)}")

def clean_text(text: str) -> str:
    """Clean extracted text"""
    # Remove excessive whitespace and newlines
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text: str, max_chars: int = 6000) -> List[str]:
    """Split text into chunks for processing"""
    if len(text) <= max_chars:
        return [text]
    
    chunks = []
    sentences = text.split('. ')
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk + sentence) <= max_chars:
            current_chunk += sentence + ". "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

async def call_groq_api(prompt: str, max_tokens: int = 1500) -> str:
    """Make API call to Groq (FREE but needs API key)"""
    try:
        if not GROQ_API_KEY:
            logger.error("No Groq API key provided!")
            return ""
        
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Free Groq models (super fast!)
        models = [
            "llama3-70b-8192",     # Better quality for detailed summaries
            "llama3-8b-8192",      # Fast and good
            "mixtral-8x7b-32768",  # Good alternative
            "gemma-7b-it"          # Another option
        ]
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            for model in models:
                try:
                    payload = {
                        "messages": [
                            {
                                "role": "user", 
                                "content": prompt
                            }
                        ],
                        "model": model,
                        "max_tokens": max_tokens,
                        "temperature": 0.3,
                        "top_p": 0.9
                    }
                    
                    response = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers=headers,
                        json=payload
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        content = result["choices"][0]["message"]["content"]
                        return content.strip()
                    elif response.status_code == 429:
                        # Rate limit, try next model
                        logger.warning(f"Rate limit hit for {model}, trying next...")
                        continue
                    else:
                        logger.warning(f"API call failed for {model}: {response.status_code}")
                        continue
                        
                except Exception as e:
                    logger.warning(f"Error with model {model}: {str(e)}")
                    continue
        
        return ""
        
    except Exception as e:
        logger.error(f"Error calling Groq API: {str(e)}")
        return ""

def generate_detailed_fallback_summary(text: str) -> str:
    """Generate a more detailed fallback summary using text processing"""
    try:
        sentences = text.split('.')
        summary_sentences = []
        
        # Add first few sentences if meaningful
        for i, sentence in enumerate(sentences[:3]):
            sentence = sentence.strip()
            if len(sentence) > 20:
                summary_sentences.append(sentence)
        
        # Look for sentences with key terms
        key_terms = ['important', 'significant', 'main', 'key', 'primary', 'conclusion', 
                    'result', 'finding', 'analysis', 'research', 'study', 'data', 
                    'evidence', 'shows', 'indicates', 'suggests', 'demonstrates']
        
        for sentence in sentences[3:15]:  # Look at more sentences
            sentence = sentence.strip()
            if len(sentence) > 30 and any(term in sentence.lower() for term in key_terms):
                summary_sentences.append(sentence)
                if len(summary_sentences) >= 8:  # Allow more sentences
                    break
        
        # Add concluding sentences
        for sentence in sentences[-3:]:
            sentence = sentence.strip()
            if len(sentence) > 30 and sentence not in summary_sentences:
                summary_sentences.append(sentence)
                if len(summary_sentences) >= 10:
                    break
        
        if summary_sentences:
            detailed_summary = '. '.join(summary_sentences) + '.'
            return detailed_summary
        else:
            return text[:800] + "..." if len(text) > 800 else text
            
    except Exception as e:
        logger.error(f"Error in detailed fallback summary: {str(e)}")
        return "Unable to generate summary due to processing error."

async def generate_summary_with_groq(text: str) -> str:
    """Generate detailed summary using Groq with chunking for large documents"""
    try:
        # Handle large documents by chunking
        chunks = chunk_text(text, max_chars=6000)
        
        if len(chunks) == 1:
            # Single chunk - generate detailed summary with better formatting
            prompt = f"""Please provide a comprehensive and well-structured summary of the following document. 

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Document Overview:**
[Brief description of what this document is about]

**Main Purpose:**
[What is the primary goal or purpose of this document]

**Key Points:**
• [First major point with explanation]
• [Second major point with explanation]
• [Third major point with explanation]
• [Fourth major point with explanation]
• [Additional points as needed]

**Important Details:**
[Specific details, examples, data, or evidence mentioned in the document]

**Conclusions & Implications:**
[Main takeaways, conclusions, or implications from the document]

Make sure to use proper formatting with headers, bullet points, and clear paragraphs for easy reading.

Document:
{text}"""
            
            summary = await call_groq_api(prompt, max_tokens=800)
            
        else:
            # Multiple chunks - summarize each and combine
            chunk_summaries = []
            
            for i, chunk in enumerate(chunks):
                logger.info(f"Summarizing chunk {i+1}/{len(chunks)}")
                
                prompt = f"""Summarize this section of a larger document in detail. Focus on the main points, key information, and important details:

Section {i+1}:
{chunk}

Detailed section summary:"""
                
                chunk_summary = await call_groq_api(prompt, max_tokens=600)
                if chunk_summary:
                    chunk_summaries.append(f"**Section {i+1}:**\n{chunk_summary}")
            
            if chunk_summaries:
                # Combine all chunk summaries
                combined_text = "\n\n".join(chunk_summaries)
                
                # Generate final comprehensive summary with better formatting
                final_prompt = f"""Based on these section summaries from a document, create a comprehensive and well-formatted overall summary:

{combined_text}

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Document Overview:**
[Brief description of the overall document]

**Main Purpose:**
[Primary goal or purpose across all sections]

**Key Points:**
• [First major point from all sections]
• [Second major point from all sections]
• [Third major point from all sections]
• [Fourth major point from all sections]
• [Additional points as needed]

**Important Details:**
[Specific details, examples, data from all sections]

**Conclusions & Implications:**
[Overall conclusions and implications]

Use proper formatting with headers and bullet points for clarity."""
                
                summary = await call_groq_api(final_prompt, max_tokens=1000)
            else:
                summary = ""
        
        if summary and len(summary.strip()) > 50:
            return summary.strip()
        else:
            logger.warning("Groq summary too short or empty, using fallback")
            return generate_formatted_fallback_summary(text)
        
    except Exception as e:
        logger.error(f"Error generating detailed summary: {str(e)}")
        return generate_formatted_fallback_summary(text)

def generate_formatted_fallback_summary(text: str) -> str:
    """Generate a formatted fallback summary"""
    try:
        sentences = text.split('.')
        
        # Extract key sentences
        key_sentences = []
        for sentence in sentences[:10]:  # First 10 sentences
            sentence = sentence.strip()
            if len(sentence) > 30:
                key_sentences.append(sentence)
                if len(key_sentences) >= 4:
                    break
        
        # Format the fallback summary
        formatted_summary = f"""**Document Overview:**
This document contains {len(sentences)} sentences of content covering various topics and information.

**Key Points:**
• {key_sentences[0] if len(key_sentences) > 0 else 'Content analysis in progress'}
• {key_sentences[1] if len(key_sentences) > 1 else 'Additional information available'}
• {key_sentences[2] if len(key_sentences) > 2 else 'Further details provided'}
• {key_sentences[3] if len(key_sentences) > 3 else 'More content to review'}

**Important Details:**
The document provides detailed information and context about the subject matter, with specific examples and supporting evidence throughout the text.

**Conclusions & Implications:**
This document serves as a comprehensive resource providing valuable insights and information for readers seeking to understand the covered topics."""
        
        return formatted_summary
        
    except Exception as e:
        logger.error(f"Error in formatted fallback summary: {str(e)}")
        return "**Summary Error:** Unable to generate summary due to processing error."

async def generate_questions_with_groq(text: str) -> List[str]:
    """Generate questions using Groq"""
    try:
        max_chars = 2500
        if len(text) > max_chars:
            text = text[:max_chars] + "..."
        
        prompt = f"""Based on the following document, generate 5 relevant and specific questions that would help someone understand the key content:

{text}

Questions:
1."""
        
        questions_text = await call_groq_api(prompt, max_tokens=400)
        
        questions = []
        if questions_text:
            # Split by newlines and numbers
            lines = questions_text.split('\n')
            for line in lines:
                line = line.strip()
                # Remove numbering
                line = re.sub(r'^\d+\.\s*', '', line)
                if line and len(line) > 10:
                    if not line.endswith('?'):
                        line += '?'
                    questions.append(line)
        
        # Fallback questions if generation fails
        if len(questions) < 3:
            fallback_questions = generate_fallback_questions(text)
            questions.extend(fallback_questions)
        
        return questions[:5]
        
    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        return generate_fallback_questions(text)

def generate_fallback_questions(text: str) -> List[str]:
    """Generate basic questions based on text analysis"""
    questions = [
        "What is the main topic of this document?",
        "What are the key points mentioned?",
        "What important information is provided?",
        "What are the main findings or conclusions?",
        "What should readers know from this document?"
    ]
    
    # Customize based on content
    text_lower = text.lower()
    if 'research' in text_lower or 'study' in text_lower:
        questions[0] = "What research or study is presented in this document?"
        questions[3] = "What are the research findings and conclusions?"
    elif 'business' in text_lower or 'company' in text_lower:
        questions[0] = "What business topics are covered in this document?"
        questions[2] = "What business information is provided?"
    
    return questions

async def answer_question_with_groq(text: str, question: str) -> str:
    """Answer question using Groq"""
    try:
        max_chars = 2500
        if len(text) > max_chars:
            text = text[:max_chars] + "..."
        
        prompt = f"""Please answer the following question based on the provided document. Be specific and use information from the document:

Question: {question}

Document: {text}

Answer:"""
        
        answer = await call_groq_api(prompt, max_tokens=300)
        
        if answer and len(answer.strip()) > 10:
            return answer.strip()
        else:
            return generate_simple_answer(text, question)
        
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        return generate_simple_answer(text, question)

def generate_simple_answer(text: str, question: str) -> str:
    """Generate simple answer using text search"""
    try:
        question_lower = question.lower()
        question_words = re.findall(r'\b\w+\b', question_lower)
        question_words = [w for w in question_words if len(w) > 3 and w not in ['what', 'where', 'when', 'how', 'why', 'which', 'this', 'that']]
        
        if not question_words:
            return "I need more specific terms in the question to find relevant information."
        
        sentences = text.split('.')
        relevant_sentences = []
        
        for sentence in sentences:
            if any(word in sentence.lower() for word in question_words):
                relevant_sentences.append(sentence.strip())
                if len(relevant_sentences) >= 2:
                    break
        
        if relevant_sentences:
            return '. '.join(relevant_sentences) + '.'
        else:
            return f"I couldn't find specific information about '{' '.join(question_words)}' in the document."
            
    except Exception as e:
        return "I encountered an error while trying to answer that question."

@app.get("/")
async def root():
    return {
        "message": "PDF Summarizer API with Groq is running", 
        "status": "healthy",
        "api_type": "groq_free",
        "has_api_key": bool(GROQ_API_KEY),
        "features": "Enhanced detailed summaries with better formatting"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "api_type": "groq_free",
        "message": "PDF processor with Groq AI ready - Enhanced version with formatting",
        "has_api_key": bool(GROQ_API_KEY)
    }

@app.post("/process")
async def process_pdf(file: UploadFile = File(...)):
    """Process PDF and return detailed summary with questions"""
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        if file.size and file.size > 25 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 25MB")
        
        logger.info(f"Processing PDF: {file.filename}")
        
        text = extract_text_from_pdf(file.file)
        
        if len(text.strip()) < 50:
            raise HTTPException(status_code=400, detail="PDF appears to be empty or contains very little text")
        
        text = clean_text(text)
        
        logger.info("Generating detailed summary with Groq...")
        summary = await generate_summary_with_groq(text)
        
        logger.info("Generating questions with Groq...")
        questions = await generate_questions_with_groq(text)
        
        logger.info("Processing completed successfully")
        
        return {
            "summary": summary,
            "questions": questions,
            "text_length": len(text),
            "summary_length": len(summary),
            "status": "success",
            "api_type": "groq_free_enhanced_formatted",
            "filename": file.filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/ask")
async def ask_question(file: UploadFile = File(...), question: str = Form(...)):
    """Answer a question about the PDF content using Groq"""
    try:
        if not question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        logger.info(f"Answering question with Groq: {question}")
        
        text = extract_text_from_pdf(file.file)
        text = clean_text(text)
        
        answer = await answer_question_with_groq(text, question)
        
        logger.info("Question answered successfully")
        
        return {
            "answer": answer,
            "status": "success",
            "api_type": "groq_free_enhanced_formatted"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)