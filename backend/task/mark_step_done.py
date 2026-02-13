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
        # Get user_id for this task
        cursor.execute(
            """
            SELECT user_id FROM tasks WHERE task_id = ?
            """,
            (task_id,)
        )
        user_row = cursor.fetchone()
        user_id = user_row["user_id"] if user_row else None

        if user_id:
            # Check if user_stats row exists
            cursor.execute(
                """
                SELECT reward_points, streak, last_completed_date FROM user_stats WHERE user_id = ?
                """,
                (user_id,)
            )
            stats = cursor.fetchone()
            from datetime import datetime, timedelta, date
            today = date.today()
            reward_increment = 10  # Points per completed task
            if stats:
                last_date = stats["last_completed_date"]
                streak = stats["streak"] or 0
                reward_points = stats["reward_points"] or 0
                # Check streak (consecutive days)
                if last_date:
                    try:
                        last_date_obj = datetime.strptime(last_date, "%Y-%m-%d").date()
                    except Exception:
                        last_date_obj = today
                    if (today - last_date_obj).days == 1:
                        streak += 1
                    elif (today - last_date_obj).days == 0:
                        # Same day, don't increment streak
                        pass
                    else:
                        streak = 1
                else:
                    streak = 1
                reward_points += reward_increment
                cursor.execute(
                    """
                    UPDATE user_stats
                    SET reward_points = ?, streak = ?, last_completed_date = ?
                    WHERE user_id = ?
                    """,
                    (reward_points, streak, today.isoformat(), user_id)
                )
            else:
                # Insert new row
                cursor.execute(
                    """
                    INSERT INTO user_stats (user_id, reward_points, streak, last_completed_date)
                    VALUES (?, ?, ?, ?)
                    """,
                    (user_id, reward_increment, 1, today.isoformat())
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
