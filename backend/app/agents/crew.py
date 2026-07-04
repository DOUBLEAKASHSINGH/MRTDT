import os
from crewai import Agent, Task, Crew, Process, LLM
from app.agents.tools import RetrievalTool

llm = LLM(
    model="gpt-4o-mini",
    temperature=0.2,
    api_key=os.environ.get("OPENAI_API_KEY", "")
)

def create_medical_translation_crew():
    retrieval_tool = RetrievalTool()

    researcher = Agent(
        role="Medical Researcher",
        goal="Find the most relevant, accurate information from the paper database to answer the user's question",
        backstory="A meticulous medical librarian who never speculates beyond retrieved evidence",
        tools=[retrieval_tool],
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    writer = Agent(
        role="Patient Communication Specialist",
        goal="Translate technical medical findings into clear, compassionate, plain-English language",
        backstory="A health educator who explains complex diagnoses to worried patients every day",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    reviewer = Agent(
        role="Medical Accuracy Reviewer",
        goal="Verify the writer's summary strictly matches the retrieved source material, flag anything unsupported",
        backstory="A clinical fact-checker with zero tolerance for unsupported claims",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    research_task = Task(
        description="Retrieve and summarize evidence relevant to: {question}",
        agent=researcher,
        expected_output="A list of relevant findings with source paper references"
    )

    writing_task = Task(
        description="Turn the research findings into a plain-English summary a patient could understand",
        agent=writer,
        expected_output="A 3-4 paragraph plain-language summary",
        context=[research_task]
    )

    review_task = Task(
        description="Check the summary against the original research findings for accuracy",
        agent=reviewer,
        expected_output="A final, verified summary with any corrections applied, plus a short 'sources' list",
        context=[research_task, writing_task]
    )

    crew = Crew(
        agents=[researcher, writer, reviewer],
        tasks=[research_task, writing_task, review_task],
        process=Process.sequential,
        verbose=True
    )

    return crew
