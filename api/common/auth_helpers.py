from functools import wraps
from flask import session, jsonify, request
from db import query_one

def login_required(f):
    """Ensure a user is authenticated."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'success': False, 'message': 'Vui lòng đăng nhập để tiếp tục.'}), 401
        return f(*args, **kwargs)
    return decorated_function

def staff_required(f):
    """Ensure user has STAFF or ADMIN role."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'success': False, 'message': 'Vui lòng đăng nhập bằng tài khoản quản trị hoặc nhân viên.'}), 401
        user = query_one("""
            SELECT vt.TenVaiTro FROM NguoiDung nd 
            JOIN VaiTro vt ON nd.MaVaiTro = vt.MaVaiTro 
            WHERE nd.MaNguoiDung = %s
        """, (session['user_id'],))
        if not user or user['TenVaiTro'] not in ['ADMIN', 'STAFF']:
            return jsonify({'success': False, 'message': 'Bạn không có quyền truy cập chức năng này.'}), 403
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Ensure user has ADMIN role."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'success': False, 'message': 'Vui lòng đăng nhập bằng tài khoản quản trị viên.'}), 401
        user = query_one("""
            SELECT vt.TenVaiTro FROM NguoiDung nd 
            JOIN VaiTro vt ON nd.MaVaiTro = vt.MaVaiTro 
            WHERE nd.MaNguoiDung = %s
        """, (session['user_id'],))
        if not user or user['TenVaiTro'] != 'ADMIN':
            return jsonify({'success': False, 'message': 'Chức năng chỉ dành riêng cho Quản trị viên (ADMIN)!'}), 403
        return f(*args, **kwargs)
    return decorated_function
