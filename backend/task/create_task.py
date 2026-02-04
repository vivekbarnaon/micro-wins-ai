"""
Task Creation Module
Handles creation of new tasks with AI-powered step breakdown
"""

import azure.functions as func
import json
from typing import Dict, Any, List
from datetime import datetime
from auth.verify_token import require_auth


async def create_task_in_db(user_id: str, task_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new task in the database
    
    Args:
        user_id: User identifier
        task_data: Task information including title, description, steps
        
    Returns:
        Created task with ID and metadata
    """
    # TODO: Implement database insertion
    # from database.db import get_db_connection
    
    # Mock response
    task_id = "task_123456"
    
    return {
        "task_id": task_id,
        "user_id": user_id,
        "title": task_data.get("title"),
        "description": task_data.get("description"),
        "steps": task_data.get("steps", []),
        "current_step": 0,
        "completed": False,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }


async def break_task_into_steps(task_description: str) -> List[Dict[str, Any]]:
    """
    Use AI to break down a task into micro-steps
    
    Args:
        task_description: Natural language task description
        
    Returns:
        List of step objects
    """
    # TODO: Implement AI task breaking
    # from ai.task_breaker import break_into_micro_wins
    
    # Mock steps for now
    return [
        {"step_number": 1, "description": "First step", "completed": False},
        {"step_number": 2, "description": "Second step", "completed": False},
        {"step_number": 3, "description": "Third step", "completed": False}
    ]


@require_auth
async def handle_create_task(req: func.HttpRequest, user_id: str) -> func.HttpResponse:
    """
    HTTP trigger to create a new task
    Protected route - requires authentication
    
    Expected request body:
    {
        "title": "Task title",
        "description": "Task description",
        "use_ai": true  // Optional: use AI to break into steps
    }
    """
    try:
        # Parse request body
        req_body = req.get_json()
        
        # Validate required fields
        if not req_body.get("title"):
            return func.HttpResponse(
                json.dumps({"error": "Title is required"}),
                status_code=400,
                mimetype="application/json"
            )
        
        # Break into steps if requested
        steps = []
        if req_body.get("use_ai", False):
            description = req_body.get("description", req_body.get("title"))
            steps = await break_task_into_steps(description)
        
        # Prepare task data
        task_data = {
            "title": req_body.get("title"),
            "description": req_body.get("description", ""),
            "steps": steps
        }
        
        # Create task
        task = await create_task_in_db(user_id, task_data)
        
        return func.HttpResponse(
            json.dumps(task),
            status_code=201,
            mimetype="application/json"
        )
    
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON"}),
            status_code=400,
            mimetype="application/json"
        )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
