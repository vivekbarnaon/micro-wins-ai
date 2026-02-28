import os
import pyodbc

def get_db_connection():
    connection_string = os.getenv("DB_CONNECTION_STRING")

    if not connection_string:
        raise Exception("DB_CONNECTION_STRING not set")

    conn = pyodbc.connect(connection_string)
    return conn