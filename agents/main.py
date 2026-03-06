import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))

from crewai import Crew, Process, LLM
from pm_agent import pm_agent, pm_task
from architect_agent import architect_agent, architect_task
from ui_agent import ui_agent, ui_task
from backend_agent import backend_agent, backend_task
from qa_agent import qa_agent, qa_task

print("🚀 FlyEasy Agent Crew Starting...")
print(f"📋 Task: {os.environ.get('TASK_INPUT', 'Build FlyEasy flight portal')}")

# Retry wrapper for rate limit handling
MAX_RETRIES = 3
RETRY_DELAY = 30  # seconds between retries

for attempt in range(1, MAX_RETRIES + 1):
    try:
        print(f"\n⚡ Attempt {attempt} of {MAX_RETRIES}...")

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
            memory=False
        )

        result = flyeasy_crew.kickoff()
        print("\n✅ Crew completed successfully")
        print(result)
        break  # success — exit retry loop

    except Exception as e:
        error_msg = str(e)
        if "rate_limit" in error_msg.lower() or "429" in error_msg:
            if attempt < MAX_RETRIES:
                print(f"\n⏳ Rate limit hit. Waiting {RETRY_DELAY}s before retry {attempt + 1}...")
                time.sleep(RETRY_DELAY)
            else:
                print(f"\n❌ Rate limit exceeded after {MAX_RETRIES} attempts.")
                print("Solution: Upgrade Groq to Dev tier or wait 1 minute and re-run.")
                sys.exit(1)
        else:
            print(f"\n❌ Unexpected error: {error_msg}")
            sys.exit(1)
