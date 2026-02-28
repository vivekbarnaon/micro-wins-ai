import json
import azure.functions as func
from database.db import get_db_connection


def handle_get_current_step(req: func.HttpRequest) -> func.HttpResponse:

    task_id = req.params.get("task_id")

    if not task_id:
        return func.HttpResponse(
            "task_id is required",
            status_code=400
        )

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get task progress
        cursor.execute(
            """
            SELECT current_step_index, status, task_name
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

        current_step_index = task[0]
        status = task[1]
        task_name = task[2]

        if status == "completed":
            conn.close()
            return func.HttpResponse(
                json.dumps({"completed": True}),
                status_code=200,
                mimetype="application/json"
            )

        current_step_order = current_step_index + 1

        # Get total steps
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM task_steps
            WHERE task_id = ?
            """,
            (task_id,)
        )

        total_steps = cursor.fetchone()[0]

        # Fetch current step
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
                json.dumps({"completed": True}),
                status_code=200,
                mimetype="application/json"
            )

        response = {
            "task_id": int(task_id),
            "task_name": task_name,
            "current_step_number": step[0],
            "total_steps": total_steps,
            "step_description": step[1],
            "estimated_time_minutes": step[2],
            "completed": False
        }

        return func.HttpResponse(
            json.dumps(response),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        return func.HttpResponse(
            f"Database error: {str(e)}",
            status_code=500
        )
