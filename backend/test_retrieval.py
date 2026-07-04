from app.ingestion.pmc_api import fetch_pmc_xml_and_extract_text
from app.ingestion.pdf_parser import chunk_text
from app.db.chroma import store_chunks, search_chunks

def test_rag():
    print("Fetching and ingesting PMC8043444...")
    # Fetch a sample paper
    text = fetch_pmc_xml_and_extract_text("PMC8043444")
    
    # Chunk it
    chunks = chunk_text(text)
    print(f"Generated {len(chunks)} chunks.")
    
    # Store it
    store_chunks("PMC8043444", chunks)
    
    # Test queries
    queries = [
        "What are the main symptoms of COVID-19 discussed?",
        "What are the findings regarding mRNA vaccines?",
        "How does the paper describe the methodology?"
    ]
    
    print("\n--- Testing Retrieval ---")
    for q in queries:
        print(f"\nQUERY: {q}")
        results = search_chunks(q, n_results=3)
        if not results:
            print("No results found.")
            continue
            
        for i, res in enumerate(results):
            print(f"\n--- Result {i+1} ---")
            # Print first 200 characters of the chunk safely
            snippet = res[:200].replace('\n', ' ')
            # Handle unicode printing on Windows console
            safe_snippet = snippet.encode('ascii', 'replace').decode('ascii')
            print(f"{safe_snippet}...")

if __name__ == "__main__":
    test_rag()
