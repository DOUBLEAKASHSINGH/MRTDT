import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { UploadCloud, Search, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Fake-but-honest progress indicator for Agent workflow
  useEffect(() => {
    let timeout1: ReturnType<typeof setTimeout>;
    let timeout2: ReturnType<typeof setTimeout>;
    if (isLoading) {
      setLoadingPhase(0); // Researcher
      timeout1 = setTimeout(() => setLoadingPhase(1), 5000); // Writer
      timeout2 = setTimeout(() => setLoadingPhase(2), 12000); // Reviewer
    }
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [isLoading]);

  const loadingMessages = [
    "Researcher is reading papers...",
    "Writer is drafting...",
    "Reviewer is checking..."
  ];

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsUploading(true);
    setStatusMsg(`Uploading ${selectedFile.name}...`);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setStatusMsg(`Success: ${data.filename} indexed!`);
    } catch (err) {
      setStatusMsg('Failed to upload paper');
    } finally {
      setIsUploading(false);
      setTimeout(() => setStatusMsg(''), 5000);
    }
  };

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsLoading(true);
    setTranslation('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/analyze?question=${encodeURIComponent(query)}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.answer) {
        setTranslation(data.answer);
      } else {
        setTranslation('Error retrieving translation.');
      }
    } catch (err) {
      setTranslation('An error occurred while fetching the translation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
        <p className="text-gray-500 mt-1">Upload papers and query them in plain English.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Controls */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Upload Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
            <div className="flex items-center gap-2 mb-4">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Upload Knowledge</h2>
            </div>
            <form onSubmit={handleUpload} className="flex flex-col gap-3">
              <label className="text-sm text-gray-500">Select a medical PDF to analyze</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
              <button 
                type="submit"
                disabled={isUploading || !selectedFile}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all"
              >
                {isUploading ? 'Uploading & Processing...' : 'Upload & Index'}
              </button>
            </form>
            {statusMsg && (
              <p className="mt-4 text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded">{statusMsg}</p>
            )}
          </div>

          {/* Query Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500" />
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">Ask a Query</h2>
            </div>
            <form onSubmit={handleTranslate} className="flex flex-col gap-3">
              <label className="text-sm text-gray-500">Topic or specific question</label>
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What does the paper say about mRNA vaccine efficacy?"
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none placeholder-gray-400"
              />
              <button 
                type="submit"
                disabled={isLoading || !query}
                className="mt-2 w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Translating...
                  </>
                ) : 'Translate & Summarize'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Output */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-2xl flex-grow p-8 shadow-sm flex flex-col relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Translation Results
            </h2>
            
            <div className="flex-grow prose prose-blue max-w-none text-gray-700">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 mt-20">
                  <div className="animate-pulse flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full border-4 border-t-teal-500 border-r-blue-500 border-b-teal-500 border-l-blue-500 animate-spin"></div>
                    <p className="mt-4 font-medium text-lg text-gray-600">
                      {loadingMessages[loadingPhase]}
                    </p>
                    <div className="flex gap-1 mt-2">
                      <div className={`h-2 w-8 rounded-full ${loadingPhase >= 0 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-2 w-8 rounded-full ${loadingPhase >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-2 w-8 rounded-full ${loadingPhase >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    </div>
                  </div>
                </div>
              ) : translation ? (
                <div className="animate-fade-in-up">
                  <ReactMarkdown>{translation}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-20">
                  <FileText className="w-16 h-16 mb-4 text-gray-300" />
                  <p>Submit a query to see the translated medical findings here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
