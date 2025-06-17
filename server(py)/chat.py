import os
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

# Load environment variables
api_key = os.getenv("API_KEY")
api_base = os.getenv("AZURE_ENDPOINT")
api_version = os.getenv("API_VERSION")
deployment_name = os.getenv("DEPLOYMENT_NAME")

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_key=api_key,
    api_version=api_version,
    azure_endpoint=api_base#type:ignore
)

def call_llm(payload: dict):
    try:
        response = client.chat.completions.create(
            model=payload["model"],           
            messages=payload["messages"],     
            max_tokens=payload["max_tokens"],
            temperature=payload["temperature"],
            top_p=payload["top_p"],
        )
        return JSONResponse(content={"reply": response.choices[0].message.content})
    except Exception as e:
        print(f"LLM call error: {e}")
        raise e
