import json
import azure.functions as func
from database.db import get_db_connection
from user.badges import BADGES


def handle_get_user_stats(req: func.HttpRequest) -> func.HttpResponse:

    user_id = req.params.get("user_id")

    if not user_id:
        return func.HttpResponse(
            "user_id is required",
            status_code=400
        )

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Completed tasks
        cursor.execute(
            "SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'completed'",
            (user_id,)
        )
        total_completed = cursor.fetchone()[0] # type: ignore

        # Active tasks
        cursor.execute(
            "SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'active'",
            (user_id,)
        )
        total_active = cursor.fetchone()[0] # type: ignore

        # Total steps completed
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM task_steps ts
            JOIN tasks t ON ts.task_id = t.task_id
            WHERE t.user_id = ? AND ts.is_done = 1
            """,
            (user_id,)
        )
        total_steps = cursor.fetchone()[0] # type: ignore

        # User stats
        cursor.execute(
            """
            SELECT reward_points, streak, last_completed_date
            FROM user_stats
            WHERE user_id = ?
            """,
            (user_id,)
        )

        stats_row = cursor.fetchone()

        if stats_row:
            reward_points = stats_row[0] or 0
            streak = stats_row[1] or 0
            last_completed_date = stats_row[2]
            if last_completed_date is not None:
                last_completed_date = str(last_completed_date)
        else:
            reward_points = 0
            streak = 0
            last_completed_date = None

        # Recent tasks (SQL Server uses TOP not LIMIT)
        cursor.execute(
            """
            SELECT TOP 5 task_name, created_at
            FROM tasks
            WHERE user_id = ? AND status = 'completed'
            ORDER BY created_at DESC
            """,
            (user_id,)
        )

        recent_rows = cursor.fetchall()

        recent_tasks = []
        for row in recent_rows:
            completed_at = row[1]
            if completed_at is not None:
                completed_at = str(completed_at)
            recent_tasks.append({
                "task_name": row[0],
                "completed_at": completed_at
            })

        # Badges
        cursor.execute(
            "SELECT badge_code, earned_at FROM user_badges WHERE user_id = ?",
            (user_id,)
        )

        badge_rows = cursor.fetchall()
        badge_dict = {b["code"]: b for b in BADGES}

        earned_badges = []
        for row in badge_rows:
            code = row[0]
            earned_at = row[1]
            if earned_at is not None:
                earned_at = str(earned_at)
            badge = badge_dict.get(code)
            if badge:
                earned_badges.append({
                    "code": code,
                    "name": badge["name"],
                    "description": badge["description"],
                    "emoji": badge["emoji"],
                    "earned_at": earned_at
                })

        conn.close()

        # Motivational message
        if streak >= 7:
            motivational_message = "🔥 Amazing! You're on a hot streak!"
        elif streak >= 3:
            motivational_message = "🌟 Great job! Keep your streak going!"
        elif total_completed > 0:
            motivational_message = "👏 Every step counts. Keep it up!"
        else:
            motivational_message = "Let's get started with your first win!"

        response = {
            "user_id": user_id,  # yahan int(user_id) hata do, sirf user_id likho
            "total_tasks_completed": total_completed,
            "total_tasks_active": total_active,
            "total_steps_completed": total_steps,
            "reward_points": reward_points,
            "streak": streak,
            "last_completed_date": last_completed_date,
            "motivational_message": motivational_message,
            "badges": earned_badges,
            "recent_tasks": recent_tasks
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
