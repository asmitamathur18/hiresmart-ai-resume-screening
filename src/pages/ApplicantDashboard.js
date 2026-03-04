import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, MessageCircle, Send, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Career Advisor. Ask me anything about your resume or the job requirements."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    if (!resume) {
      setError('Please upload your resume');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('job_description', jobDescription);
      formData.append('resume', resume);

      const response = await axios.post(`${API_BASE_URL}/evaluate-applicant`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      
      // For chatbot context
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
      };
      reader.readAsText(resume);
      
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }]);

    setChatLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot`, {
        message: userMessage,
        resume_text: resumeText || 'No resume uploaded yet',
        job_description: jobDescription || 'No job description provided'
      });

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      console.error('Chat error:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const quickQuestions = [
    "Should I apply for this role?",
    "What skills should I improve?",
    "How can I strengthen my resume?"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Applicant Advisory</h1>
          </div>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>AI Advisor</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Input Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description you're interested in..."
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Upload Resume</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <label className="cursor-pointer">
                  <span className="text-green-600 font-medium hover:text-green-700">Click to upload</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">PDF, DOCX, TXT supported</p>
              </div>

              {resume && (
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2 text-green-600" />
                  {resume.name}
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Analyzing My Fit...' : 'Analyze My Fit'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Right Panel - Results Section */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6">
                {/* Match Score Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white mb-4">
                      <span className="text-4xl font-bold">{result.match_percentage}%</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Match Score</h2>
                    <p className="text-gray-600">
                      {result.should_apply 
                        ? "You're a good candidate! Consider applying." 
                        : "You might need to strengthen your profile for this role."}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Matching Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.skills_found && result.skills_found.length > 0 ? (
                          result.skills_found.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-200 text-green-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">None identified</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                        Missing / To Improve
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.skills_missing && result.skills_missing.length > 0 ? (
                          result.skills_missing.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-orange-200 text-orange-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Great! You have all key skills</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Recommendations</h3>
                  <ul className="space-y-3">
                    {result.recommendations && result.recommendations.length > 0 ? (
                      result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">Your resume looks great for this role!</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analysis Yet</h3>
                <p className="text-gray-500 mb-6">
                  Check your resume fit and get improvement tips
                </p>
                <p className="text-sm text-gray-400">
                  All chats are for advisory purposes only and they do not guarantee job offers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Chatbot Modal */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col" style={{ height: '600px' }}>
          {/* Chat Header */}
          <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">AI Advisor</h3>
            </div>
            <button onClick={() => setChatOpen(false)} className="hover:bg-green-700 rounded p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChatInput(question);
                    handleSendMessage();
                  }}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;
