import os
from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm():
    """
    Returns a configured Gemini LLM instance.
    Environment variable required:
    - GEMINI_API_KEY
    """

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set in environment variables")

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.4,   # calm, predictable output
        max_retries=2
    )
