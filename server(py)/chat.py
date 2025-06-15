import os
from dotenv import load_dotenv
from openai import AzureOpenAI
from fastapi import Request,HTTPException
load_dotenv()

api_key = os.getenv("api_key")
api_version = os.getenv("api_version")
deployment = os.getenv("deployment")
endpoint = os.getenv("azure_endpoint")

client = AzureOpenAI(
  api_key=api_key,
  api_version=api_version,
  azure_endpoint=endpoint 
)

def chat(prompt):
  try:
    messages_payload = prompt.messages
    response = client.chat.completions.create(
        model=prompt.model,
        messages = messages_payload,
        max_tokens=prompt.max_tokens,
        temperature=prompt.temperature,
        top_p=prompt.top_p      
    )
    reply_text = response.choices[0].message.content
    return {"reply": reply_text}
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
