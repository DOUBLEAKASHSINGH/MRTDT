import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './index.css'

function App() {
  const [query, setQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [translation, setTranslation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    
    setIsUploading(true)
    setStatusMsg(`Uploading ${selectedFile.name}...`)
    
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setStatusMsg(`Success: ${data.filename} ${data.status}`)
    } catch (err) {
      setStatusMsg('Failed to upload paper')
    } finally {
      setIsUploading(false)
      setTimeout(() => setStatusMsg(''), 5000)
    }
  }

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    
    setIsLoading(true)
    setTranslation('')
    
    try {
      const response = await fetch(`http://localhost:8000/analyze?question=${encodeURIComponent(query)}`, {
        method: 'POST'
      })
      const data = await response.json()
      if (data.answer) {
        setTranslation(data.answer)
      } else {
        setTranslation('Error retrieving translation.')
      }
    } catch (err) {
      setTranslation('An error occurred while fetching the translation.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans p-6">
      
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full py-8 border-b border-neutral-800">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Medical Research Translator
        </h1>
        <p className="mt-2 text-neutral-400 text-lg">
          Decode complex medical jargon into plain English using autonomous AI agents.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full py-12 flex flex-col md:flex-row gap-12">
        
        {/* Left Column: Controls */}
        <div className="w-full md:w-1/3 flex flex-col gap-8">
          
          {/* Upload Box */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
            <h2 className="text-xl font-semibold mb-4 text-white">Upload Paper</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-3">
              <label className="text-sm text-neutral-400">Select a medical PDF to analyze</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              />
              <button 
                type="submit"
                disabled={isUploading || !selectedFile}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
              >
                {isUploading ? 'Uploading & Processing...' : 'Upload & Index'}
              </button>
            </form>
            {statusMsg && (
              <p className="mt-4 text-sm text-emerald-400 font-medium">{statusMsg}</p>
            )}
          </div>

          {/* Query Box */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <h2 className="text-xl font-semibold mb-4 text-white">Ask a Medical Query</h2>
            <form onSubmit={handleTranslate} className="flex flex-col gap-3">
              <label className="text-sm text-neutral-400">Topic or specific question</label>
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What does the paper say about mRNA vaccine efficacy?"
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
              />
              <button 
                type="submit"
                disabled={isLoading || !query}
                className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Translating...
                  </>
                ) : 'Translate & Summarize'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Output */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex-grow p-8 shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-emerald-400" />
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-neutral-800 pb-4">Translation Results</h2>
            
            <div className="flex-grow prose prose-invert max-w-none text-neutral-300">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-4 mt-20">
                  <div className="animate-pulse flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full border-4 border-t-emerald-500 border-r-blue-500 border-b-emerald-500 border-l-blue-500 animate-spin"></div>
                    <p className="mt-4 font-medium tracking-widest uppercase text-sm">Agents at work...</p>
                    <p className="text-xs text-neutral-600">Retrieving • Writing • Reviewing</p>
                  </div>
                </div>
              ) : translation ? (
                <div className="animate-fade-in-up">
                  <ReactMarkdown>{translation}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600 mt-20">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p>Submit a query to see the translated medical findings here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
      
    </div>
  )
}

export default App
