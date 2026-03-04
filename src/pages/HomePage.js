import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">AI Recruitment Assistant</h1>
          <p className="text-xl text-gray-600">Select your role to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Recruiter Mode Card */}
          <div 
            onClick={() => navigate('/recruiter')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Recruiter Mode</h2>
            <p className="text-gray-600 text-center mb-6">
              Evaluate multiple resumes instantly. Get AI-driven insights and shortlist the best candidates efficiently.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Enter Portal →
            </button>
          </div>

          {/* Applicant Mode Card */}
          <div 
            onClick={() => navigate('/applicant')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Applicant Mode</h2>
            <p className="text-gray-600 text-center mb-6">
              Analyze your resume against job descriptions. Get feedback, improvement tips, and AI advisory.
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Get Advice →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
