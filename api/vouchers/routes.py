from flask import Blueprint, request, jsonify, session
from db import query_all, query_one, execute
from api.common.pricing import calculate_order_pricing, get_available_vouchers
from api.utils import currency_format

vouchers_bp = Blueprint('vouchers_api', __name__)

@vouchers_bp.route('/vouchers', methods=['GET'])
def get_vouchers():
    """Retrieve list of active promotion vouchers."""
    try:
        vouchers = query_all("SELECT * FROM magiamgia WHERE TrangThai = 1 ORDER BY MaVoucher DESC")
        res = []
        for v in vouchers:
            res.append({
                'MaGiamGia': v['MaVoucher'],
                'MaCode': v['MaCode'],
                'MoTa': f"Giảm {float(v.get('GiaTriGiam') or 0):,.0f}₫ cho đơn từ {float(v.get('DonHangToiThieu') or 0):,.0f}₫".replace(',', '.'),
                'GiaTriGiam': float(v.get('GiaTriGiam') or 0),
                'GiaTriDonToiThieu': float(v.get('DonHangToiThieu') or 0),
                'LoaiGiamGia': v.get('LoaiGiamGia', 'TienMat'),
                'active': True if v.get('TrangThai') else False
            })
        return jsonify({'success': True, 'data': res})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@vouchers_bp.route('/vouchers', methods=['POST'])
def create_voucher():
    """Create a new discount voucher."""
    data = request.get_json() or {}
    code = data.get('MaCode', '').strip().upper()
    val = float(data.get('GiaTriGiam') or 500000)
    min_order = float(data.get('GiaTriDonToiThieu') or 5000000)
    try:
        rowcount, last_id = execute("""
            INSERT INTO magiamgia (MaCode, LoaiGiamGia, GiaTriGiam, DonHangToiThieu, SoLuongSuDung, SoLuongDaDung, TrangThai)
            VALUES (%s, 'TienMat', %s, %s, 100, 0, 1)
        """, (code, val, min_order))
        return jsonify({'success': True, 'message': f"Đã tạo voucher {code}.", 'id': last_id})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@vouchers_bp.route('/vouchers/<int:vid>', methods=['DELETE'])
def delete_voucher(vid):
    """Delete a voucher by ID."""
    try:
        execute("DELETE FROM magiamgia WHERE MaVoucher = %s", (vid,))
        return jsonify({'success': True, 'message': 'Đã xóa voucher.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@vouchers_bp.route('/voucher/apply', methods=['POST'])
@vouchers_bp.route('/vouchers/apply', methods=['POST'])
def apply_voucher():
    """Calculate and apply voucher to shopping cart."""
    data = request.get_json(silent=True) or {}
    code = str(data.get('voucher_code', '')).strip().upper()
    cart_items = data.get('cart') or session.get('cart', {})

    if not code:
        session.pop('voucher_code', None)
        return jsonify({'success': False, 'message': 'Vui lòng nhập mã giảm giá.'}), 400

    pricing = calculate_order_pricing(cart_items, voucher_code=code)
    if pricing['voucher_error']:
        return jsonify({'success': False, 'message': pricing['voucher_error']}), 400

    session['voucher_code'] = code
    applied = pricing['applied_voucher']
    val_giam = applied.get('GiaTriGiam', 0)
    desc = f"Giảm {val_giam:g}%" if applied.get('LoaiGiamGia') == 'PERCENT' else f"Giảm {currency_format(val_giam)}"

    return jsonify({
        'success': True,
        'message': f"Áp dụng mã ưu đãi '{code}' thành công!",
        'code': code,
        'discount_amount': float(pricing['discount_amount']),
        'discount_amount_formatted': currency_format(pricing['discount_amount']),
        'subtotal': float(pricing['subtotal']),
        'subtotal_formatted': currency_format(pricing['subtotal']),
        'shipping_fee': float(pricing['shipping_fee']),
        'shipping_fee_formatted': 'Miễn phí' if pricing['shipping_fee'] == 0 else currency_format(pricing['shipping_fee']),
        'grand_total': float(pricing['grand_total']),
        'grand_total_formatted': currency_format(pricing['grand_total']),
        'voucher_desc': desc
    })

@vouchers_bp.route('/voucher/remove', methods=['POST'])
@vouchers_bp.route('/vouchers/remove', methods=['POST'])
def remove_voucher():
    """Remove active voucher and re-calculate cart values."""
    session.pop('voucher_code', None)
    data = request.get_json(silent=True) or {}
    cart_items = data.get('cart') or session.get('cart', {})
    pricing = calculate_order_pricing(cart_items, voucher_code=None)

    return jsonify({
        'success': True,
        'message': 'Đã gỡ bỏ mã giảm giá.',
        'discount_amount': 0,
        'subtotal': float(pricing['subtotal']),
        'subtotal_formatted': currency_format(pricing['subtotal']),
        'shipping_fee': float(pricing['shipping_fee']),
        'shipping_fee_formatted': 'Miễn phí' if pricing['shipping_fee'] == 0 else currency_format(pricing['shipping_fee']),
        'grand_total': float(pricing['grand_total']),
        'grand_total_formatted': currency_format(pricing['grand_total'])
    })
