export default function ArchitecturePage() {
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

      {/* New Section: Project Helpfulness & Impact */}
      <div className="mt-20 bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Project Helpfulness & Impact</h2>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-blue-600 mb-2">Curing LLM Hallucinations</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Standard AI models analyze medical documents in a vacuum, often hallucinating clinical facts when encountering unfamiliar regimens. By establishing strict programmatic API grounding (hitting openFDA for drug warnings and ClinicalTrials.gov for active study parameters), our pipeline is structurally banned from guessing. 
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-teal-600 mb-2">Saving Doctors Time</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Medical professionals face severe structural constraints during patient consultations. They lack the time to run extensive background searches across global registries. Our 6-agent sequential orchestration compiles extensive research into a single, standardized manifest in under a minute, doing the heavy lifting automatically.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-amber-600 mb-2">Empowering Patients</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Patients handed dense pathology reports often face immense cognitive friction and panic. The Patient Communication Specialist agent specifically targets this barrier by translating toxic, dense clinical terminology into empathetic, plain-English patient summaries that democratize understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
