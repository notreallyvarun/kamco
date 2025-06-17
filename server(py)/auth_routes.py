from fastapi import APIRouter, HTTPException, Request, status
from models import UserCreate, UserLogin, TokenResponse, TokenRefreshRequest, LogoutRequest  
from auth import hash_password, verify_password, create_access_token, create_refresh_token, decode_token  
from datetime import datetime
import os
from dotenv import load_dotenv
from database import db  
load_dotenv()

jwtSecret = os.getenv("JWT_SECRET")
accessTokenTime = int(os.getenv("ACCESS_TOKEN_TIME", 15))  
refreshSecret = os.getenv("JWT_REFRESH_SECRET")
algorithm = str(os.getenv("ALGORITHM", "HS256"))
 

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    await db.users.insert_one({"email": user.email, "password": hashed})
    return {"message": "User created successfully"}

@router.get("/profile")
async def get_Profile(request:Request):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization Header missing or invalid")
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = decode_token(token, jwtSecret)#type:ignore
        email = payload.get('email')
        if not email:
            raise HTTPException(status_code=403, detail="Invalid token payload: missing email")
        
        user = await db.users.find_one({'email':email})
        if not user:
            raise HTTPException(status_code=404, detail="User not Found")
        
        return {"email": user["email"]}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

accessTokenTime = int(os.getenv("ACCESS_TOKEN_TIME", 15)) # 
@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    
    print(f"--- Login attempt for: {user.email} ---")
    
    db_user = await db.users.find_one({"email": user.email})
    
    if not db_user:
        print(f"DEBUG: User '{user.email}' NOT found in database.")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    print(f"DEBUG: User '{user.email}' found. Hashed password from DB: {db_user['password']}")
    
    # This is the crucial line for verification
    is_password_valid = verify_password(user.password, db_user["password"]) 
    print(f"DEBUG: Password verification result: {is_password_valid}")

    if not is_password_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    print(f"DEBUG: Authentication successful for {user.email}.")

    access_token = create_access_token({"email": user.email})
    refresh_token = create_refresh_token({"email": user.email})

    await db.refresh_tokens.insert_one({"token": refresh_token, "email": user.email, "created_at": datetime.utcnow()})

    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
    }

@router.post("/token")
async def refresh_token(body: TokenRefreshRequest):
    token = body.token
    if not token:
        raise HTTPException(status_code=400, detail="Refresh token is required")

    token_doc = await db.refresh_tokens.find_one({"token": token})
    if not token_doc:
        raise HTTPException(status_code=403, detail="Invalid refresh token")

    try:
        payload = decode_token(token, refreshSecret)#type:ignore
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=403, detail="Invalid token payload")

        new_access_token = create_access_token({"email": email})
        
        return {"access_token": new_access_token}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Token verification failed: {e}")
    



@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(body: LogoutRequest):
    token = body.token
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh token is required")

    try:
        payload = decode_token(token, refreshSecret)#type:ignore
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token payload")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid refresh token: {e}")

    result = await db.refresh_tokens.delete_one({"token": token, "email": email})

    if result.deleted_count == 0:
        print(f"Logout: Refresh token {token} for {email} not found or already invalidated.")
        pass

    return
