from pydantic import BaseModel, Field
from typing import List


class Step(BaseModel):
    step_number: int = Field(description="Order of the step")
    text: str = Field(
        description="One small, single-action step. No compound sentences."
    )
    estimated_time_minutes: int = Field(
        ge=1,
        le=5,
        description="Estimated minutes to complete this step"
    )


class TaskBreakdown(BaseModel):
    task_name: str = Field(description="Short name of the task")
    difficulty_level: int = Field(
        ge=1,
        le=5,
        description="Difficulty level from 1 (easy) to 5 (hard)"
    )
    steps: List[Step] = Field(
        description="Ordered list of micro-steps"
    )
