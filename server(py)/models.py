from pydantic import BaseModel, EmailStr
from typing import List,Dict
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    message: str

class TokenRefreshRequest(BaseModel):
    token: str

class LogoutRequest(BaseModel):
    token: str 
  
class Message(BaseModel):
  role: str
  content: str

class chatRequest(BaseModel):
    model: str
    messages: List[Message]
    max_tokens: int
    temperature: float
    top_p: float