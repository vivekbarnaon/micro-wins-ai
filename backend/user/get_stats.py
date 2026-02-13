"""
Get User Stats Module
Retrieves user progress statistics
"""

import json
import azure.functions as func
from datetime import datetime, timedelta

from database.db import get_db_connection


def handle_get_user_stats(req: func.HttpRequest) -> func.HttpResponse:
    """
    Returns user statistics including completed tasks, streaks, etc.
    Query param required: user_id
    """

    user_id = req.params.get("user_id")

    if not user_id:
        return func.HttpResponse(
            "user_id is required",
            status_code=400
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    # Total tasks completed
    cursor.execute(
        """
        SELECT COUNT(*) as total
        FROM tasks
        WHERE user_id = ? AND status = 'completed'
        """,
        (user_id,)
    )
    completed_result = cursor.fetchone()
    total_completed = completed_result["total"] if completed_result else 0

    # Total tasks in progress
    cursor.execute(
        """
        SELECT COUNT(*) as total
        FROM tasks
        WHERE user_id = ? AND status = 'active'
        """,
        (user_id,)
    )
    active_result = cursor.fetchone()
    total_active = active_result["total"] if active_result else 0

    # Total steps completed
    cursor.execute(
        """
        SELECT COUNT(*) as total
        FROM task_steps ts
        JOIN tasks t ON ts.task_id = t.task_id
        WHERE t.user_id = ? AND ts.is_done = 1
        """,
        (user_id,)
    )
    steps_result = cursor.fetchone()
    total_steps = steps_result["total"] if steps_result else 0

    # Recent tasks (last 5 completed)
    cursor.execute(
        """
        SELECT task_name, created_at
        FROM tasks
        WHERE user_id = ? AND status = 'completed'
        ORDER BY created_at DESC
        LIMIT 5
        """,
        (user_id,)
    )
    recent_tasks = cursor.fetchall()

    conn.close()

    response = {
        "user_id": user_id,
        "total_tasks_completed": total_completed,
        "total_tasks_active": total_active,
        "total_steps_completed": total_steps,
        "recent_tasks": [
            {
                "task_name": task["task_name"],
                "completed_at": task["created_at"]
            }
            for task in recent_tasks
        ] if recent_tasks else []
    }

    return func.HttpResponse(
        json.dumps(response),
        status_code=200,
        mimetype="application/json"
    )
