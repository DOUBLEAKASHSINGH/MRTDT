import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Brain, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Medical research, translated for <span className="text-blue-600">everyone.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Decode complex academic medical jargon into clear, compassionate, and fact-checked plain English using autonomous AI agents.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/signup"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
            >
              Get started for free
            </Link>
            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
              Log in to your account <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Powered by AI</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Understand medical papers in seconds
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our autonomous crew of AI agents extracts, translates, and rigorously fact-checks scientific findings so you don't have to.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Upload any PDF
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Drag and drop dense medical journals or research reports. We'll extract and chunk the text intelligently.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Brain className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Multi-Agent Translation
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  A Researcher fetches the facts, and a Communicator writes a compassionate summary a patient can understand.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Zero Hallucinations
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  A rigorous AI Reviewer cross-checks the translation against the original text to guarantee strict medical accuracy.
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
