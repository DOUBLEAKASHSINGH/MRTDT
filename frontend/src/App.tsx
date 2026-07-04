import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle, Activity, FileText, Download, ArrowRight, Loader2, Database, ShieldAlert, BookOpen, Stethoscope, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

type AnalyzeStatus = "idle" | "uploading" | "analyzing" | "success" | "error";

const PROGRESS_STEPS = [
  { label: "Core Researcher scanning local database...", icon: Database, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Clinical Trial Navigator fetching studies...", icon: Activity, color: "text-green-500", bg: "bg-green-50" },
  { label: "Safety Auditor checking FDA contraindications...", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-50" },
  { label: "Compliance Officer cross-referencing PubMed...", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Patient Summarizer translating findings...", icon: Stethoscope, color: "text-teal-500", bg: "bg-teal-50" },
  { label: "Advocacy Specialist generating PDF...", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" }
];

export default function App() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<AnalyzeStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [progressIndex, setProgressIndex] = useState(0);
  const [result, setResult] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (status === "analyzing") {
      timer = setInterval(() => {
        setProgressIndex(prev => {
          if (prev < PROGRESS_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 3500);
    } else {
      setProgressIndex(0);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setStatus("uploading");
    const formData = new FormData();
    
    // Append all selected files under the 'files' key
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setStatusMsg(`Success: ${data.files_received} file(s) indexed!`);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setStatusMsg(err.message);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setStatus("analyzing");
    setResult("");
    setStatusMsg("");

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Analysis failed");

      setResult(data.answer);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setStatusMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans selection:bg-blue-200">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-xl tracking-tight">MRT AI</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Upload */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Analyze Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500" />
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="text-teal-600 h-6 w-6"/> Ask a Query
            </h3>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g., What are the current standard treatments and latest clinical trials for unmanaged severe asthma?"
                className="w-full h-36 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-4 resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-base shadow-inner"
              />
              <button 
                disabled={status === "analyzing" || !question.trim()}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-teal-600/30 disabled:shadow-none flex items-center justify-center gap-2 text-lg"
              >
                {status === "analyzing" ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Deploying Intelligence Crew...</>
                ) : (
                  <>Translate & Summarize <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
            </form>
          </div>

          {/* Upload Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <UploadCloud className="text-blue-600 h-6 w-6"/> Upload Knowledge
            </h3>
            <p className="text-sm text-gray-500 mb-5">Add raw PDF papers to the local ChromaDB for the agents to analyze. You can select multiple files.</p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf"
                multiple
                onChange={handleFileUpload}
              />
              {status === "uploading" ? (
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
              ) : (
                <UploadCloud className="h-10 w-10 text-gray-400 group-hover:text-blue-600 transition-colors mb-4" />
              )}
              <span className="text-base font-semibold text-gray-600 group-hover:text-blue-700 transition-colors text-center">
                {status === "uploading" ? "Uploading & Indexing..." : "Click to select multiple PDFs"}
              </span>
            </div>
            {statusMsg && status !== "analyzing" && status !== "error" && (
              <div className="mt-5 p-3 bg-green-50 border border-green-200 text-green-700 font-medium text-sm rounded-xl flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500"/> {statusMsg}
              </div>
            )}
            {status === "error" && (
              <div className="mt-5 p-3 bg-red-50 border border-red-200 text-red-700 font-medium text-sm rounded-xl flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500"/> {statusMsg}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Execution & Results */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-200 rounded-2xl h-full shadow-sm flex flex-col min-h-[600px] overflow-hidden">
            
            {/* Header */}
            <div className="border-b border-gray-100 p-5 bg-white flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Translation Results
              </h2>
              {status === "success" && (
                <button className="flex items-center gap-2 text-sm font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-2 rounded-lg transition-colors border border-amber-200 shadow-sm">
                  <Download className="h-4 w-4" /> Download PDF Report
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="p-8 flex-1 overflow-y-auto bg-gray-50/50">
              {status === "idle" && !result && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <FileText className="h-16 w-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Submit a query to see the translated medical findings.</p>
                </div>
              )}

              {status === "analyzing" && (
                <div className="space-y-8 max-w-lg mx-auto py-12">
                  {PROGRESS_STEPS.map((step, idx) => {
                    const isActive = idx === progressIndex;
                    const isDone = idx < progressIndex;
                    const Icon = step.icon;
                    return (
                      <div key={idx} className={`flex items-start gap-5 transition-all duration-500 ${isDone ? 'opacity-40' : isActive ? 'opacity-100 scale-105' : 'opacity-20'}`}>
                        <div className={`mt-0.5 rounded-full p-3 ${isDone ? 'bg-gray-100' : isActive ? `${step.bg} animate-pulse border border-${step.color.split('-')[1]}-200 shadow-sm` : 'bg-gray-50'}`}>
                          <Icon className={`h-6 w-6 ${isDone ? 'text-gray-400' : isActive ? step.color : 'text-gray-300'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-lg ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.label}
                          </p>
                          {isActive && <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mt-3">
                             <div className={`h-full ${step.color.replace('text', 'bg')} w-1/2 animate-[progress_1.5s_ease-in-out_infinite]`} />
                          </div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {status === "success" && result && (
                <div className="animate-fade-in-up bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-lg prose-blue max-w-none text-gray-800">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
