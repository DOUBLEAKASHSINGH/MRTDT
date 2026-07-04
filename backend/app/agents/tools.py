import requests
import os
from typing import Type
from pydantic import BaseModel, Field
from crewai.tools import BaseTool
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

class LocalChromaQueryToolInput(BaseModel):
    query: str = Field(..., description="The medical query to search for in local documents.")

class LocalChromaQueryTool(BaseTool):
    name: str = "Local Medical DB Search"
    description: str = "Searches the local ChromaDB for ingested medical papers and excerpts."
    args_schema: Type[BaseModel] = LocalChromaQueryToolInput

    def _run(self, query: str) -> str:
        from app.db.chroma import search_chunks
        results = search_chunks(query, n_results=5)
        if not results:
            return "No relevant context found in local papers."
        return "\n\n".join(results)


class ClinicalTrialsLookupInput(BaseModel):
    condition: str = Field(..., description="The medical condition or disease to look up clinical trials for.")

class ClinicalTrialsLookupTool(BaseTool):
    name: str = "Clinical Trials Lookup"
    description: str = "Searches ClinicalTrials.gov API for recent clinical trials matching a condition."
    args_schema: Type[BaseModel] = ClinicalTrialsLookupInput

    def _run(self, condition: str) -> str:
        url = "https://clinicaltrials.gov/api/v2/studies"
        params = {"query.cond": condition, "pageSize": 3}
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            studies = data.get("studies", [])
            if not studies:
                return f"No clinical trials found for condition: {condition}"
            
            results = []
            for study in studies:
                protocol = study.get("protocolSection", {})
                ident = protocol.get("identificationModule", {})
                status = protocol.get("statusModule", {})
                
                title = ident.get("briefTitle", "No Title")
                nct_id = ident.get("nctId", "No ID")
                phases = status.get("phases", ["Unknown Phase"])
                phase = phases[0] if phases else "Unknown Phase"
                
                results.append(f"- Trial: {title} (ID: {nct_id}, Phase: {phase})")
                
            return "\n".join(results)
        except Exception as e:
            return f"Error querying ClinicalTrials API: {e}"


class OpenFDASafetyInput(BaseModel):
    drug_name: str = Field(..., description="The name of the drug to look up adverse events for.")

class OpenFDASafetyTool(BaseTool):
    name: str = "OpenFDA Drug Safety Lookup"
    description: str = "Searches the FDA adverse event reporting system for a specific drug."
    args_schema: Type[BaseModel] = OpenFDASafetyInput

    def _run(self, drug_name: str) -> str:
        url = "https://api.fda.gov/drug/event.json"
        query = f'patient.drug.medicinalproduct:"{drug_name}"'
        params = {"search": query, "limit": 3}
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 404:
                return f"No adverse events found for drug: {drug_name}"
            response.raise_for_status()
            data = response.json()
            results = data.get("results", [])
            
            output = []
            for event in results:
                reactions = event.get("patient", {}).get("reaction", [])
                reaction_terms = [r.get("reactionmeddrapt", "Unknown") for r in reactions]
                output.append(f"- Reported adverse events: {', '.join(reaction_terms[:5])}")
                
            return "\n".join(output)
        except Exception as e:
            return f"Error querying OpenFDA API: {e}"


class ReportLabPDFGeneratorInput(BaseModel):
    filename: str = Field(..., description="The name of the PDF file to create, e.g. 'report.pdf'.")
    content: str = Field(..., description="The text content to include in the PDF report. Use newlines to separate paragraphs.")

class ReportLabPDFGeneratorTool(BaseTool):
    name: str = "PDF Report Generator"
    description: str = "Generates a structured PDF report from text input and saves it to the local disk."
    args_schema: Type[BaseModel] = ReportLabPDFGeneratorInput

    def _run(self, filename: str, content: str) -> str:
        try:
            # Ensure output directory exists (relative to the cwd where server is running)
            output_dir = "reports"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
                
            filepath = os.path.join(output_dir, filename)
            
            doc = SimpleDocTemplate(filepath, pagesize=letter)
            styles = getSampleStyleSheet()
            normal_style = styles["Normal"]
            title_style = styles["Title"]
            
            story = []
            story.append(Paragraph("Medical Analysis Report", title_style))
            story.append(Spacer(1, 12))
            
            for p in content.split('\n'):
                if p.strip():
                    story.append(Paragraph(p.strip(), normal_style))
                    story.append(Spacer(1, 12))
                    
            doc.build(story)
            return f"Successfully generated PDF report at {filepath}"
        except Exception as e:
            return f"Error generating PDF: {e}"
