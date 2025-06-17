from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from models import chatRequest, Message
from chat import call_llm
from ocr import extract_text_from_image  # Import the OCR function
import os
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

chat_router = APIRouter()

@chat_router.post("/userprofile")
async def chat_endpoint(data: chatRequest):
    messages_for_llm: List[Dict[str, str]] = [
        {"role": msg.role, "content": msg.content}
        for msg in data.messages
    ]

    payload = {
        "model": data.model,
        "messages": messages_for_llm,
        "max_tokens": getattr(data, "max_tokens", 1000),
        "temperature": getattr(data, "temperature", 0.7),
        "top_p": getattr(data, "top_p", 1.0),
    }

    return call_llm(payload)

@chat_router.post("/upload")
async def ocr_and_chat_endpoint(
    image: UploadFile = File(...),
    prompt: str = Form("")
):
    print(f"Received image: {image.filename}, Content-Type: {image.content_type}")
    print(f"Received prompt: {prompt}")
    
    # Validate image file type
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")

    try:
        print("Reading image bytes...")
        image_bytes = await image.read()
        print(f"Image size: {len(image_bytes)} bytes")
        
        # Use the OCR function from ocr.py module - it handles all OCR logic internally
        extracted_text = extract_text_from_image(image_bytes)
        print(f"OCR extracted text length: {len(extracted_text)}")
        print(f"OCR extracted text content: {repr(extracted_text)}")
        
        # Check if OCR actually found text
        if not extracted_text or len(extracted_text.strip()) < 5:
            print("WARNING: OCR found very little or no text!")
            return JSONResponse(
                status_code=400,
                content={"reply": "No readable text found in the image. Please ensure the image contains clear, readable text."},
            )

        # Build the final prompt based on what we have - IMPROVED VERSION
        if prompt and extracted_text:
            final_prompt = (
                f"I have extracted the following text from an image:\n\n"
                f"--- EXTRACTED TEXT ---\n"
                f"{extracted_text}\n"
                f"--- END EXTRACTED TEXT ---\n\n"
                f"Based on this extracted text, please: {prompt}\n\n"
                f"Work only with the text provided above. Do not ask for additional documents or clarification."
            )
        elif extracted_text:
            final_prompt = (
                f"I have extracted the following text from an image:\n\n"
                f"--- EXTRACTED TEXT ---\n"
                f"{extracted_text}\n"
                f"--- END EXTRACTED TEXT ---\n\n"
                f"Please analyze and summarize this text."
            )
        elif prompt:
            final_prompt = prompt
        else:
            return JSONResponse(
                status_code=400,
                content={"reply": "No text found in the image and no prompt provided. Please provide at least one."},
            )

        print(f"Final prompt being sent to LLM: {final_prompt}")

        # Prepare messages for the LLM - IMPROVED SYSTEM MESSAGE
        messages: List[Dict[str, str]] = [
            {
                "role": "system", 
                "content": (
                    "You are an AI assistant that processes extracted text from images. "
                    "When given extracted text and a task, perform the task directly on the provided text. "
                    "The text has already been extracted from an image using OCR. "
                    "Do not ask for clarification, additional documents, or suggest uploading files - "
                    "work only with the text provided to you. "
                    "Give direct, specific answers based on the extracted text content."
                )
            },
            {"role": "user", "content": final_prompt}
        ]

        # Get deployment name from environment
        deployment_name = os.getenv("DEPLOYMENT_NAME", "gpt-4o")  # fallback to gpt-4o
        
        payload = {
            "model": deployment_name,  # Use deployment name instead of hardcoded model
            "messages": messages,
            "max_tokens": 1000,
            "temperature": 0.3,  # Lower temperature for more consistent responses
            "top_p": 1.0,
        }

        print("Calling LLM...")
        response = call_llm(payload)
        print("LLM response received successfully")
        return response

    except Exception as e:
        print(f"Detailed error in /upload endpoint: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process the image and prompt: {str(e)}")