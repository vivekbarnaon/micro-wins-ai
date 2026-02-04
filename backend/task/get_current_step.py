"""
Get Current Step Module
Retrieves the current active step for a task
"""

import azure.functions as func
import json
from typing import Dict, Any, Optional
from auth.verify_token import require_auth


async def get_task_from_db(task_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve task from database
    
    Args:
        task_id: Task identifier
        user_id: User identifier (for authorization)
        
    Returns:
        Task data or None if not found
    """
    # TODO: Implement database query
    # from database.db import get_db_connection
    
    # Mock data
    return {
        "task_id": task_id,
        "user_id": user_id,
        "title": "Sample Task",
        "description": "Sample task description",
        "steps": [
            {"step_number": 1, "description": "First step", "completed": True},
            {"step_number": 2, "description": "Second step", "completed": False},
            {"step_number": 3, "description": "Third step", "completed": False}
        ],
        "current_step": 1,
        "completed": False
    }


def get_current_step_info(task: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Extract current step information from task
    
    Args:
        task: Task object with steps
        
    Returns:
        Current step info or None if all completed
    """
    steps = task.get("steps", [])
    current_step_index = task.get("current_step", 0)
    
    # Check if all steps completed
    if current_step_index >= len(steps):
        return None
    
    current_step = steps[current_step_index]
    
    return {
        "task_id": task.get("task_id"),
        "task_title": task.get("title"),
        "current_step": current_step,
        "progress": {
            "completed_steps": current_step_index,
            "total_steps": len(steps),
            "percentage": round((current_step_index / len(steps)) * 100, 2) if steps else 0
        }
    }


@require_auth
async def handle_get_current_step(req: func.HttpRequest, user_id: str) -> func.HttpResponse:
    """
    HTTP trigger to get current step of a task
    Protected route - requires authentication
    
    Query parameters:
        task_id: Task identifier
    """
    try:
        # Get task_id from query params
        task_id = req.params.get("task_id")
        
        if not task_id:
            return func.HttpResponse(
                json.dumps({"error": "task_id is required"}),
                status_code=400,
                mimetype="application/json"
            )
        
        # Get task from database
        task = await get_task_from_db(task_id, user_id)
        
        if not task:
            return func.HttpResponse(
                json.dumps({"error": "Task not found"}),
                status_code=404,
                mimetype="application/json"
            )
        
        # Get current step info
        step_info = get_current_step_info(task)
        
        if not step_info:
            return func.HttpResponse(
                json.dumps({
                    "task_id": task_id,
                    "message": "All steps completed! 🎉",
                    "completed": True
                }),
                status_code=200,
                mimetype="application/json"
            )
        
        return func.HttpResponse(
            json.dumps(step_info),
            status_code=200,
            mimetype="application/json"
        )
    
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
import json
import azure.functions as func

from database.db import get_db_connection


def handle_get_current_step(req: func.HttpRequest) -> func.HttpResponse:
    """
    Returns the current active step for a given task.
    Query param required: task_id
    """

    task_id = req.params.get("task_id")

    if not task_id:
        return func.HttpResponse(
            "task_id is required",
            status_code=400
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get task progress
    cursor.execute(
        """
        SELECT current_step_index, status
        FROM tasks
        WHERE task_id = ?
        """,
        (task_id,)
    )
    task = cursor.fetchone()

    if not task:
        conn.close()
        return func.HttpResponse(
            "Task not found",
            status_code=404
        )

    if task["status"] == "completed":
        conn.close()
        return func.HttpResponse(
            json.dumps({"status": "completed"}),
            status_code=200,
            mimetype="application/json"
        )

    current_step_order = task["current_step_index"] + 1

    # Fetch current step only
    cursor.execute(
        """
        SELECT step_order, step_text, estimated_time_minutes
        FROM task_steps
        WHERE task_id = ? AND step_order = ?
        """,
        (task_id, current_step_order)
    )

    step = cursor.fetchone()
    conn.close()

    if not step:
        return func.HttpResponse(
            json.dumps({"status": "completed"}),
            status_code=200,
            mimetype="application/json"
        )

    response = {
        "task_id": int(task_id),
        "step_number": step["step_order"],
        "step_text": step["step_text"],
        "estimated_time_minutes": step["estimated_time_minutes"]
    }

    return func.HttpResponse(
        json.dumps(response),
        status_code=200,
        mimetype="application/json"
    )
