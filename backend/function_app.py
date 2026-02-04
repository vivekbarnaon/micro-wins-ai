
import azure.functions as func
import logging


from user.user_profile import handle_get_profile, handle_update_profile
from task.create_task import handle_create_task
from task.get_current_step import handle_get_current_step
from task.mark_step_done import handle_mark_step_done

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="user/profile", methods=["GET"])
async def get_profile(req: func.HttpRequest) -> func.HttpResponse:
    """Get user profile (protected)"""
    logger.info("GET /user/profile")
    return await handle_get_profile(req)


@app.route(route="user/profile", methods=["PUT"])
async def update_profile(req: func.HttpRequest) -> func.HttpResponse:
    """Update user profile (protected)"""
    logger.info("PUT /user/profile")
    return await handle_update_profile(req)



@app.route(route="task/create", methods=["POST"])
async def create_task(req: func.HttpRequest) -> func.HttpResponse:
    """Create a new task with optional AI breakdown (protected)"""
    logger.info("POST /task/create")
    return await handle_create_task(req)


@app.route(route="task/current-step", methods=["GET"])
async def get_current_step(req: func.HttpRequest) -> func.HttpResponse:
    """Get current step for a task (protected)"""
    logger.info("GET /task/current-step")
    return await handle_get_current_step(req)


@app.route(route="task/mark-done", methods=["POST"])
async def mark_step_done(req: func.HttpRequest) -> func.HttpResponse:
    """Mark a step as completed (protected)"""
    logger.info("POST /task/mark-done")
    return await handle_mark_step_done(req)



@app.route(route="health", methods=["GET"])
async def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """Health check endpoint"""
    logger.info("GET /health")
    return func.HttpResponse(
        '{"status": "healthy", "service": "micro-wins-ai"}',
        status_code=200,
        mimetype="application/json"
    )