import sys
if sys.stdout and sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import os
from flask import Flask, send_from_directory, redirect, abort
from flask_cors import CORS

from config import Config
from api import api_bp

# ----------------- FLASK APP INITIALIZATION -----------------
app = Flask(__name__, static_folder='static')
app.config.from_object(Config)
CORS(app)

# ----------------- PRODUCT IMAGE UPLOAD CONFIGURATION -----------------
UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads', 'products')
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Tối đa 16MB mỗi request
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ----------------- REGISTER MODULAR API BLUEPRINT -----------------
# All domain endpoints are mounted under /api
app.register_blueprint(api_bp)

# ----------------- REACT SPA CLIENT & STATIC ROUTES -----------------
FRONTEND_DIST = os.path.join(app.root_path, 'frontend', 'dist')

@app.route('/assets/<path:filename>')
def serve_react_assets(filename):
    """Serve compiled Vite assets if dist build exists."""
    assets_dir = os.path.join(FRONTEND_DIST, 'assets')
    if os.path.exists(os.path.join(assets_dir, filename)):
        return send_from_directory(assets_dir, filename)
    abort(404)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    """Serve React SPA or redirect to Vite dev server."""
    if path.startswith('api') or path.startswith('static'):
        abort(404)
    file_path = os.path.join(FRONTEND_DIST, path)
    if path and os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIST, path)
    index_file = os.path.join(FRONTEND_DIST, 'index.html')
    if os.path.exists(index_file):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return redirect('http://localhost:5173')

# ----------------- RUN SERVER -----------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
