from pydantic import BaseModel, EmailStr

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