import React, { useState, useEffect } from 'react';
import { FileText, Upload, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

  const agentSteps = [
    'Core Medical Researcher is scanning your indexed library context...',
    'Clinical Trials Navigator is querying global trial databases...',
    'Drug Safety Auditor is extracting warning data via openFDA...',
    'Guideline Compliance Officer is ensuring standard NIH criteria alignment...',
    'Patient Communication Specialist is drafting accessible prose...',
    'Medical Practice Advocacy Specialist is assembling the structural PDF manifest...'
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setActiveAgentIndex((current) => {
          if (current < 5) return current + 1; // Increment step by step up to the 6th agent
          return current;
        });
      }, 6000);
    } else {
      setActiveAgentIndex(-1);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const incomingFiles = Array.from(e.target.files);
      setSelectedFiles(prevFiles => {
        // Prevent duplicate files with the exact same name and size from cluttering the queue
        const filtered = incomingFiles.filter(
          incoming => !prevFiles.some(existing => existing.name === incoming.name && existing.size === incoming.size)
        );
        return [...prevFiles, ...filtered];
      });
      setUploadSuccess(false);
      setErrorMessage('');
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setErrorMessage('');
    
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Upload initialization failed.');
      setUploadSuccess(true);
      setSelectedFiles([]);
    } catch (err) {
      setErrorMessage('Failed to connect to backend server. Make sure your Render instance is fully live and Firebase auth is valid.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setActiveAgentIndex(0); // Instantly light up the first agent (Core Medical Researcher)
    setErrorMessage('');
    setAnalysisResult('');

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Server encountered an orchestration fault.');
      }

      const data = await response.json();
      setAnalysisResult(data.result || data.summary || data.answer || 'Processing complete.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch translation loops.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Upload className="mr-2 h-5 w-5 text-blue-600" /> Source Library Upload
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer relative bg-gray-50">
              <input 
                type="file" 
                multiple 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-semibold">Drag medical PDFs here, or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">Accepts multiple academic or clinical files simultaneously</p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Queued Files ({selectedFiles.length})</p>
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700 bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate flex-grow">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      disabled={isUploading}
                      className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none disabled:opacity-50"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" /> Indexing Documents into ChromaDB...
                    </>
                  ) : 'Upload and Process Documents'}
                </button>
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-green-700 font-semibold bg-green-50 border border-green-200 p-3 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>Documents successfully chunked and vector indexed!</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Clinical Research Inquiry</h2>
            <textarea
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a precise medical question across your library context (e.g., 'What are the documented safety warnings and adverse exclusion profiles?')"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !query.trim()}
              className="w-full mt-4 inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" /> Orchestrating CrewAI Loop...
                </>
                  ) : 'Translate & Summarize'}
            </button>
          </div>

          {analysisResult && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 prose max-w-none">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 m-0">Consolidated Clinical Interpretation</h2>
                <button 
                  onClick={() => window.open(`${import.meta.env.VITE_API_URL}/download-latest-report`, '_blank')}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
                >
                  Download Standardized PDF Report
                </button>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {analysisResult}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Orchestration Tracker</h2>
          <div className="space-y-6">
            {agentSteps.map((step, idx) => {
              let state = 'pending';
              if (activeAgentIndex === idx) state = 'active';
              if (activeAgentIndex > idx || (analysisResult && !isAnalyzing)) state = 'completed';

              return (
                <div key={idx} className="flex items-start space-x-3 transition-opacity duration-300">
                  <div className="mt-0.5 flex-shrink-0">
                    {state === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {state === 'active' && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
                    {state === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-gray-200 bg-gray-100" />}
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm font-medium ${
                      state === 'active' ? 'text-blue-600 font-semibold animate-pulse' : 
                      state === 'completed' ? 'text-gray-900 font-medium' : 'text-gray-400'
                    }`}>
                      {step}
                    </p>
                    {state === 'active' && (
                      <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-600 h-full w-1/2 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
