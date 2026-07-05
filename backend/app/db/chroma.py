import chromadb
from chromadb.utils import embedding_functions
import os

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "chroma_db")

_sentence_transformer_ef = None

def get_embedding_function():
    global _sentence_transformer_ef
    if _sentence_transformer_ef is None:
        _sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    return _sentence_transformer_ef

def get_chroma_client():
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR)
    return chromadb.PersistentClient(path=DB_DIR)

def get_collection(client, collection_name="medical_papers"):
    return client.get_or_create_collection(
        name=collection_name, 
        embedding_function=get_embedding_function()
    )

def store_chunks(paper_id: str, chunks: list[str]):
    """
    Store the extracted chunks in ChromaDB.
    """
    client = get_chroma_client()
    collection = get_collection(client)
    
    ids = [f"{paper_id}_{i}" for i in range(len(chunks))]
    metadatas = [{"source": paper_id} for _ in chunks]
    
    collection.upsert(
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )
    print(f"Stored {len(chunks)} chunks for {paper_id} in ChromaDB.")

def search_chunks(query: str, n_results: int = 5):
    """
    Search for most relevant chunks matching the query.
    """
    client = get_chroma_client()
    collection = get_collection(client)
    
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    
    if not results['documents'] or not results['documents'][0]:
        return []
        
    return results['documents'][0]
