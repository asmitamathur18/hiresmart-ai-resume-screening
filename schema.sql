-- HireSmart Database Schema

CREATE DATABASE hiresmart;

\c hiresmart;

-- Job Descriptions Table
CREATE TABLE job_descriptions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT NOT NULL,
    required_skills TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes Table
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_text TEXT NOT NULL,
    processed_text TEXT,
    extracted_skills TEXT[],
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match Results Table
CREATE TABLE match_results (
    id SERIAL PRIMARY KEY,
    job_description_id INTEGER REFERENCES job_descriptions(id),
    resume_id INTEGER REFERENCES resumes(id),
    match_score DECIMAL(5,2) NOT NULL,
    similarity_score DECIMAL(5,4),
    suitability VARCHAR(50),
    matching_skills TEXT[],
    missing_skills TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Logs Table
CREATE TABLE chat_logs (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (optional for future authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'recruiter' or 'applicant'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_resumes_filename ON resumes(filename);
CREATE INDEX idx_match_results_score ON match_results(match_score DESC);
CREATE INDEX idx_job_descriptions_created ON job_descriptions(created_at DESC);
CREATE INDEX idx_match_results_jd ON match_results(job_description_id);
CREATE INDEX idx_match_results_resume ON match_results(resume_id);

-- Sample data (optional)
INSERT INTO job_descriptions (title, description, required_skills) VALUES
(
    'Software Engineer Intern',
    'We are looking for a passionate software engineering intern with interest in AI, IoT, or system design. Currently pursuing B.Tech / BE / B.Sc in Computer Science, IT, AI/ML or related fields. Available for a minimum 2-month internship.',
    ARRAY['Python', 'React', 'TypeScript', 'AWS', 'Problem Solving']
);
