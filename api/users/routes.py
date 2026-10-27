from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from db import query_all, query_one, execute
from api.utils import clean_row

users_bp = Blueprint('users_api', __name__)

@users_bp.route('/users', methods=['GET'])
def get_users():
    """Retrieve list of registered users and roles."""
    try:
        users_raw = query_all("""
            SELECT nd.*, vt.TenVaiTro 
            FROM nguoidung nd
            LEFT JOIN vaitro vt ON nd.MaVaiTro = vt.MaVaiTro
            ORDER BY nd.MaNguoiDung ASC
        """)
        users = []
        for u in users_raw:
            users.append({
                'id': u['MaNguoiDung'],
                'username': u['TenDangNhap'],
                'fullName': u['HoTen'],
                'email': u['Email'],
                'phone': u.get('SoDienThoai', ''),
                'role': u.get('TenVaiTro', 'CUSTOMER'),
                'active': True
            })
        return jsonify({'success': True, 'data': users})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@users_bp.route('/users', methods=['POST'])
def create_user():
    """Create a new user account."""
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    fullname = data.get('fullName', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    raw_password = data.get('password', '123456')
    hashed_pwd = generate_password_hash(raw_password)

    role_str = data.get('role', 'CUSTOMER')
    role_id = 3
    if role_str == 'ADMIN':
        role_id = 1
    elif role_str == 'STAFF':
        role_id = 2

    try:
        rowcount, last_id = execute("""
            INSERT INTO nguoidung (TenDangNhap, MatKhauMaHoa, HoTen, Email, SoDienThoai, MaVaiTro, NgayTao)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """, (username, hashed_pwd, fullname, email, phone, role_id))
        return jsonify({'success': True, 'message': 'Đã tạo tài khoản người dùng thành công.', 'id': last_id})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@users_bp.route('/auth/login', methods=['POST'])
def api_login():
    """Authenticate user with username/email and password."""
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'success': False, 'message': 'Vui lòng điền đầy đủ tài khoản và mật khẩu.'}), 400

    user = query_one("""
        SELECT nd.*, vt.TenVaiTro 
        FROM nguoidung nd 
        JOIN vaitro vt ON nd.MaVaiTro = vt.MaVaiTro 
        WHERE nd.TenDangNhap = %s OR nd.Email = %s
    """, (username, username))

    if not user:
        return jsonify({'success': False, 'message': 'Tài khoản không tồn tại trong hệ thống.'}), 401

    pwd_match = False
    stored_hash = user.get('MatKhauMaHoa', '')
    if stored_hash.startswith('pbkdf2:') or stored_hash.startswith('scrypt:'):
        pwd_match = check_password_hash(stored_hash, password)
    else:
        pwd_match = (stored_hash == password)

    if not pwd_match:
        return jsonify({'success': False, 'message': 'Mật khẩu không chính xác.'}), 401

    session['user_id'] = user['MaNguoiDung']
    session['username'] = user['TenDangNhap']
    session['role'] = user['TenVaiTro']
    session['full_name'] = user['HoTen']
    session.permanent = True

    return jsonify({
        'success': True,
        'message': f"Đăng nhập thành công! Chào mừng {user['HoTen']}.",
        'user': {
            'id': user['MaNguoiDung'],
            'username': user['TenDangNhap'],
            'fullName': user['HoTen'],
            'email': user['Email'],
            'phone': user.get('SoDienThoai', ''),
            'role': user['TenVaiTro']
        }
    })

@users_bp.route('/auth/logout', methods=['POST'])
def api_logout():
    """Clear session on logout."""
    session.clear()
    return jsonify({'success': True, 'message': 'Đã đăng xuất thành công.'})

@users_bp.route('/auth/me', methods=['GET'])
def api_me():
    """Get current session user profile."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'user': None})

    user = query_one("""
        SELECT nd.*, vt.TenVaiTro 
        FROM nguoidung nd 
        JOIN vaitro vt ON nd.MaVaiTro = vt.MaVaiTro 
        WHERE nd.MaNguoiDung = %s
    """, (user_id,))

    if not user:
        session.clear()
        return jsonify({'success': False, 'user': None})

    return jsonify({
        'success': True,
        'user': {
            'id': user['MaNguoiDung'],
            'username': user['TenDangNhap'],
            'fullName': user['HoTen'],
            'email': user['Email'],
            'phone': user.get('SoDienThoai', ''),
            'role': user['TenVaiTro']
        }
    })
