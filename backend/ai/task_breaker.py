"""
AI Task Breaker Module
Uses OpenAI to break down tasks into micro-wins (small achievable steps)
"""

import os
from typing import List, Dict, Any
import json


async def break_into_micro_wins(task_description: str, max_steps: int = 5) -> List[Dict[str, Any]]:
    """
    Break down a task into micro-wins using AI
    
    Args:
        task_description: Natural language description of the task
        max_steps: Maximum number of steps to generate (default: 5)
        
    Returns:
        List of step objects with descriptions
    """
    # TODO: Implement OpenAI integration
    # For now, return a simple breakdown
    
    # Check if OpenAI API key is available
    api_key = os.environ.get("OPENAI_API_KEY")
    
    if not api_key:
        # Return simple breakdown without AI
        return generate_simple_breakdown(task_description, max_steps)
    
    # TODO: Call OpenAI API
    # from openai import AsyncOpenAI
    # client = AsyncOpenAI(api_key=api_key)
    
    # Example prompt for OpenAI:
    prompt = f"""
    Break down the following task into {max_steps} small, achievable micro-wins.
    Each step should be:
    - Simple and specific
    - Achievable in 5-15 minutes
    - Clear and actionable
    
    Task: {task_description}
    
    Return ONLY a JSON array of steps in this format:
    [
        {{"step_number": 1, "description": "Step description", "estimated_minutes": 10}},
        {{"step_number": 2, "description": "Step description", "estimated_minutes": 5}}
    ]
    """
    
    # Mock AI response for now
    return generate_simple_breakdown(task_description, max_steps)


def generate_simple_breakdown(task_description: str, max_steps: int) -> List[Dict[str, Any]]:
    """
    Generate a simple task breakdown without AI
    
    Args:
        task_description: Task description
        max_steps: Number of steps to generate
        
    Returns:
        List of generic steps
    """
    steps = []
    
    # Generate generic steps based on max_steps
    step_templates = [
        "Plan and gather requirements",
        "Set up initial structure",
        "Implement core functionality",
        "Test and verify results",
        "Review and finalize"
    ]
    
    for i in range(min(max_steps, len(step_templates))):
        steps.append({
            "step_number": i + 1,
            "description": step_templates[i],
            "completed": False,
            "estimated_minutes": 10
        })
    
    return steps


async def refine_step(step_description: str) -> str:
    """
    Use AI to refine and make a step more specific
    
    Args:
        step_description: Original step description
        
    Returns:
        Refined step description
    """
    # TODO: Implement OpenAI refinement
    return step_description


async def suggest_next_action(completed_steps: List[str], remaining_steps: List[str]) -> Dict[str, Any]:
    """
    Use AI to suggest the best next action based on progress
    
    Args:
        completed_steps: List of completed step descriptions
        remaining_steps: List of remaining step descriptions
        
    Returns:
        Suggestion object with next action and reasoning
    """
    # TODO: Implement AI suggestion logic
    
    if not remaining_steps:
        return {
            "suggestion": "All steps completed! Great job! 🎉",
            "reasoning": "You've finished all the micro-wins for this task."
        }
    
    return {
        "suggestion": f"Focus on: {remaining_steps[0]}",
        "reasoning": "This is the next logical step in your task progression.",
        "estimated_time": "10-15 minutes"
    }
