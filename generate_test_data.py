"""
Generate sample resumes for testing HireSmart
Run this script to create test PDF/TXT files
"""

import os
from datetime import datetime

# Sample resume data
resumes_data = [
    {
        "name": "resume1.txt",
        "content": """
ALICE JOHNSON
Software Engineer | alice.johnson@email.com | +1-234-567-8901

SKILLS
Programming: Python, JavaScript, TypeScript, Java
Frameworks: React, Node.js, FastAPI, Django
Databases: PostgreSQL, MongoDB, Redis
Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
Tools: Git, CI/CD, Jenkins

EXPERIENCE

Senior Software Engineer | TechCorp Inc.
June 2021 - Present
• Developed microservices architecture using FastAPI and PostgreSQL
• Built responsive web applications with React and TypeScript
• Implemented CI/CD pipelines reducing deployment time by 60%
• Led a team of 4 developers on cloud migration to AWS

Software Developer | StartupXYZ
Jan 2019 - May 2021
• Created REST APIs using Python and Django
• Developed frontend components using React
• Optimized database queries improving performance by 40%

EDUCATION
B.Tech in Computer Science | MIT | 2015-2019
GPA: 3.8/4.0

PROJECTS
• AI Resume Screener: Built using OpenAI, FastAPI, React
• E-commerce Platform: MERN stack with payment integration
• Real-time Chat Application: WebSocket, Node.js, React
"""
    },
    {
        "name": "resume2.txt",
        "content": """
BOB SMITH
Full Stack Developer | bob.smith@email.com | +1-987-654-3210

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, SQL
Frontend: React, Vue.js, HTML5, CSS3, Tailwind
Backend: Node.js, Express, FastAPI
Databases: PostgreSQL, MySQL, MongoDB
DevOps: Docker, AWS, Git, GitHub Actions

PROFESSIONAL EXPERIENCE

Full Stack Developer | Digital Solutions Ltd.
March 2020 - Present
• Designed and developed web applications using React and Node.js
• Built RESTful APIs with Express and FastAPI
• Integrated third-party APIs including payment gateways
• Collaborated with cross-functional teams using Agile methodology

Junior Developer | WebDev Agency
June 2018 - Feb 2020
• Developed responsive websites using HTML, CSS, JavaScript
• Maintained client databases using MySQL
• Performed code reviews and testing

EDUCATION
B.E. in Information Technology | State University | 2014-2018

CERTIFICATIONS
• AWS Certified Developer - Associate
• React Professional Certification

ACHIEVEMENTS
• Winner of HackTech 2022 for AI-powered recruitment tool
• Published article on Medium about FastAPI best practices
"""
    },
    {
        "name": "resume3.txt",
        "content": """
CHARLIE DAVIS
Backend Engineer | charlie.davis@email.com | +1-555-123-4567

CORE COMPETENCIES
Backend: Python, Java, Go
Web Frameworks: Django, Flask, Spring Boot
Databases: PostgreSQL, MySQL, Oracle
Cloud Platforms: AWS, Google Cloud Platform
Other: Docker, Kubernetes, Redis, RabbitMQ

WORK HISTORY

Backend Engineer | CloudTech Systems
July 2020 - Present
• Architected scalable backend systems handling 1M+ requests/day
• Implemented microservices using Python and Docker
• Designed database schemas for PostgreSQL
• Set up monitoring and logging with ELK stack

Software Engineer | DataCorp
Jan 2018 - June 2020
• Developed RESTful APIs using Django and Flask
• Optimized SQL queries reducing response time by 50%
• Integrated Redis for caching layer

EDUCATION
M.S. in Computer Science | Tech Institute | 2016-2018
B.Tech in Computer Engineering | Engineering College | 2012-2016

PERSONAL PROJECTS
• Distributed Task Queue System using Python and RabbitMQ
• API Gateway with rate limiting and authentication
• Blog platform with Django and PostgreSQL
"""
    },
    {
        "name": "resume4.txt",
        "content": """
DIANA MARTINEZ
Frontend Developer | diana.martinez@email.com | +1-444-555-6666

SKILLS SUMMARY
Frontend: React, Redux, Next.js, TypeScript
Styling: Tailwind CSS, Material-UI, Styled Components
Build Tools: Webpack, Vite, npm
Testing: Jest, React Testing Library
Version Control: Git, GitHub

EMPLOYMENT HISTORY

Frontend Developer | Creative Digital
April 2021 - Present
• Built modern web applications using React and TypeScript
• Implemented responsive designs with Tailwind CSS
• Collaborated with UX designers to create intuitive interfaces
• Wrote unit tests achieving 85% code coverage

UI Developer | Design Studio
Sept 2019 - March 2021
• Created interactive web pages using HTML, CSS, JavaScript
• Developed reusable React components
• Ensured cross-browser compatibility

ACADEMIC BACKGROUND
Bachelor of Science in Computer Science | University | 2015-2019

PORTFOLIO
• Personal website: diana-martinez.dev
• GitHub: github.com/diana-dev

INTERESTS
• Open source contribution
• UI/UX design
• Technical blogging
"""
    }
]

# Create sample resumes directory
output_dir = "sample_resumes"
os.makedirs(output_dir, exist_ok=True)

print("Generating sample resumes for testing...")
print(f"Output directory: {output_dir}/")
print("-" * 50)

for resume in resumes_data:
    filepath = os.path.join(output_dir, resume["name"])
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(resume["content"].strip())
    print(f"✓ Created: {resume['name']}")

print("-" * 50)
print(f"✅ Successfully generated {len(resumes_data)} sample resumes!")
print(f"📁 Location: {os.path.abspath(output_dir)}/")
print("\nYou can now use these files to test the HireSmart application.")
print("\nSample Job Description to test with:")
print("""
Title: Software Engineer Intern

We are looking for a passionate software engineering intern with:
- Interest in AI, IoT, or system design
- Currently pursuing B.Tech / BE / B.Sc in Computer Science, IT, AI/ML or related fields
- Skills in Python, React, TypeScript, AWS
- Available for a minimum 2-month internship
- Good problem-solving and teamwork skills
""")
