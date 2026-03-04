import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setResumes(files);
  };

  const handleEvaluate = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    if (resumes.length === 0) {
      setError('Please upload at least one resume');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('job_description', jobDescription);
      
      resumes.forEach((resume) => {
        formData.append('resumes', resume);
      });

      const response = await axios.post(`${API_BASE_URL}/evaluate-recruiter`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during evaluation');
      console.error('Evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSuitabilityColor = (suitability) => {
    switch (suitability) {
      case 'Suitable':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Partially Suitable':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Not Suitable':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSuitabilityIcon = (suitability) => {
    switch (suitability) {
      case 'Suitable':
        return <CheckCircle className="w-5 h-5" />;
      case 'Partially Suitable':
        return <AlertCircle className="w-5 h-5" />;
      case 'Not Suitable':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Recruiter Dashboard</h1>
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
                placeholder="Enter job description, eligibility, required skills..."
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Upload Resumes</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 font-medium hover:text-blue-700">Click to upload resumes</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">PDF, DOCX, TXT supported</p>
              </div>

              {resumes.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">{resumes.length} files selected:</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {resumes.map((file, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Evaluating Candidates...' : 'Evaluate Candidates'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Right Panel - Results Section */}
          <div className="lg:col-span-2">
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
                  <p className="text-gray-600">Total Resumes Evaluated: {results.total_resumes}</p>
                </div>

                {results.results.map((result, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{result.filename}</h3>
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border mt-2 ${getSuitabilityColor(result.suitability)}`}>
                          {getSuitabilityIcon(result.suitability)}
                          <span className="font-medium">{result.suitability}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">{result.match_score}%</div>
                        <div className="text-sm text-gray-500">Match Score</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Skills Found
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.skills_found && result.skills_found.length > 0 ? (
                            result.skills_found.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">None identified</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-orange-600" />
                          Missing / To Improve
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.skills_missing && result.skills_missing.length > 0 ? (
                            result.skills_missing.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {result.error && (
                      <div className="mt-4 text-red-600 text-sm">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Yet</h3>
                <p className="text-gray-500">
                  Enter a job description and upload resumes to see AI-powered evaluation results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
