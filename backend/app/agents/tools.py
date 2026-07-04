from crewai.tools import BaseTool
from pydantic import Field, BaseModel
from typing import Type
from app.db.chroma import search_chunks

class RetrievalInput(BaseModel):
    query: str = Field(..., description="The query to search the medical database for context.")

class RetrievalTool(BaseTool):
    name: str = "Medical Paper Retriever"
    description: str = "Searches the medical paper knowledge base for relevant passages"
    args_schema: Type[BaseModel] = RetrievalInput

    def _run(self, query: str) -> str:
        results = search_chunks(query, n_results=5)
        if not results:
            return "No relevant context found in the ingested medical papers."
        return "\n\n".join(results)
