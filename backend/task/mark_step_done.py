import json
import azure.functions as func

from database.db import get_db_connection


def handle_mark_step_done(req: func.HttpRequest) -> func.HttpResponse:
    """
    Marks the current step as done and returns the next step.
    Request body:
    {
      "task_id": 1
    }
    """

    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            "Invalid JSON body",
            status_code=400
        )

    task_id = body.get("task_id")

    if not task_id:
        return func.HttpResponse(
            "task_id is required",
            status_code=400
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get current task state
    cursor.execute(
        """
        SELECT current_step_index
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

    current_index = task["current_step_index"]
    current_step_order = current_index + 1

    # Mark current step as done
    cursor.execute(
        """
        UPDATE task_steps
        SET is_done = 1
        WHERE task_id = ? AND step_order = ?
        """,
        (task_id, current_step_order)
    )

    # Increment task progress
    cursor.execute(
        """
        UPDATE tasks
        SET current_step_index = current_step_index + 1
        WHERE task_id = ?
        """,
        (task_id,)
    )

    conn.commit()

    # Fetch next step
    cursor.execute(
        """
        SELECT step_order, step_text, estimated_time_minutes
        FROM task_steps
        WHERE task_id = ? AND step_order = ?
        """,
        (task_id, current_step_order + 1)
    )

    next_step = cursor.fetchone()

    if not next_step:
        # Mark task as completed
        cursor.execute(
            """
            UPDATE tasks
            SET status = 'completed'
            WHERE task_id = ?
            """,
            (task_id,)
        )
        conn.commit()
        conn.close()

        return func.HttpResponse(
            json.dumps({"status": "completed"}),
            status_code=200,
            mimetype="application/json"
        )

    conn.close()

    response = {
        "task_id": int(task_id),
        "step_number": next_step["step_order"],
        "step_text": next_step["step_text"],
        "estimated_time_minutes": next_step["estimated_time_minutes"]
    }

    return func.HttpResponse(
        json.dumps(response),
        status_code=200,
        mimetype="application/json"
    )
