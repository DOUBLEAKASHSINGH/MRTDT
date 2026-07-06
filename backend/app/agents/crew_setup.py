import os
from crewai import Agent, Task, Crew, Process, LLM
from app.agents.tools import (
    LocalChromaQueryTool,
    ClinicalTrialsLookupTool,
    OpenFDASafetyTool,
    PubMedSearchTool,
    ReportLabPDFGeneratorTool
)

from crewai import LLM

llm = LLM(
    model="gemini/gemini-2.5-flash",
    temperature=0.2,
    api_key=os.environ.get("GEMINI_API_KEY", "")
)

def create_expanded_medical_crew():
    # 1. Initialize Tools
    chroma_tool = LocalChromaQueryTool()
    trials_tool = ClinicalTrialsLookupTool()
    fda_tool = OpenFDASafetyTool()
    guideline_tool = PubMedSearchTool()
    pdf_tool = ReportLabPDFGeneratorTool()

    # 2. Define Agents
    researcher = Agent(
        role="Core Medical Researcher",
        goal="Extract the most relevant, scientifically accurate information from the local paper database for a given condition.",
        backstory="A meticulous medical librarian who pulls deep context from academic papers and never speculates.",
        tools=[chroma_tool],
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    trial_navigator = Agent(
        role="Clinical Trial Navigator",
        goal="Find ongoing or recent clinical trials matching the identified medical condition to provide real-world research context.",
        backstory="A clinical research coordinator who constantly monitors ClinicalTrials.gov for the latest experimental therapies.",
        tools=[trials_tool],
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    safety_auditor = Agent(
        role="Bio-Pharma Safety Auditor",
        goal="Cross-reference mentioned drugs with the FDA database to extract real-world adverse events and safety warnings.",
        backstory="A strict pharmacovigilance expert who ensures no drug is discussed without its associated FDA safety profile.",
        tools=[fda_tool],
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    guideline_officer = Agent(
        role="Guideline Compliance Officer",
        goal="Search PubMed for the latest medical guidelines to ensure the synthesized information complies with current medical standards.",
        backstory="A senior medical director who verifies that all medical communication aligns with the latest published clinical guidelines.",
        tools=[guideline_tool],
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    summarizer = Agent(
        role="Patient Summarizer",
        goal="Translate the technical research, trial data, safety warnings, and guidelines into clear, compassionate, plain-English language.",
        backstory="A health educator who is an expert at explaining complex medical data to worried patients in an understandable and empathetic way.",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    advocacy_specialist = Agent(
        role="Patient Advocacy Specialist",
        goal="Compile the finalized, plain-English summary into a beautifully formatted, physical PDF report for the patient to download and share.",
        backstory="A patient advocate who specializes in creating accessible medical documentation for patients to take to their primary care providers.",
        tools=[pdf_tool],
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    # 3. Define Sequential Tasks
    research_task = Task(
        description="Search the local medical database for evidence and context relevant to: {question}. Summarize the core findings.",
        agent=researcher,
        expected_output="A list of core medical findings based purely on local research papers."
    )

    trial_task = Task(
        description="Extract the main medical condition from the user's question: '{question}' and search for related clinical trials. Append these trials to the core research.",
        agent=trial_navigator,
        expected_output="The core research findings appended with a list of relevant ongoing clinical trials.",
        context=[research_task]
    )

    safety_task = Task(
        description="Identify any specific drugs mentioned in the previous findings or related to the condition '{question}'. Check them against the FDA database and append the safety data.",
        agent=safety_auditor,
        expected_output="The previous findings appended with strict FDA adverse event warnings for relevant drugs.",
        context=[trial_task]
    )

    guideline_task = Task(
        description="Search for the latest medical guidelines on PubMed related to '{question}'. Cross-reference and append these guidelines to ensure the information is compliant.",
        agent=guideline_officer,
        expected_output="The combined research, trial, and safety data, verified and appended with recent PubMed clinical guidelines.",
        context=[safety_task]
    )

    summary_task = Task(
        description="Synthesize the massive block of research, trials, safety data, and guidelines into a highly readable, compassionate 4-paragraph plain-English summary.",
        agent=summarizer,
        expected_output="A clear, plain-language patient summary combining all technical aspects.",
        context=[guideline_task]
    )

    pdf_task = Task(
        description="Take the finalized plain-English summary and use the PDF Generator tool to create a file named 'patient_report.pdf'. Return the final file path.",
        agent=advocacy_specialist,
        expected_output="A confirmation string including the generated PDF file path.",
        context=[summary_task]
    )

    # 4. Assemble the Crew
    crew = Crew(
        agents=[
            researcher, 
            trial_navigator, 
            safety_auditor, 
            guideline_officer, 
            summarizer, 
            advocacy_specialist
        ],
        tasks=[
            research_task, 
            trial_task, 
            safety_task, 
            guideline_task, 
            summary_task, 
            pdf_task
        ],
        process=Process.sequential,
        verbose=True
    )

    return crew
