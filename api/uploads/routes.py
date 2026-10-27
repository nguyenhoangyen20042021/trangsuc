import os
import time
import uuid
from flask import Blueprint, request, jsonify, current_app

uploads_bp = Blueprint('uploads_api', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@uploads_bp.route('/upload', methods=['POST'])
def upload_file():
    """Handle product and banner image uploads."""
    file = request.files.get('image') or request.files.get('file')
    if not file or not file.filename:
        return jsonify({'success': False, 'message': 'Không tìm thấy file ảnh tải lên.'}), 400

    if not allowed_file(file.filename):
        return jsonify({'success': False, 'message': 'Định dạng ảnh không được hỗ trợ (chỉ nhận JPG, PNG, WEBP, GIF).'}), 400

    ext = file.filename.rsplit('.', 1)[-1].lower()
    timestamp = int(time.time())
    rand_str = uuid.uuid4().hex[:6]
    safe_name = f"prod_upload_{timestamp}_{rand_str}.{ext}"

    upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'products')
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, safe_name)
    file.save(file_path)

    url = f"/static/uploads/products/{safe_name}"
    return jsonify({
        'success': True,
        'url': url,
        'filename': safe_name,
        'message': 'Tải ảnh lên thành công.'
    })
