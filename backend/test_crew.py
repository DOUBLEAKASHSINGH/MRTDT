import os
# Mock keys so it doesn't fail immediately on load if not set
os.environ.setdefault("GEMINI_API_KEY", "dummy_key")

from app.agents.crew_setup import create_expanded_medical_crew

def test_setup():
    print("Initializing the 6-Agent Crew...")
    crew = create_expanded_medical_crew()
    print("Agents in Crew:")
    for a in crew.agents:
        print(f"- {a.role}")
    
    print("\nTasks in Crew:")
    for t in crew.tasks:
        print(f"- {t.description[:80]}...")
        
    print("\nInitialization Successful!")

if __name__ == "__main__":
    test_setup()
