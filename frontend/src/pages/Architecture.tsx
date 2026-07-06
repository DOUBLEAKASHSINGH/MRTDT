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
    </div>
  );
}
