from flask import Blueprint, request, jsonify
from db import query_all, query_one, execute
from api.utils import clean_rows

categories_bp = Blueprint('categories_api', __name__)

@categories_bp.route('/categories', methods=['GET'])
def get_categories():
    """Retrieve all categories structured hierarchically with product counts."""
    try:
        cats_raw = query_all("SELECT * FROM danhmuc ORDER BY MaDanhMuc ASC")
        parents = [c for c in cats_raw if not c.get('MaDanhMucCha')]
        for p in parents:
            p['children'] = [c for c in cats_raw if c.get('MaDanhMucCha') == p['MaDanhMuc']]
            count_row = query_one("SELECT COUNT(*) AS cnt FROM sanpham WHERE MaDanhMuc = %s", (p['MaDanhMuc'],))
            p['SoLuongSP'] = count_row['cnt'] if count_row else 0
            if not p.get('AnhDaiDien'):
                p['AnhDaiDien'] = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'
        return jsonify({'success': True, 'data': clean_rows(parents)})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@categories_bp.route('/categories', methods=['POST'])
def create_category():
    """Create a new category."""
    data = request.get_json() or {}
    name = data.get('TenDanhMuc', '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Vui lòng nhập tên danh mục.'}), 400

    desc = data.get('MoTa', '')
    parent_id = data.get('MaDanhMucCha') or None

    try:
        rowcount, last_id = execute("""
            INSERT INTO danhmuc (TenDanhMuc, MaDanhMucCha, MoTa)
            VALUES (%s, %s, %s)
        """, (name, parent_id, desc))
        return jsonify({'success': True, 'message': 'Tạo danh mục mới thành công.', 'id': last_id})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@categories_bp.route('/categories/<int:cat_id>', methods=['PUT'])
def update_category(cat_id):
    """Update category information."""
    data = request.get_json() or {}
    name = data.get('TenDanhMuc', '').strip()
    desc = data.get('MoTa', '')

    try:
        execute("""
            UPDATE danhmuc SET TenDanhMuc = %s, MoTa = %s WHERE MaDanhMuc = %s
        """, (name, desc, cat_id))
        return jsonify({'success': True, 'message': 'Cập nhật danh mục thành công.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@categories_bp.route('/categories/<int:cat_id>', methods=['DELETE'])
def delete_category(cat_id):
    """Delete a category."""
    try:
        execute("DELETE FROM danhmuc WHERE MaDanhMuc = %s", (cat_id,))
        return jsonify({'success': True, 'message': 'Đã xóa danh mục.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
