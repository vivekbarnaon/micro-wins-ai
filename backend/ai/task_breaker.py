import re
import json
from typing import Optional
from ai.llm_client import get_llm
from ai.schemas import NeuroUserProfile, NeuroTaskBreakdown


def mask_pii_simple(text: str) -> str:
    """
    Lightweight PII masking to protect user privacy.
    Masks names, phone numbers, and other identifiable information.
    """
    # Mask capitalized names (simple heuristic)
    text = re.sub(r"\b[A-Z][a-z]{2,}\b", "[NAME]", text)
    # Mask numbers that look like phone/IDs
    text = re.sub(r"\b\d{6,}\b", "[NUMBER]", text)
    # Mask email addresses
    text = re.sub(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", "[EMAIL]", text)
    # Mask non-English characters (e.g., Hindi names)
    text = re.sub(r'[\u0900-\u097F]+', '[NAME]', text)
    return text


def build_prompt(user_profile: NeuroUserProfile, task_description: str) -> str:
    """Build neurodivergent-friendly prompt"""
    
    prompt = f"""You are a neurodivergent-friendly task breakdown assistant.

User Profile:
- Neurodivergence: {user_profile.neurodivergence}
- Break Interval: {user_profile.break_interval_minutes} minutes
- Fatigue Triggers: {', '.join(user_profile.fatigue_triggers or ['none'])}
- AI Tone: {', '.join(user_profile.ai_tone)}
- Response Verbosity: {user_profile.response_verbosity}/5
- Step Granularity: {user_profile.step_granularity}

Task: {task_description}

Break this task into clear, actionable steps. Consider the user's neurodivergence type:
- ADHD: Clear transitions, small steps, frequent breaks
- Dyslexia: Simple language, short sentences, visual structure
- Autism: Predictable structure, explicit instructions, sensory considerations

Return ONLY a valid JSON object (no markdown, no explanation) with this structure:
{{
    "task_name": "brief task name",
    "difficulty_level": 1-5,
    "breakdown": [
        {{
            "step_number": 1,
            "step_task": "one clear action",
            "estimated_time_minutes": 5
        }}
    ]
}}"""
    
    return prompt


def generate_neuro_task_breakdown(
    task_description: str,
    user_profile: Optional[NeuroUserProfile] = None
):
    """
    Generates a neurodivergent-friendly task breakdown using Groq LLM.
    
    Args:
        task_description: The task to break down
        user_profile: Optional user profile with neurodivergent preferences
    
    Returns:
        Parsed NeuroTaskBreakdown object
    """
    if not task_description or not task_description.strip():
        raise ValueError("Task description cannot be empty")
    
    # Use default profile if none provided
    if user_profile is None:
        user_profile = NeuroUserProfile(
            user_id="default",
            neurodivergence="ADHD",
            break_interval_minutes=25,
            fatigue_triggers=["long paragraphs"],
            ai_tone=["calm"],
            response_verbosity=3,
            step_granularity="normal"
        )
    
    # Simple PII masking
    safe_task_text = mask_pii_simple(task_description.strip())
    
    # Get Groq client
    groq_client = get_llm()
    
    # Build prompt
    prompt_text = build_prompt(user_profile, safe_task_text)
    
    # Call Groq API with error handling
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Updated from deprecated mixtral-8x7b-32768
            messages=[
                {"role": "system", "content": "You are a helpful assistant that returns only valid JSON."},
                {"role": "user", "content": prompt_text}
            ],
            temperature=0.3,
            max_tokens=2048
        )
    except Exception as e:
        raise ValueError(f"Groq API call failed: {str(e)}")
    
    # Extract JSON from response
    response_text = response.choices[0].message.content.strip()
    
    # Remove markdown code blocks if present
    if response_text.startswith("```"):
        response_text = re.sub(r"```(?:json)?\s*", "", response_text)
        response_text = response_text.rstrip("`")
    
    # Parse JSON
    try:
        json_data = json.loads(response_text)
        return NeuroTaskBreakdown(**json_data)
    except (json.JSONDecodeError, Exception) as e:
        raise ValueError(f"Failed to parse LLM response: {e}\nResponse: {response_text}")

