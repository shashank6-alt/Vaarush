# src/ai/assistant.py
from dotenv import load_dotenv
load_dotenv()
assert os.environ.get("OPENAI_API_KEY"), "API key is missing!"

import openai
openai.api_key = os.environ["OPENAI_API_KEY"]

import os


# Load your OpenAI API key (recommended set in .env, not hardcoded!)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "<YOUR_API_KEY_HERE>")
openai.api_key = OPENAI_API_KEY

def get_ai_response(user_message: str) -> str:
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": (
                    "You are Vaarush's AI support assistant. "
                    "Help users with inheritance contracts, deploying smart contracts, registering heirs, and claiming assets on Algorand. "
                    "Always respond clearly and helpfully in one paragraph."
                )},
                {"role": "user", "content": user_message}
            ],
            max_tokens=128,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return "Sorry, there was an error processing your request."

