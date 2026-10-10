from pathlib import Path
import sys

# Ensure backend root directory is in sys.path and script directory is removed
PROJECT_DIR = Path(__file__).resolve().parent.parent
SCRIPT_DIR = Path(__file__).resolve().parent

if str(SCRIPT_DIR) in sys.path:
    sys.path.remove(str(SCRIPT_DIR))

if str(PROJECT_DIR) not in sys.path:
    sys.path.insert(0, str(PROJECT_DIR))

from agent.agent import run_complete_agent


if __name__ == "__main__":

    print()
    print("=" * 60)
    print("STARTING HETEVOAGENT SELF-EVALUATION")
    print("=" * 60)

    result = run_complete_agent()

    print()
    print("=" * 60)
    print("SELF-EVALUATION COMPLETED")
    print("=" * 60)

    print(f"Action: {result['action']}")
    print(f"Message: {result['message']}")
