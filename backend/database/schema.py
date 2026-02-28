from database.db import get_db_connection


def create_tables():
    """
    Create all required tables for Azure SQL Server.
    Safe for production.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

    # USERS TABLE
    cursor.execute("""
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
    CREATE TABLE users (
        user_id NVARCHAR(100) PRIMARY KEY,
        step_granularity NVARCHAR(50) NOT NULL,
        font_preference NVARCHAR(50) NOT NULL,
        input_mode NVARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
    )
    """)

    # TASKS TABLE
    cursor.execute("""
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tasks' AND xtype='U')
    CREATE TABLE tasks (
        task_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id NVARCHAR(100) NOT NULL,
        task_name NVARCHAR(255) NOT NULL,
        difficulty_level INT NOT NULL,
        current_step_index INT DEFAULT 0,
        status NVARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_tasks_users FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    """)

    # TASK STEPS TABLE
    cursor.execute("""
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='task_steps' AND xtype='U')
    CREATE TABLE task_steps (
        step_id INT IDENTITY(1,1) PRIMARY KEY,
        task_id INT NOT NULL,
        step_order INT NOT NULL,
        step_text NVARCHAR(MAX) NOT NULL,
        estimated_time_minutes INT NOT NULL,
        is_done BIT DEFAULT 0,
        CONSTRAINT FK_steps_tasks FOREIGN KEY (task_id) REFERENCES tasks(task_id)
    )
    """)

    # USER STATS TABLE
    cursor.execute("""
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_stats' AND xtype='U')
    CREATE TABLE user_stats (
        user_id NVARCHAR(100) PRIMARY KEY,
        reward_points INT DEFAULT 0,
        streak INT DEFAULT 0,
        last_active_date DATE,
        last_completed_date DATE,
        CONSTRAINT FK_stats_users FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    """)

    # USER BADGES TABLE
    cursor.execute("""
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_badges' AND xtype='U')
    CREATE TABLE user_badges (
        user_id NVARCHAR(100) NOT NULL,
        badge_code NVARCHAR(100) NOT NULL,
        earned_at DATETIME DEFAULT GETDATE(),
        PRIMARY KEY (user_id, badge_code),
        CONSTRAINT FK_badges_users FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    """)

    conn.commit()
    conn.close()
