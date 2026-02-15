import azure.functions as func
import logging

from database.schema import create_tables
from user.user_profile import handle_get_profile, handle_update_profile
from user.get_stats import handle_get_user_stats
from task.create_task import handle_create_task
from task.get_current_step import handle_get_current_step
from task.mark_step_done import handle_mark_step_done

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = func.FunctionApp()

def add_cors_headers(response: func.HttpResponse) -> func.HttpResponse:
    """Add CORS headers to allow frontend access"""
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Max-Age'] = '3600'
    return response

# Initialize DB tables on startup
try:
    create_tables()
    logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Database init failed: {e}")


@app.route(route="user/profile", methods=["GET", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def get_profile(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return add_cors_headers(func.HttpResponse(status_code=200))
    logger.info("GET /user/profile")
    return add_cors_headers(handle_get_profile(req))


@app.route(route="user/profile/update", methods=["PUT", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def update_profile(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return add_cors_headers(func.HttpResponse(status_code=200))
    logger.info("PUT /user/profile")
    return add_cors_headers(handle_update_profile(req))


@app.route(route="task/create", methods=["POST", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def create_task(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return add_cors_headers(func.HttpResponse(status_code=200))
    logger.info("POST /task/create")
    return add_cors_headers(handle_create_task(req))


@app.route(route="task/current-step", methods=["GET", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def get_current_step(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return add_cors_headers(func.HttpResponse(status_code=200))
    logger.info("GET /task/current-step")
    return add_cors_headers(handle_get_current_step(req))


@app.route(route="task/mark-done", methods=["POST", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def mark_step_done(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return add_cors_headers(func.HttpResponse(status_code=200))
    logger.info("POST /task/mark-done")
    return add_cors_headers(handle_mark_step_done(req))


@app.route(route="health", methods=["GET", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return add_cors_headers(func.HttpResponse(status_code=200))
    logger.info("GET /health")
    return add_cors_headers(func.HttpResponse(
        '{"status": "ok", "service": "smart-companion-backend"}',
        status_code=200,
        mimetype="application/json"
    ))


@app.route(route="user/stats", methods=["GET", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def get_user_stats(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return add_cors_headers(func.HttpResponse(status_code=200))
    logger.info("GET /user/stats")
    return add_cors_headers(handle_get_user_stats(req))
