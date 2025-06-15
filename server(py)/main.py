from fastapi import FastAPI
from auth_routes import router
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from chat_routes import chat_router
load_dotenv()

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

app.include_router(router, prefix="/api/auth")
app.include_router(chat_router, prefix="/api/chat")