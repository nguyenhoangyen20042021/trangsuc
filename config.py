import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'aura_luxury_jewelry_secret_key_2026_xyz')
    
    # MySQL Database Configuration
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '11111')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'wed_trang_suc')
    MYSQL_CHARSET = 'utf8mb4'

    # DeepSeek AI Configuration
    DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')
    DEEPSEEK_BASE_URL = os.environ.get('DEEPSEEK_BASE_URL', 'https://api.deepseek.com')
    DEEPSEEK_MODEL = os.environ.get('DEEPSEEK_MODEL', 'deepseek-chat')
