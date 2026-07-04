import os
os.environ["GEMINI_API_KEY"] = "AIzaSyAlbS-unwSFaQhMTCBA8GCv-Wcjc0YObWQ"

from app.agents.crew import create_medical_translation_crew

def test():
    try:
        crew = create_medical_translation_crew()
        print("Crew created. Kicking off...")
        result = crew.kickoff(inputs={"question": "What is COVID-19?"})
        print("Result:", result.raw)
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    test()
