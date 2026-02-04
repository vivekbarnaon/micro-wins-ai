"""
Mark Step Done Module
Handles marking task steps as completed and progressing to next step
"""

import azure.functions as func
import json
from typing import Dict, Any, Optional
from datetime import datetime
from auth.verify_token import require_auth


async def mark_step_completed(task_id: str, user_id: str, step_number: int) -> Optional[Dict[str, Any]]:
    """
    Mark a specific step as completed in the database
    
    Args:
        task_id: Task identifier
        user_id: User identifier (for authorization)
        step_number: Step number to mark as completed
        
    Returns:
        Updated task data or None if failed
    """
    # TODO: Implement database update
    # from database.db import get_db_connection
    
    # Mock response
    return {
        "task_id": task_id,
        "user_id": user_id,
        "current_step": step_number + 1,
        "updated_at": datetime.utcnow().isoformat(),
        "message": "Step marked as completed!"
    }


async def get_next_step_info(task_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """
    Get information about the next step after completion
    
    Args:
        task_id: Task identifier
        user_id: User identifier
        
    Returns:
        Next step info or completion message
    """
    # TODO: Implement database query
    # from database.db import get_db_connection
    
    # Mock response
    return {
        "has_next_step": True,
        "next_step": {
            "step_number": 2,
            "description": "Next step description"
        },
        "progress": {
            "completed_steps": 1,
            "total_steps": 3,
            "percentage": 33.33
        }
    }


@require_auth
async def handle_mark_step_done(req: func.HttpRequest, user_id: str) -> func.HttpResponse:
    """
    HTTP trigger to mark a step as completed
    Protected route - requires authentication
    
    Expected request body:
    {
        "task_id": "task_123",
        "step_number": 1
    }
    """
    try:
        # Parse request body
        req_body = req.get_json()
        
        # Validate required fields
        task_id = req_body.get("task_id")
        step_number = req_body.get("step_number")
        
        if not task_id:
            return func.HttpResponse(
                json.dumps({"error": "task_id is required"}),
                status_code=400,
                mimetype="application/json"
            )
        
        if step_number is None:
            return func.HttpResponse(
                json.dumps({"error": "step_number is required"}),
                status_code=400,
                mimetype="application/json"
            )
        
        # Mark step as completed
        result = await mark_step_completed(task_id, user_id, step_number)
        
        if not result:
            return func.HttpResponse(
                json.dumps({"error": "Failed to mark step as completed"}),
                status_code=500,
                mimetype="application/json"
            )
        
        # Get next step info
        next_step = await get_next_step_info(task_id, user_id)
        
        # Combine results
        response = {
            **result,
            "next_step_info": next_step
        }
        
        return func.HttpResponse(
            json.dumps(response),
            status_code=200,
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
