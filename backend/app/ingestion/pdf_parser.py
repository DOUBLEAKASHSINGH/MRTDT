import fitz  # PyMuPDF
from langchain_text_splitters import RecursiveCharacterTextSplitter

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a multi-column PDF using PyMuPDF.
    """
    doc = fitz.open(pdf_path)
    full_text = []
    for page in doc:
        # PyMuPDF handles multi-column layouts decently with get_text("text")
        text = page.get_text("text")
        full_text.append(text)
    
    return "\n".join(full_text)

def chunk_text(text: str, chunk_size: int = 800, chunk_overlap: int = 150):
    """
    Chunk the extracted text using LangChain's RecursiveCharacterTextSplitter.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )
    return splitter.split_text(text)

def process_pdf(pdf_path: str, chunk_size: int = 800, chunk_overlap: int = 150):
    """
    Full pipeline to extract and chunk text from a PDF.
    """
    text = extract_text_from_pdf(pdf_path)
    chunks = chunk_text(text, chunk_size, chunk_overlap)
    return chunks
