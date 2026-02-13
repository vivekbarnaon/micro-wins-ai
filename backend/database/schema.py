from database.db import get_db_connection


def create_tables():

    """
    Create all required tables if they do not exist.
    Run this once on app startup.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    # User badges table (virtual badge system)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_badges (
            user_id TEXT NOT NULL,
            badge_code TEXT NOT NULL,
            earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, badge_code),
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    """)

  
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

    # User stats table (reward points, streak, last activity)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_stats (
            user_id TEXT PRIMARY KEY,
            reward_points INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            last_active_date DATE,
            last_completed_date DATE,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    """)

    conn.commit()
    conn.close()
