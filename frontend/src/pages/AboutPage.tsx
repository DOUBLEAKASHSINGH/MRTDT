import { Users, Code, Award, Activity } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Democratizing Medical Research
        </h1>
        <p className="mt-4 text-lg text-gray-500 leading-relaxed">
          At MRT AI, our mission is to break down the walls of dense clinical jargon. We believe that every patient, regardless of their medical background, deserves to understand their diagnosis, treatment options, and active clinical trials in clear, empathetic, plain-English.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mb-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Patient First</h3>
          <p className="text-sm text-gray-500">
            Translating complex pathology reports and trial criteria so patients can make informed decisions.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-50 mb-4">
            <Code className="h-6 w-6 text-teal-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Robust Architecture</h3>
          <p className="text-sm text-gray-500">
            Powered by a 6-Agent AI pipeline that actively prevents hallucinations through strict programmatic hand-offs.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 mb-4">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Clinically Grounded</h3>
          <p className="text-sm text-gray-500">
            Real-time API integrations with openFDA and ClinicalTrials.gov ensure data is never frozen in time.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-200">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Meet the Developers</h2>
          <p className="mt-2 text-gray-500">The engineering team behind the multi-agent pipeline.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm mb-4">
              <span className="text-3xl font-bold text-blue-600">A</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Akash</h3>
            <p className="text-sm font-medium text-blue-600 mb-3">Lead Engineer</p>
            <p className="text-sm text-gray-500">
              Architect of the multi-agent execution state and clinical retrieval pipelines.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center border-4 border-white shadow-sm mb-4">
              <span className="text-3xl font-bold text-teal-600">S</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sneha</h3>
            <p className="text-sm font-medium text-teal-600 mb-3">Lead Frontend Engineer</p>
            <p className="text-sm text-gray-500">
              Designer of the interactive UI orchestration tracker and clinical dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
