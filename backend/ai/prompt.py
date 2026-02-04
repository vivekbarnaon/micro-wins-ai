from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from ai.schemas import TaskBreakdown


def get_task_breakdown_prompt():
    """
    Returns a PromptTemplate + JsonOutputParser
    strictly aligned to PS1 requirements.
    """

    parser = JsonOutputParser(pydantic_object=TaskBreakdown)

    prompt = PromptTemplate(
        template="""
You are an assistant that breaks a single task into small, calm, actionable steps.
This is NOT a chatbot. Do NOT give advice, motivation, or explanations.

TASK:
{task_description}

STEP GRANULARITY MODE:
{step_granularity}

RULES (STRICT):
- Output only JSON matching the schema.
- Each step must be ONE single action.
- Use simple, clear language.
- No motivational or reward language inside steps.
- No medical or psychological terms.
- Each step must take 1–5 minutes.

STEP COUNT RULES:
- micro  : 8–10 steps
- normal : 6–8 steps
- macro  : 4–6 steps

CONTENT RULES:
- Do not add social or emotional actions unless required by the task.
- Avoid compound sentences.
- Avoid unnecessary details.

Generate the task breakdown now.

{format_instructions}
""",
        input_variables=[
            "task_description",
            "step_granularity",
        ],
        partial_variables={
            "format_instructions": parser.get_format_instructions()
        },
    )

    return prompt, parser
