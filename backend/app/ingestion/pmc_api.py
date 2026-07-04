import requests
import os
from bs4 import BeautifulSoup

def search_pmc(query: str, max_results: int = 5):
    """
    Search PubMed Central for a given query and return a list of PMC IDs.
    """
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term={query} open access[filter]&retmode=json&retmax={max_results}"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    return data.get("esearchresult", {}).get("idlist", [])

def fetch_pmc_xml_and_extract_text(pmc_id: str, output_dir: str = "../data/raw") -> str:
    """
    Fetch full-text XML from PMC via E-utilities, extract the body text using BeautifulSoup,
    and save the clean text to a local file.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    pmc_num = pmc_id.replace("PMC", "")
    clean_pmc_id = f"PMC{pmc_num}"
    
    txt_path = os.path.join(output_dir, f"paper_{clean_pmc_id}.txt")
    if os.path.exists(txt_path):
        with open(txt_path, "r", encoding="utf-8") as f:
            return f.read()
            
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id={pmc_num}&retmode=xml"
    response = requests.get(url)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, "lxml-xml")
    
    # Try to grab the body of the article specifically, fallback to full text
    body = soup.find("body")
    if body:
        text = body.get_text(separator="\n", strip=True)
    else:
        text = soup.get_text(separator="\n", strip=True)
        
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
        
    return text

def download_pmc_pdf(pmc_id: str, output_dir: str = "../data/raw"):
    """
    Fallback method to download the PDF for a given PMC ID using European PMC API,
    in case the XML schema is too tricky or no full text is found.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    pmc_num = pmc_id.replace("PMC", "")
    clean_pmc_id = f"PMC{pmc_num}"
        
    pdf_path = os.path.join(output_dir, f"paper_{clean_pmc_id}.pdf")
    if os.path.exists(pdf_path):
        return pdf_path
        
    url = f"https://www.ebi.ac.uk/europepmc/webservices/rest/{clean_pmc_id}/fullTextREST?format=pdf"
    
    response = requests.get(url, stream=True)
    if response.status_code == 200 and 'application/pdf' in response.headers.get('Content-Type', ''):
        with open(pdf_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return pdf_path
    else:
        raise Exception(f"Could not download PDF for {clean_pmc_id}. Status: {response.status_code}")
