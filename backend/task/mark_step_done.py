import json
import azure.functions as func
from database.db import get_db_connection
from datetime import date


def handle_mark_step_done(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid JSON body", status_code=400)

    task_id = body.get("task_id")

    if not task_id:
        return func.HttpResponse("task_id is required", status_code=400)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get current step index + user_id
        cursor.execute(
            "SELECT current_step_index, user_id FROM tasks WHERE task_id = ?",
            (task_id,)
        )

        task = cursor.fetchone()
        if not task:
            conn.close()
            return func.HttpResponse("Task not found", status_code=404)

        current_index = task[0]
        user_id = task[1]
        current_step_order = current_index + 1

        # Mark step as done
        cursor.execute(
            "UPDATE task_steps SET is_done = 1 WHERE task_id = ? AND step_order = ?",
            (task_id, current_step_order)
        )

        # Increment progress
        cursor.execute(
            "UPDATE tasks SET current_step_index = current_step_index + 1 WHERE task_id = ?",
            (task_id,)
        )

        conn.commit()

        # Get next step
        cursor.execute(
            """
            SELECT step_order, step_text, estimated_time_minutes
            FROM task_steps
            WHERE task_id = ? AND step_order = ?
            """,
            (task_id, current_step_order + 1)
        )

        next_step = cursor.fetchone()

       
        # IF TASK COMPLETED
      
        if not next_step:

            # Mark task completed
            cursor.execute(
                "UPDATE tasks SET status = 'completed' WHERE task_id = ?",
                (task_id,)
            )

            today = date.today()
            reward_increment = 10

            # Check if stats row exists
            cursor.execute(
                "SELECT reward_points, streak, last_completed_date FROM user_stats WHERE user_id = ?",
                (user_id,)
            )
            stats = cursor.fetchone()

            if stats:
                reward_points = stats[0] or 0
                streak = stats[1] or 0
                last_date = stats[2]

                # Streak logic
                if last_date:
                    if (today - last_date).days == 1:
                        streak += 1
                    elif (today - last_date).days > 1:
                        streak = 1
                else:
                    streak = 1

                reward_points += reward_increment

                cursor.execute("""
                    UPDATE user_stats
                    SET reward_points = ?, streak = ?, last_completed_date = ?
                    WHERE user_id = ?
                """, (reward_points, streak, today, user_id))

            else:
                # First time completion
                cursor.execute("""
                    INSERT INTO user_stats (user_id, reward_points, streak, last_completed_date)
                    VALUES (?, ?, ?, ?)
                """, (user_id, reward_increment, 1, today))

            conn.commit()
            conn.close()

            return func.HttpResponse(
                json.dumps({"status": "completed"}),
                status_code=200,
                mimetype="application/json"
            )

        
        # RETURN NEXT STEP
       
        response = {
            "task_id": int(task_id),
            "step_number": next_step[0],
            "step_text": next_step[1],
            "estimated_time_minutes": next_step[2]
        }

        conn.close()

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
