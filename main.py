from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import pdfplumber
import docx
import spacy
import openai
import numpy as np
from pydantic import BaseModel
import os
from io import BytesIO
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime

app = FastAPI(title="HireSmart API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY", "your-api-key-here")

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Database connection
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "hiresmart"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
        cursor_factory=RealDictCursor
    )

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    resume_text: str
    job_description: str

class JobDescription(BaseModel):
    description: str

# Utility functions
def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        with pdfplumber.open(BytesIO(file_content)) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
            return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting PDF: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(BytesIO(file_content))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting DOCX: {str(e)}")

def extract_text_from_file(file: UploadFile) -> str:
    """Extract text based on file type"""
    content = file.file.read()
    filename = file.filename.lower()
    
    if filename.endswith('.pdf'):
        return extract_text_from_pdf(content)
    elif filename.endswith('.docx'):
        return extract_text_from_docx(content)
    elif filename.endswith('.txt'):
        return content.decode('utf-8')
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

def preprocess_text(text: str) -> str:
    """Preprocess text using spaCy"""
    doc = nlp(text.lower())
    tokens = [
        token.lemma_ for token in doc 
        if not token.is_stop and not token.is_punct and token.is_alpha
    ]
    return " ".join(tokens)

def get_embedding(text: str) -> List[float]:
    """Get OpenAI embedding for text"""
    try:
        response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input=text
        )
        return response['data'][0]['embedding']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {str(e)}")

def calculate_similarity(embedding1: List[float], embedding2: List[float]) -> float:
    """Calculate cosine similarity between two embeddings"""
    vec1 = np.array(embedding1)
    vec2 = np.array(embedding2)
    similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    return float(similarity)

def extract_skills(text: str) -> List[str]:
    """Extract skills from text using simple keyword matching"""
    common_skills = [
        'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'aws', 'docker',
        'kubernetes', 'git', 'machine learning', 'deep learning', 'nlp', 'fastapi',
        'django', 'flask', 'postgresql', 'mongodb', 'typescript', 'tailwind',
        'html', 'css', 'rest api', 'graphql', 'redis', 'kafka', 'spark',
        'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'opencv',
        'communication', 'teamwork', 'problem solving', 'leadership'
    ]
    
    text_lower = text.lower()
    found_skills = [skill for skill in common_skills if skill in text_lower]
    return found_skills

def categorize_suitability(match_score: float) -> str:
    """Categorize candidate based on match score"""
    if match_score >= 0.75:
        return "Suitable"
    elif match_score >= 0.60:
        return "Partially Suitable"
    else:
        return "Not Suitable"

# API Endpoints
@app.get("/")
async def root():
    return {"message": "HireSmart API is running"}

@app.post("/evaluate-recruiter")
async def evaluate_recruiter(
    job_description: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    """Evaluate multiple resumes against job description for recruiters"""
    try:
        # Preprocess job description
        jd_text = preprocess_text(job_description)
        jd_embedding = get_embedding(jd_text)
        
        # Extract skills from JD
        jd_skills = extract_skills(job_description)
        
        results = []
        
        for resume_file in resumes:
            try:
                # Extract and preprocess resume text
                resume_text = extract_text_from_file(resume_file)
                resume_processed = preprocess_text(resume_text)
                
                # Get embedding and calculate similarity
                resume_embedding = get_embedding(resume_processed)
                similarity_score = calculate_similarity(jd_embedding, resume_embedding)
                
                # Extract skills from resume
                resume_skills = extract_skills(resume_text)
                
                # Find matching and missing skills
                matching_skills = list(set(resume_skills) & set(jd_skills))
                missing_skills = list(set(jd_skills) - set(resume_skills))
                
                # Calculate percentage
                match_percentage = int(similarity_score * 100)
                
                # Categorize suitability
                suitability = categorize_suitability(similarity_score)
                
                results.append({
                    "filename": resume_file.filename,
                    "match_score": match_percentage,
                    "suitability": suitability,
                    "skills_found": matching_skills,
                    "skills_missing": missing_skills,
                    "raw_score": similarity_score
                })
                
            except Exception as e:
                results.append({
                    "filename": resume_file.filename,
                    "error": str(e),
                    "match_score": 0,
                    "suitability": "Error"
                })
        
        # Sort by match score
        results.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        
        return {
            "success": True,
            "total_resumes": len(results),
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate-applicant")
async def evaluate_applicant(
    job_description: str = Form(...),
    resume: UploadFile = File(...)
):
    """Evaluate single resume for applicants"""
    try:
        # Extract and preprocess texts
        resume_text = extract_text_from_file(resume)
        resume_processed = preprocess_text(resume_text)
        jd_processed = preprocess_text(job_description)
        
        # Get embeddings
        resume_embedding = get_embedding(resume_processed)
        jd_embedding = get_embedding(jd_processed)
        
        # Calculate similarity
        similarity_score = calculate_similarity(resume_embedding, jd_embedding)
        match_percentage = int(similarity_score * 100)
        
        # Extract skills
        jd_skills = extract_skills(job_description)
        resume_skills = extract_skills(resume_text)
        
        matching_skills = list(set(resume_skills) & set(jd_skills))
        missing_skills = list(set(jd_skills) - set(resume_skills))
        
        # Generate recommendations using GPT
        recommendations = []
        if missing_skills:
            recommendations.append(f"Consider adding these skills to your resume: {', '.join(missing_skills[:3])}")
        if match_percentage < 75:
            recommendations.append("Highlight your experience with cloud platforms more clearly")
            recommendations.append("Add quantifiable metrics to your project descriptions")
        
        return {
            "success": True,
            "match_percentage": match_percentage,
            "skills_found": matching_skills,
            "skills_missing": missing_skills,
            "recommendations": recommendations,
            "should_apply": match_percentage >= 60
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot")
async def chatbot(chat: ChatMessage):
    """AI chatbot for resume advice"""
    try:
        prompt = f"""You are an AI Career Advisor helping a job applicant. 
        
Job Description:
{chat.job_description}

Applicant's Resume:
{chat.resume_text}

User Question: {chat.message}

Provide helpful, specific advice about:
- Whether they should apply
- What skills to improve
- How to strengthen their resume
- Specific projects or experiences to highlight

Keep your response concise and actionable."""

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI career advisor."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return {
            "success": True,
            "response": response['choices'][0]['message']['content']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)