from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class NeuroUserProfile(BaseModel):
    """User's neurodivergent profile for personalized task breakdown"""
    user_id: str
    
    # 🧠 Cognitive traits
    neurodivergence: Literal["ADHD", "Dyslexia", "Autism"] = "ADHD"
    
    # ⚡ Energy patterns
    break_interval_minutes: int = Field(
        default=25,
        ge=5,
        le=120,
        description="Break interval in minutes between work sessions"
    )
    fatigue_triggers: Optional[List[str]] = Field(
        default=None,
        description="Factors that commonly cause fatigue (e.g. noise, long sessions)"
    )
    
    # 🗣️ AI behavior preferences
    ai_tone: List[Literal["calm", "Friendly", "strict"]] = Field(default=["calm"])
    response_verbosity: int = Field(
        default=3,
        ge=1,
        le=5,
        description="Controls response detail level (1=simple and short, 5=detailed)"
    )
    step_granularity: Literal["micro", "normal", "macro"] = "normal"


class BreakdownStep(BaseModel):
    """Individual step in task breakdown"""
    step_number: int = Field(description="Step number in the breakdown")
    step_task: str = Field(
        description="Generate one small single step at a time, don't use two sentences"
    )
    estimated_time_minutes: int = Field(
        description="Estimated minutes to complete the action"
    )


class NeuroTaskBreakdown(BaseModel):
    """Neurodivergent-friendly task breakdown"""
    task_name: str = Field(description="Name of the task")
    difficulty_level: int = Field(
        ge=1,
        le=5,
        description="Difficulty level on a scale of 1-5"
    )
    breakdown: List[BreakdownStep] = Field(
        description="High-level phases of the task"
    )
