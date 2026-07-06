import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Cpu, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => navigate('/architecture')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm"
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
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600 w-fit mb-4">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">6-Agent Crew Orchestration</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                Tasks pass sequentially through dedicated virtual experts, preventing hallucinations by isolating research, safety auditing, and final draft refinement.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md">
              <div className="p-3 bg-teal-100 rounded-lg text-teal-600 w-fit mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Live API Tool Grounding</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                Agents don't guess—they query real-world databases live, cross-referencing your custom documents against clinical trials and active FDA records.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md">
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
