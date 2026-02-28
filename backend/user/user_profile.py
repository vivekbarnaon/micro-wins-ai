import json
import azure.functions as func
from database.db import get_db_connection


def handle_get_profile(req: func.HttpRequest) -> func.HttpResponse:

    user_id = req.params.get("user_id")

    if not user_id:
        return func.HttpResponse(
            "user_id is required",
            status_code=400
        )

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT user_id, step_granularity, font_preference, input_mode
            FROM users
            WHERE user_id = ?
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            # Ensure user_stats row exists (SQL Server safe way)
            cursor.execute(
                "SELECT user_id FROM user_stats WHERE user_id = ?",
                (user_id,)
            )
            stats_exists = cursor.fetchone()

            if not stats_exists:
                cursor.execute(
                    """
                    INSERT INTO user_stats (user_id, reward_points, streak, last_completed_date)
                    VALUES (?, 0, 0, NULL)
                    """,
                    (user_id,)
                )
                conn.commit()

            conn.close()

            return func.HttpResponse(
                json.dumps({"exists": False}),
                status_code=200,
                mimetype="application/json"
            )

        response = {
            "exists": True,
            "user_id": user[0],
            "step_granularity": user[1],
            "font_preference": user[2],
            "input_mode": user[3]
        }

        conn.close()

        return func.HttpResponse(
            json.dumps(response),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        import logging
        print("DEBUG ERROR:", str(e))
        logging.error(f"Database error: {str(e)}")
        return func.HttpResponse(
            f"Database error: {str(e)}",
            status_code=500
        )


def handle_update_profile(req: func.HttpRequest) -> func.HttpResponse:

    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            "Invalid JSON body",
            status_code=400
        )

    user_id = body.get("user_id")
    step_granularity = body.get("step_granularity")
    font_preference = body.get("font_preference")
    input_mode = body.get("input_mode")

    if not all([user_id, step_granularity, font_preference, input_mode]):
        return func.HttpResponse(
            "Missing required fields",
            status_code=400
        )

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute(
            "SELECT user_id FROM users WHERE user_id = ?",
            (user_id,)
        )

        exists = cursor.fetchone()

        if exists:
            cursor.execute(
                """
                UPDATE users
                SET step_granularity = ?, font_preference = ?, input_mode = ?
                WHERE user_id = ?
                """,
                (step_granularity, font_preference, input_mode, user_id)
            )
        else:
            cursor.execute(
                """
                INSERT INTO users (user_id, step_granularity, font_preference, input_mode)
                VALUES (?, ?, ?, ?)
                """,
                (user_id, step_granularity, font_preference, input_mode)
            )

        conn.commit()
        conn.close()

        return func.HttpResponse(
            json.dumps({"status": "saved"}),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        import logging
        print("DEBUG ERROR:", str(e))
        logging.error(f"Database error: {str(e)}")
        return func.HttpResponse(
            f"Database error: {str(e)}",
            status_code=500
        )
