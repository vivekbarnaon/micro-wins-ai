from database.db import get_db_connection


def create_tables():
    """
    Create all required tables if they do not exist.
    Run this once on app startup.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

  
    # Users table (preferences only)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            step_granularity TEXT NOT NULL,
            font_preference TEXT NOT NULL,
            input_mode TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tasks table
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            task_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            task_name TEXT NOT NULL,
            difficulty_level INTEGER NOT NULL,
            current_step_index INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    """)

    
    # Task steps table
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS task_steps (
            step_id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            step_order INTEGER NOT NULL,
            step_text TEXT NOT NULL,
            estimated_time_minutes INTEGER NOT NULL,
            is_done INTEGER DEFAULT 0,
            FOREIGN KEY (task_id) REFERENCES tasks (task_id)
        )
    """)

    conn.commit()
    conn.close()
