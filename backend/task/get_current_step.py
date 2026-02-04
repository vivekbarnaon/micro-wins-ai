"""
Get Current Step Module
Retrieves the current active step for a task
"""

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
