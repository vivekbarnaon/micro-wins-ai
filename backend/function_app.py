import azure.functions as func
import logging

from database.schema import create_tables
from user.user_profile import handle_get_profile, handle_update_profile
from task.create_task import handle_create_task
from task.get_current_step import handle_get_current_step
from task.mark_step_done import handle_mark_step_done

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = func.FunctionApp()

# Initialize DB tables on startup
try:
    create_tables()
    logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Database init failed: {e}")


@app.route(route="user/profile", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def get_profile(req: func.HttpRequest) -> func.HttpResponse:
    logger.info("GET /user/profile")
    return handle_get_profile(req)


@app.route(route="user/profile", methods=["PUT"], auth_level=func.AuthLevel.ANONYMOUS)
def update_profile(req: func.HttpRequest) -> func.HttpResponse:
    logger.info("PUT /user/profile")
    return handle_update_profile(req)


@app.route(route="task/create", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def create_task(req: func.HttpRequest) -> func.HttpResponse:
    logger.info("POST /task/create")
    return handle_create_task(req)


@app.route(route="task/current-step", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def get_current_step(req: func.HttpRequest) -> func.HttpResponse:
    logger.info("GET /task/current-step")
    return handle_get_current_step(req)


@app.route(route="task/mark-done", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def mark_step_done(req: func.HttpRequest) -> func.HttpResponse:
    logger.info("POST /task/mark-done")
    return handle_mark_step_done(req)


@app.route(route="health", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    logger.info("GET /health")
    return func.HttpResponse(
        '{"status": "ok", "service": "smart-companion-backend"}',
        status_code=200,
        mimetype="application/json"
    )
