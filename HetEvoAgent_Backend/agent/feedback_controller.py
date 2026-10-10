from agent.strategy import generate_strategy


def get_feedback():
    """
    Generate the latest feedback decision from the agent.
    """

    strategy = generate_strategy()

    return {
        "action": strategy["action"],
        "message": strategy["message"],
        "adjustment": strategy["adjustment"],
        "summary": strategy["summary"]
    }