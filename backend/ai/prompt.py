from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from ai.schemas import NeuroTaskBreakdown


def get_neuro_task_breakdown_prompt():
    """
    Returns a PromptTemplate + JsonOutputParser for neurodivergent-friendly task breakdown.
    """

    parser = JsonOutputParser(pydantic_object=NeuroTaskBreakdown)

    prompt = PromptTemplate(
        template="""You are a neurodivergent-friendly productivity assistant specializing in breaking down tasks for individuals with {neurodivergence}.

📋 USER PROFILE:
- User ID: {user_id}
- Neurodivergence: {neurodivergence}
- Break Interval: Every {break_interval_minutes} minutes
- Fatigue Triggers: {fatigue_triggers}
- AI Tone: {ai_tone}
- Response Detail Level: {response_verbosity}/5
- Step Granularity: {step_granularity}

🎯 TASK TO BREAK DOWN:
{task_description}

INSTRUCTIONS:
Based on the user's cognitive profile, create a neurodivergent-friendly task breakdown with micro wins.

IMPORTANT CONSIDERATIONS:

1. **Step Granularity**:
   - micro: 8-10 steps
   - normal: 6-8 steps
   - macro: 4-6 steps
   
   - Use max 20 words in each step
   
   Always adjust:
   - Number of breakdown steps
   
   Current setting: {step_granularity}

2. **Neurodivergence-Specific Adaptations**:
   - ADHD: Extra clear transitions
   - Dyslexia: Simple language, use bullet points
   - Autism: Predictable structure, clear expectations

3. **Energy**:
   - Avoid fatigue triggers: {fatigue_triggers}

4. **AI Tone ({ai_tone})**:
   - "calm": Gentle, reassuring language
   - "Friendly": Upbeat, exciting language
   - "strict": Direct, no-nonsense

5. **Response Verbosity ({response_verbosity}/5)**:
   - 1-2: Minimal, bullet points only
   - 3: Balanced, brief explanations
   - 4-5: Detailed, comprehensive guidance

{format_instructions}

Generate the task breakdown now:""",
        input_variables=[
            "user_id",
            "neurodivergence",
            "break_interval_minutes",
            "fatigue_triggers",
            "ai_tone",
            "response_verbosity",
            "step_granularity",
            "task_description"
        ],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )

    return prompt, parser
