# Simple AI assistant stub
def get_ai_response(user_message: str) -> str:
    intent_map = {
        "create plan": "Sure! To create a plan, please provide heir address, asset ID, and release timestamp.",
        "add heir": "You can add an heir by invoking the create_plan API with the heir's address.",
        "status": "To check status, call GET /plans/{app_id}."
    }
    for key, resp in intent_map.items():
        if key in user_message.lower():
            return resp
    return "Sorry, I didn't understand. You can ask how to create a plan or check status."
