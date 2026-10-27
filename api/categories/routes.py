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
            child_cnt_total = 0
            for child in p['children']:
                c_cnt = query_one("SELECT COUNT(*) AS cnt FROM sanpham WHERE MaDanhMuc = %s", (child['MaDanhMuc'],))
                child['SoLuongSP'] = c_cnt['cnt'] if c_cnt else 0
                child_cnt_total += child['SoLuongSP']

            count_row = query_one("SELECT COUNT(*) AS cnt FROM sanpham WHERE MaDanhMuc = %s", (p['MaDanhMuc'],))
            direct_cnt = count_row['cnt'] if count_row else 0
            p['SoLuongSP'] = direct_cnt + child_cnt_total
        return jsonify({'success': True, 'data': clean_rows(parents)})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@categories_bp.route('/categories', methods=['POST'])
def create_category():
    """Create a new category or subcategory."""
    data = request.get_json() or {}
    name = data.get('TenDanhMuc', '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Vui lòng nhập tên danh mục.'}), 400

    desc = data.get('MoTa', '')
    parent_id = data.get('MaDanhMucCha')
    if parent_id:
        try:
            parent_id = int(parent_id)
        except (ValueError, TypeError):
            parent_id = None
    else:
        parent_id = None

    try:
        rowcount, last_id = execute("""
            INSERT INTO danhmuc (TenDanhMuc, MaDanhMucCha, MoTa)
            VALUES (%s, %s, %s)
        """, (name, parent_id, desc))
        return jsonify({
            'success': True,
            'message': 'Tạo danh mục mới thành công.',
            'id': last_id,
            'data': {
                'MaDanhMuc': last_id,
                'TenDanhMuc': name,
                'MaDanhMucCha': parent_id,
                'MoTa': desc,
                'children': [],
                'SoLuongSP': 0
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@categories_bp.route('/categories/<int:cat_id>', methods=['PUT'])
def update_category(cat_id):
    """Update category or subcategory information."""
    data = request.get_json() or {}
    name = data.get('TenDanhMuc', '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Vui lòng nhập tên danh mục.'}), 400
    desc = data.get('MoTa', '')

    parent_id = data.get('MaDanhMucCha')
    if parent_id is not None:
        try:
            parent_id = int(parent_id) if parent_id else None
        except (ValueError, TypeError):
            parent_id = None

    try:
        if 'MaDanhMucCha' in data:
            execute("""
                UPDATE danhmuc SET TenDanhMuc = %s, MoTa = %s, MaDanhMucCha = %s WHERE MaDanhMuc = %s
            """, (name, desc, parent_id, cat_id))
        else:
            execute("""
                UPDATE danhmuc SET TenDanhMuc = %s, MoTa = %s WHERE MaDanhMuc = %s
            """, (name, desc, cat_id))
        return jsonify({'success': True, 'message': 'Cập nhật danh mục thành công.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@categories_bp.route('/categories/<int:cat_id>', methods=['DELETE'])
def delete_category(cat_id):
    """Delete a category or subcategory."""
    try:
        # Check if products exist in this category
        cnt = query_one("SELECT COUNT(*) AS cnt FROM sanpham WHERE MaDanhMuc = %s", (cat_id,))
        if cnt and cnt['cnt'] > 0:
            return jsonify({
                'success': False,
                'message': f'Không thể xóa vì đang có {cnt["cnt"]} sản phẩm liên kết với danh mục này.'
            }), 400

        # Check if subcategories have products
        sub_prods = query_one("""
            SELECT COUNT(*) AS cnt 
            FROM sanpham 
            WHERE MaDanhMuc IN (SELECT MaDanhMuc FROM danhmuc WHERE MaDanhMucCha = %s)
        """, (cat_id,))
        if sub_prods and sub_prods['cnt'] > 0:
            return jsonify({
                'success': False,
                'message': f'Không thể xóa danh mục cha vì các danh mục con đang có {sub_prods["cnt"]} sản phẩm.'
            }), 400

        execute("DELETE FROM danhmuc WHERE MaDanhMuc = %s", (cat_id,))
        return jsonify({'success': True, 'message': 'Đã xóa danh mục thành công.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

