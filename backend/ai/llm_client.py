import os
from groq import Groq


def get_llm():
    """
    Returns a configured Groq LLM instance.
    Environment variable required:
    - GROQ_API_KEY
    """

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set in environment variables")

    return Groq(api_key=api_key)
