import re
from ai.llm_client import get_llm
from ai.prompt import get_task_breakdown_prompt


def mask_pii_light(text: str) -> str:
    """
    Lightweight PII masking to avoid sending names/identifiers to LLM.
    Keeps performance fast (Azure-friendly).
    """
    # Mask capitalized names (very simple heuristic)
    text = re.sub(r"\b[A-Z][a-z]{2,}\b", "[NAME]", text)
    # Mask numbers that look like phone/IDs
    text = re.sub(r"\b\d{6,}\b", "[NUMBER]", text)
    return text


def generate_task_breakdown(task_description: str, step_granularity: str):
    """
    Generates a task breakdown using a single LLM call.
    Returns parsed TaskBreakdown object.
    """

    if not task_description or not task_description.strip():
        raise ValueError("Task description cannot be empty")

    if step_granularity not in {"micro", "normal", "macro"}:
        raise ValueError("Invalid step granularity")

    # Light PII masking
    safe_task_text = mask_pii_light(task_description.strip())

    # Load LLM, prompt, parser
    llm = get_llm()
    prompt, parser = get_task_breakdown_prompt()

    # Prepare prompt input
    prompt_input = {
        "task_description": safe_task_text,
        "step_granularity": step_granularity,
    }

    # Invoke LLM once
    response = llm.invoke(prompt.format(**prompt_input))

    # Parse structured output
    parsed_output = parser.parse(response.content)

    return parsed_output
