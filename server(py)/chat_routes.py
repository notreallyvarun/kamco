from fastapi import APIRouter
from models import chatRequest
from chat import chat

chat_router = APIRouter()

@chat_router.post("/userprofile")
async def chat_endpoint(data: chatRequest):
    return chat(data)
