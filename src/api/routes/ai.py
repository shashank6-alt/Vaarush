from fastapi import APIRouter
from src.ai.assistant import get_ai_response

router = APIRouter()

@router.post("/ai")
async def ai_endpoint(payload: dict):
    message = payload.get("message", "")
    reply = get_ai_response(message)
    return {"detail": reply}
