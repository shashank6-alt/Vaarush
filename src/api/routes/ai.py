# src/api/routes/ai.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai.assistant import get_ai_response

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

class AIRequest(BaseModel):
    message: str

class AIResponse(BaseModel):
    response: str

@router.post("/ask", response_model=AIResponse)
async def ask_ai(request: AIRequest):
    """
    Ask the Vaarush AI assistant a question.
    Returns intelligent responses about inheritance contracts, deployment, claims, etc.
    """
    try:
        response = get_ai_response(request.message)
        return AIResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI assistant error: {str(e)}")

@router.get("/health")
async def ai_health():
    """Health check for AI assistant module."""
    return {"status": "ok", "service": "AI Assistant"}
