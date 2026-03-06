import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))

from crewai import Crew, Process

# Read which agent to run from environment variable
AGENT_TO_RUN = os.environ.get("AGENT_TO_RUN", "pm")

print(f"🚀 FlyEasy Agent: Running {AGENT_TO_RUN.upper()} agent...")

def run_with_retry(crew, max_retries=5, wait_seconds=60):
    for attempt in range(1, max_retries + 1):
        try:
            print(f"⚡ Attempt {attempt} of {max_retries}...")
            result = crew.kickoff()
            print("\n✅ Agent completed successfully")
            print(result)
            
            # Save output to file
            output_file = f"output/{AGENT_TO_RUN}_output.md"
            os.makedirs("output", exist_ok=True)
            with open(output_file, "w") as f:
                f.write(str(result))
            print(f"💾 Output saved to {output_file}")
            return result
            
        except Exception as e:
            error_msg = str(e)
            if "rate_limit" in error_msg.lower() or "429" in error_msg:
                if attempt < max_retries:
                    print(f"⏳ Rate limit hit. Waiting {wait_seconds}s before retry {attempt + 1}...")
                    time.sleep(wait_seconds)
                else:
                    print(f"❌ Rate limit exceeded after {max_retries} attempts.")
                    sys.exit(1)
            else:
                print(f"❌ Error: {error_msg}")
                sys.exit(1)

# Run only the selected agent
if AGENT_TO_RUN == "pm":
    from pm_agent import pm_agent, pm_task
    crew = Crew(
        agents=[pm_agent],
        tasks=[pm_task],
        process=Process.sequential,
        verbose=True,
        memory=False
    )
    run_with_retry(crew)

elif AGENT_TO_RUN == "architect":
    from pm_agent import pm_task
    from architect_agent import architect_agent, architect_task
    crew = Crew(
        agents=[architect_agent],
        tasks=[architect_task],
        process=Process.sequential,
        verbose=True,
        memory=False
    )
    run_with_retry(crew)

elif AGENT_TO_RUN == "ui":
    from architect_agent import architect_task
    from ui_agent import ui_agent, ui_task
    crew = Crew(
        agents=[ui_agent],
        tasks=[ui_task],
        process=Process.sequential,
        verbose=True,
        memory=False
    )
    run_with_retry(crew)

elif AGENT_TO_RUN == "backend":
    from architect_agent import architect_task
    from backend_agent import backend_agent, backend_task
    crew = Crew(
        agents=[backend_agent],
        tasks=[backend_task],
        process=Process.sequential,
        verbose=True,
        memory=False
    )
    run_with_retry(crew)

elif AGENT_TO_RUN == "qa":
    from pm_agent import pm_task
    from architect_agent import architect_task
    from ui_agent import ui_task
    from backend_agent import backend_task
    from qa_agent import qa_agent, qa_task
    crew = Crew(
        agents=[qa_agent],
        tasks=[qa_task],
        process=Process.sequential,
        verbose=True,
        memory=False
    )
    run_with_retry(crew)

else:
    print(f"❌ Unknown agent: {AGENT_TO_RUN}")
    print("Valid options: pm, architect, ui, backend, qa")
    sys.exit(1)
