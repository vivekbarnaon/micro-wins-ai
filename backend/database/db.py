import sqlite3
import os

DB_PATH = os.getenv("DB_PATH", "micro_wins.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn
