# HireSmart – AI-Based Dual-Mode Resume Evaluation Platform

HireSmart is an AI-powered resume evaluation platform designed for both recruiters and job applicants.  
The system uses semantic similarity techniques powered by OpenAI embeddings to evaluate how well a resume matches a job description.

The platform supports **two operating modes**:

• **Recruiter Mode** – Automated screening and ranking of multiple resumes  
• **Applicant Mode** – Self-evaluation and skill gap analysis before applying for jobs  

The goal of the system is to assist decision-making in recruitment by providing **transparent, explainable, and data-driven evaluation results**.

---

## Key Features

### Recruiter Mode
- Upload multiple resumes (PDF / DOCX)
- Upload or paste a job description
- Automated resume screening and ranking
- Candidate classification:
  - Suitable
  - Partially Suitable
  - Not Suitable
- Skill match and skill gap analysis
- Resume evaluation reports

### Applicant Mode
- Resume self-evaluation against job descriptions
- Match score generation
- Skill gap identification
- Resume improvement suggestions
- AI-assisted guidance chatbot

---

## AI & NLP Pipeline

The system uses a multi-stage processing pipeline:

1. Resume & job description input
2. Text extraction from PDF/DOCX files
3. NLP preprocessing
   - Tokenization
   - Stopword removal
   - Text normalization
4. Skill extraction and normalization
5. Semantic similarity computation using OpenAI embeddings
6. Cosine similarity scoring (0–100%)
7. Rule-based classification and recommendations

This design ensures the system produces **explainable results instead of black-box predictions**.

---

## System Architecture

HireSmart follows a **client–server architecture**.

Frontend:
- React.js / HTML / CSS
- Role-based interface
- Resume upload interface
- Results dashboard
- Chatbot interface

Backend:
- Python (Flask)
- API request handling
- Resume text extraction
- NLP preprocessing
- AI-based similarity scoring
- Candidate classification and recommendations

External Services:
- OpenAI Embeddings API for semantic matching
- GitHub API (optional) for developer profile analysis

---

## Technologies Used

Frontend
- React.js
- HTML
- CSS
- JavaScript

Backend
- Python
- Flask

AI / NLP
- OpenAI Embeddings API
- Cosine similarity scoring

Document Processing
- PyPDF2
- python-docx

Other Tools
- Git
- GitHub

---

## Project Workflow

1. User selects Recruiter Mode or Applicant Mode
2. Resume(s) and job description are uploaded
3. Backend extracts and cleans text
4. NLP preprocessing and skill extraction occur
5. OpenAI embeddings are generated
6. Similarity score is computed
7. Classification and recommendations are generated
8. Results are displayed on the dashboard
9. Applicant mode enables chatbot guidance

---

## Project Structure
hiresmart
│
├── backend
├── frontend
│   ├── node_modules
│   ├── public
│   ├── src
│
├── .env.example
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
│
├── docker-compose.yml
│
├── PROJECT_OVERVIEW.md
├── QUICKSTART.md
├── SETUP_GUIDE.md
├── START_HERE.md
│
└── README.md


---

## Purpose of the Project

Recruiters often spend significant time manually reviewing resumes.  
HireSmart demonstrates how AI-assisted systems can support this process by providing structured evaluation, ranking candidates, and offering transparent recommendations.

The system acts as a **decision-support tool**, not a replacement for human judgment.

---

## Future Improvements

- Advanced machine learning-based resume ranking
- Improved skill extraction models
- Resume parsing using transformer-based NLP models
- Integration with job portals
- Analytics dashboard for recruiters

---

## Author

Asmita Mathur  
B.Tech – Artificial Intelligence and Machine Learning  
Keshav Memorial Institute of Technology
