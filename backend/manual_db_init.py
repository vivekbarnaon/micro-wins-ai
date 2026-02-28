import logging
from database.schema import create_tables

logger = logging.getLogger(__name__)

try:
    create_tables()
    logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Database init failed: {e}")
