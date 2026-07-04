from app.agents.tools import ClinicalTrialsLookupTool, OpenFDASafetyTool, ReportLabPDFGeneratorTool

def test():
    print("Testing Clinical Trials Tool...")
    ct_tool = ClinicalTrialsLookupTool()
    print(ct_tool._run("asthma"))

    print("\nTesting OpenFDA Tool...")
    fda_tool = OpenFDASafetyTool()
    print(fda_tool._run("aspirin"))

    print("\nTesting PDF Generator...")
    pdf_tool = ReportLabPDFGeneratorTool()
    print(pdf_tool._run("test_report.pdf", "This is a test of the emergency PDF generator.\n\nIt should create multiple paragraphs."))

if __name__ == "__main__":
    test()
