import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle, Activity, FileText, Download, LogOut, ArrowRight, Lock, Mail, Loader2, Database, ShieldAlert, BookOpen, Stethoscope } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

type AuthMode = "signin" | "signup";
type AnalyzeStatus = "idle" | "uploading" | "analyzing" | "success" | "error";

const PROGRESS_STEPS = [
  { label: "Core Researcher scanning local database...", icon: Database, color: "text-blue-400" },
  { label: "Clinical Trial Navigator fetching studies...", icon: Activity, color: "text-green-400" },
  { label: "Safety Auditor checking FDA contraindications...", icon: ShieldAlert, color: "text-red-400" },
  { label: "Compliance Officer cross-referencing PubMed...", icon: BookOpen, color: "text-purple-400" },
  { label: "Patient Summarizer translating findings...", icon: Stethoscope, color: "text-teal-400" },
  { label: "Advocacy Specialist generating PDF...", icon: FileText, color: "text-amber-400" }
];

export default function MedicalTranslatorApp() {
  // State
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<AnalyzeStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [progressIndex, setProgressIndex] = useState(0);
  const [result, setResult] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-progress tracker when analyzing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "analyzing") {
      timer = setInterval(() => {
        setProgressIndex(prev => {
          if (prev < PROGRESS_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 3500); // Step through progress artificially to show activity
    } else {
      setProgressIndex(0);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const endpoint = authMode === "signin" ? "/auth/login" : "/auth/signup";
      
      let body, headers;
      if (authMode === "signin") {
        // OAuth2 uses form data
        body = new URLSearchParams({ username: email, password });
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      } else {
        body = JSON.stringify({ email, password });
        headers = { 'Content-Type': 'application/json' };
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");

      if (authMode === "signup") {
        setAuthMode("signin");
        setAuthError("Account created! Please sign in.");
      } else {
        localStorage.setItem('jwt_token', data.access_token);
        setToken(data.access_token);
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setStatus("idle");
    setResult("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      setStatusMsg(`File "${file.name}" uploaded successfully and is being indexed.`);
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
      const res = await fetch(`${API_URL}/analyze?question=${encodeURIComponent(question)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
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

  // UI Components
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-sm mb-2 tracking-tight">
              MRT AI
            </h1>
            <p className="text-slate-400 text-sm">Medical Research Translator Pipeline</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">
              {authMode === "signin" ? "Sign In" : "Create Account"}
            </h2>
            
            {authError && (
              <div className={`p-3 mb-6 text-sm rounded-lg border ${authError.includes("created") ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="dr.smith@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex justify-center items-center disabled:opacity-50"
              >
                {authLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (authMode === "signin" ? "Sign In" : "Sign Up")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                className="text-slate-400 hover:text-indigo-400 text-sm transition-colors"
              >
                {authMode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans selection:bg-indigo-500/30 relative">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-wide">MRT AI</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Input & Upload */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Analyze Section */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Stethoscope className="text-blue-400 h-5 w-5"/> Analyze Condition
            </h3>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g., What are the current standard treatments and latest clinical trials for unmanaged severe asthma?"
                className="w-full h-32 bg-slate-950/50 border border-slate-700/50 text-white rounded-xl p-4 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-sm"
              />
              <button 
                disabled={status === "analyzing" || !question.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "analyzing" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Crew Assembling...</>
                ) : (
                  <>Deploy Intelligence Crew <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </section>

          {/* Upload Section */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <UploadCloud className="text-indigo-400 h-5 w-5"/> Upload Research
            </h3>
            <p className="text-sm text-slate-500 mb-4">Add raw PDF papers to the local ChromaDB.</p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/30 hover:bg-indigo-500/5 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileUpload}
              />
              {status === "uploading" ? (
                <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mb-3" />
              ) : (
                <UploadCloud className="h-8 w-8 text-slate-500 group-hover:text-indigo-400 transition-colors mb-3" />
              )}
              <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                {status === "uploading" ? "Uploading & Indexing..." : "Click or drag PDF to upload"}
              </span>
            </div>
            {statusMsg && status !== "analyzing" && status !== "error" && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4"/> {statusMsg}
              </div>
            )}
            {status === "error" && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
                <ShieldAlert className="h-4 w-4"/> {statusMsg}
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Execution & Results */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl h-full shadow-2xl backdrop-blur-md overflow-hidden flex flex-col min-h-[500px]">
            
            {/* Header */}
            <div className="border-b border-slate-800 p-4 bg-slate-900 flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400"/> Live Agent Tracking
              </h3>
              {status === "success" && (
                <button className="flex items-center gap-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-md transition-colors border border-emerald-500/20">
                  <Download className="h-3.5 w-3.5" /> Download PDF Report
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 overflow-y-auto">
              {status === "idle" && !result && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                  <Database className="h-12 w-12 mb-4" />
                  <p>Awaiting medical query deployment...</p>
                </div>
              )}

              {status === "analyzing" && (
                <div className="space-y-6 max-w-lg mx-auto py-8">
                  {PROGRESS_STEPS.map((step, idx) => {
                    const isActive = idx === progressIndex;
                    const isDone = idx < progressIndex;
                    const Icon = step.icon;
                    return (
                      <div key={idx} className={`flex items-start gap-4 transition-all duration-500 ${isDone ? 'opacity-50' : isActive ? 'opacity-100 scale-105' : 'opacity-20'}`}>
                        <div className={`mt-0.5 rounded-full p-2 ${isDone ? 'bg-slate-800' : isActive ? 'bg-slate-800 animate-pulse border border-slate-700' : 'bg-slate-900'}`}>
                          <Icon className={`h-5 w-5 ${isDone ? 'text-slate-500' : isActive ? step.color : 'text-slate-700'}`} />
                        </div>
                        <div>
                          <p className={`font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          {isActive && <div className="h-1 w-24 bg-indigo-500/30 rounded overflow-hidden mt-2">
                             <div className="h-full bg-indigo-500 w-1/2 animate-[progress_1s_ease-in-out_infinite]" />
                          </div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {status === "success" && result && (
                <div className="prose prose-invert prose-blue max-w-none text-slate-300">
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
