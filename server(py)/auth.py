from passlib.context import CryptContext
from fastapi import HTTPException
import jwt
import datetime 
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv() 
accesstokentime = int(os.getenv('ACCESS_TOKEN_TIME'))#type:ignore
refreshtokentime = int(os.getenv('REFRESH_TOKEN_TIME'))#type:ignore 
algorithm = os.getenv('ALGORITHM', "HS256") 

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    """Verifies a plain password against a hashed password."""
    try:
        result = pwd_context.verify(plain_password, hashed_password)
        print(f"DEBUG: verify_password - Plain: '{plain_password}', Hashed: '{hashed_password}', Result: {result}")
        return result
    except Exception as e:
        print(f"ERROR: verify_password failed: {e}") 
        return False 

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + timedelta(seconds=accesstokentime)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("JWT_SECRET"), algorithm)
    return encoded_jwt

def create_refresh_token(data: dict):
    
    to_encode = data.copy()

    expire = datetime.datetime.now(datetime.timezone.utc) + timedelta(days=refreshtokentime)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("JWT_REFRESH_SECRET"), algorithm=algorithm)
    return encoded_jwt

def decode_token(token: str, secret_key: str):
    
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token Expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
