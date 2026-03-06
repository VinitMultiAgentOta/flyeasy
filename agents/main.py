import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from crewai import Crew, Process
from pm_agent import pm_agent, pm_task
from architect_agent import architect_agent, architect_task
from ui_agent import ui_agent, ui_task
from backend_agent import backend_agent, backend_task
from qa_agent import qa_agent, qa_task

print("🚀 FlyEasy Agent Crew Starting...")
print(f"📋 Task: {os.environ.get('TASK_INPUT', 'Build FlyEasy flight portal')}")

flyeasy_crew = Crew(
    agents=[
        pm_agent,
        architect_agent,
        ui_agent,
        backend_agent,
        qa_agent
    ],
    tasks=[
        pm_task,
        architect_task,
        ui_task,
        backend_task,
        qa_task
    ],
    process=Process.sequential,
    verbose=True,
    memory=False        # ← CHANGED: disable memory (needs OpenAI)
)

result = flyeasy_crew.kickoff()
print("\n✅ Crew completed successfully")
print(result)
