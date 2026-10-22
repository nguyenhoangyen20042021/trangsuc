import pymysql
from pymysql.cursors import DictCursor
from config import Config
from contextlib import contextmanager

def get_db_connection():
    """Establish and return a PyMySQL connection with utf8mb4 encoding."""
    return pymysql.connect(
        host=Config.MYSQL_HOST,
        port=Config.MYSQL_PORT,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
        charset=Config.MYSQL_CHARSET,
        cursorclass=DictCursor,
        autocommit=False
    )

@contextmanager
def get_db():
    """Context manager for safe database queries with auto-commit/rollback."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            yield cursor, conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def query_all(sql, params=None):
    """Execute query and fetch all rows as dictionaries."""
    with get_db() as (cursor, conn):
        cursor.execute(sql, params or ())
        return cursor.fetchall()

def query_one(sql, params=None):
    """Execute query and fetch one row as a dictionary."""
    with get_db() as (cursor, conn):
        cursor.execute(sql, params or ())
        return cursor.fetchone()

def execute(sql, params=None):
    """Execute query and return affected rows and last inserted ID."""
    with get_db() as (cursor, conn):
        cursor.execute(sql, params or ())
        return cursor.rowcount, cursor.lastrowid
