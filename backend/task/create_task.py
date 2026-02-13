import json
import sqlite3
import azure.functions as func

from database.db import get_db_connection
from ai.task_breaker import generate_neuro_task_breakdown
from ai.schemas import NeuroUserProfile


def handle_create_task(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            "Invalid JSON body",
            status_code=400
        )

    user_id = body.get("user_id")
    task_description = body.get("task")
    
    # User profile parameters (with defaults)
    neurodivergence = body.get("neurodivergence", "ADHD")
    step_granularity = body.get("step_granularity", "normal")
    break_interval = body.get("break_interval_minutes", 25)
    fatigue_triggers = body.get("fatigue_triggers", ["long paragraphs"])
    ai_tone = body.get("ai_tone", ["calm"])
    response_verbosity = body.get("response_verbosity", 3)

    if not user_id or not task_description:
        return func.HttpResponse(
            "user_id and task are required",
            status_code=400
        )

    # Build user profile
    user_profile = NeuroUserProfile(
        user_id=user_id,
        neurodivergence=neurodivergence,
        break_interval_minutes=break_interval,
        fatigue_triggers=fatigue_triggers,
        ai_tone=ai_tone,
        response_verbosity=response_verbosity,
        step_granularity=step_granularity
    )

    # Generate steps using LLM with neurodivergent profile
    try:
        breakdown = generate_neuro_task_breakdown(
            task_description=task_description,
            user_profile=user_profile
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"LLM generation failed: {str(e)}", exc_info=True)
        return func.HttpResponse(
            f"LLM generation failed: {str(e)}",
            status_code=500
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert task
    cursor.execute(
        """
        INSERT INTO tasks (user_id, task_name, difficulty_level, current_step_index)
        VALUES (?, ?, ?, 0)
        """,
        (
            user_id,
            breakdown.task_name,
            breakdown.difficulty_level
        )
    )

    task_id = cursor.lastrowid

    # Insert steps (note: breakdown.breakdown instead of breakdown.steps)
    for step in breakdown.breakdown:
        cursor.execute(
            """
            INSERT INTO task_steps (task_id, step_order, step_text, estimated_time_minutes)
            VALUES (?, ?, ?, ?)
            """,
            (
                task_id,
                step.step_number,
                step.step_task,
                step.estimated_time_minutes
            )
        )

    conn.commit()

    # Fetch first step only
    cursor.execute(
        """
        SELECT step_order, step_text, estimated_time_minutes
        FROM task_steps
        WHERE task_id = ? AND step_order = 1
        """,
        (task_id,)
    )

    first_step = cursor.fetchone()
    conn.close()

    if not first_step:
        return func.HttpResponse(
            "No steps generated",
            status_code=500
        )

    response = {
        "task_id": task_id,
        "step_number": first_step["step_order"],
        "step_text": first_step["step_text"],
        "estimated_time_minutes": first_step["estimated_time_minutes"]
    }

    return func.HttpResponse(
        json.dumps(response),
        status_code=200,
        mimetype="application/json"
    )
