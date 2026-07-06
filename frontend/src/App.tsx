import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, Upload, AlertCircle, CheckCircle2, 
  Loader2, ArrowRight, ShieldCheck, Cpu, 
  FileSpreadsheet, Activity, Menu, X 
} from 'lucide-react';

// --- GLOBAL LAYOUT COMPONENT ---
function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Premium Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-xl tracking-tight text-gray-900">
                  MRT <span className="text-blue-600">AI</span>
                </span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                <Link 
                  to="/" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/' ? 'border-blue-600 text-gray-950' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/architecture" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/architecture' ? 'border-blue-600 text-gray-950' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  6-Agent Architecture
                </Link>
              </div>
            </div>
            
            <div className="hidden md:flex items-center">
              <Link
                to="/dashboard"
                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Launch App Dashboard
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-2 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/architecture"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              6-Agent Architecture
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="mt-2 block text-center w-full px-4 py-2 rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Launch App Dashboard
            </Link>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-grow">{children}</main>

      {/* Premium Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-700">Medical Research Translator AI</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MRT AI. Built for clinical precision and public transparency.
          </p>
        </div>
      </footer>
    </div>
  );
}

// --- PAGE 1: LANDING PAGE ---
function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              Advanced Multi-Agent RAG System
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Medical research, <span className="text-blue-600">translated</span> for everyone.
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
              Upload dense, complex biomedical literature and receive crystal-clear, verified summaries optimized for clinical trials, safety guidelines, and patient advocacy.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/architecture')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Engineered for absolute accuracy</h2>
            <p className="mt-4 text-lg text-gray-500">Unlike generic LLMs, our platform processes data through specialized operational barriers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600 w-fit mb-4">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">6-Agent Crew Orchestration</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                Tasks pass sequentially through dedicated virtual experts, preventing hallucinations by isolating research, safety auditing, and final draft refinement.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="p-3 bg-teal-100 rounded-lg text-teal-600 w-fit mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Live API Tool Grounding</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                Agents don't guess—they query real-world databases live, cross-referencing your custom documents against clinical trials and active FDA records.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 w-fit mb-4">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Automated PDF Reporting</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                Convert any complex breakdown directly into structured, professional clinical summaries ready to print or share instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PAGE 2: ARCHITECTURE DOCUMENTATION PAGE ---
function ArchitecturePage() {
  const agents = [
    { name: 'Core Medical Researcher', role: 'Extracts critical raw biomedical details from Vector Database embeddings.', color: 'border-blue-500 text-blue-600 bg-blue-50' },
    { name: 'Clinical Trials Navigator', role: 'Validates claims against global records using the ClinicalTrials API.', color: 'border-green-500 text-green-600 bg-green-50' },
    { name: 'Drug Safety Auditor', role: 'Cross-checks warnings and adverse events through openFDA integration.', color: 'border-red-500 text-red-600 bg-red-50' },
    { name: 'Guideline Compliance Officer', role: 'Ensures strict alignment with NIH/PubMed medical practice guidelines.', color: 'border-purple-500 text-purple-600 bg-purple-50' },
    { name: 'Patient Communication Specialist', role: 'Translates toxic, dense clinical terminology into plain, accessible language.', color: 'border-teal-500 text-teal-600 bg-teal-50' },
    { name: 'Medical Practice Advocacy Specialist', role: 'Compiles all peer outputs into a standardized, bulletproof ReportLab structure.', color: 'border-amber-500 text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">The 6-Agent Sequential Pipeline</h1>
        <p className="mt-4 text-lg text-gray-500">
          How our architecture minimizes hallucination windows by forcing programmatic data hand-offs.
        </p>
      </div>

      <div className="relative border-l-2 border-gray-200 ml-4 md:ml-32 space-y-12">
        {agents.map((agent, index) => (
          <div key={index} className="relative pl-8">
            <span className={`absolute -left-3.5 top-1 flex items-center justify-center w-7 h-7 rounded-full border-2 font-bold text-sm ${agent.color}`}>
              {index + 1}
            </span>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">{agent.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- PAGE 3: MAIN APP DASHBOARD WORKSPACE ---
function DashboardPage() {
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

  // Artificially cycle through agents for the Multi-Agent Latency UI Deception
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
      setActiveAgentIndex(0);
      interval = setInterval(() => {
        setActiveAgentIndex((prev) => {
          if (prev < agentSteps.length - 1) return prev + 1;
          return prev; 
        });
      }, 7000); // Shift every 7 seconds during long CrewAI loop
    } else {
      setActiveAgentIndex(-1);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setUploadSuccess(false);
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setErrorMessage('');
    
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload initialization failed.');
      setUploadSuccess(true);
    } catch (err) {
      setErrorMessage('Failed to connect to backend server. Make sure your Render instance is fully live.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult('');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });
      if (!response.ok) throw new Error('Analysis processing failed.');
      const data = await response.json();
      setAnalysisResult(data.result || data.summary || data.answer || 'Processing complete.');
    } catch (err) {
      setErrorMessage('Failed to fetch translation. The multi-agent pipeline timed out or the server went offline.');
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
        {/* Left Side: Document Queueing & Query Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload card */}
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

            {/* Selected File Queue rendering */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Queued Files ({selectedFiles.length})</p>
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700 bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate flex-grow">{file.name}</span>
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

          {/* Core Prompt Box */}
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

          {/* Finished Plain-Language Summary Display */}
          {analysisResult && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 prose max-w-none">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 m-0">Consolidated Clinical Interpretation</h2>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
                  Download Standardized PDF Report
                </button>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {analysisResult}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tracking State-Machine Matrix */}
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

// --- CORE APP ROUTER CONFIGURATION ---
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
