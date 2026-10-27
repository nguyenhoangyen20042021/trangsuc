import time
from datetime import datetime
from flask import Blueprint, request, jsonify
from db import query_all, execute, get_db_connection

orders_bp = Blueprint('orders_api', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    """Retrieve list of orders with line items."""
    try:
        orders_raw = query_all("SELECT * FROM donhang ORDER BY NgayDatHang DESC")
        orders = []
        for o in orders_raw:
            oid = o['MaDonHang']
            items_raw = query_all("SELECT * FROM chitietdonhang WHERE MaDonHang = %s", (oid,))
            items = []
            for it in items_raw:
                items.append({
                    'name': it['TenSanPhamSnap'],
                    'variant': it.get('KichThuocSnap', ''),
                    'qty': it['SoLuong'],
                    'price': float(it['DonGia'] or 0)
                })
            
            orders.append({
                'id': o['MaDonHangCode'] or f"LB{oid}",
                'dbId': oid,
                'customer': o['TenNguoiNhan'],
                'phone': o['SoDienThoaiNguoiNhan'],
                'address': o['DiaChiGiaoHang'],
                'total': float(o['TongThanhToan'] or 0),
                'date': o['NgayDatHang'].strftime('%d/%m/%Y %H:%M') if isinstance(o['NgayDatHang'], datetime) else str(o['NgayDatHang']),
                'paymentMethod': o.get('PhuongThucThanhToan', 'COD'),
                'paymentStatus': o.get('TrangThaiThanhToan', 'ChuaThanhToan'),
                'status': o.get('TrangThaiDonHang', 'ChoXacNhan'),
                'notes': o.get('GhiChu', ''),
                'items': items
            })
        return jsonify({'success': True, 'data': orders})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@orders_bp.route('/orders', methods=['POST'])
def create_order():
    """Create a new customer order with line items."""
    data = request.get_json() or {}
    user_id = data.get('userId') or 3
    code = f"LB{int(time.time() % 1000000)}"
    recipient = data.get('fullName', 'Khách hàng')
    phone = data.get('phone', '0987654321')
    address = data.get('address', 'TP. Hồ Chí Minh')
    notes = data.get('notes', '')
    subtotal = float(data.get('subtotal') or 0)
    shipping = float(data.get('shippingFee') or 0)
    discount = float(data.get('discountAmount') or 0)
    total = float(data.get('finalTotal') or (subtotal + shipping - discount))
    method = data.get('paymentMethod', 'COD')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO donhang (MaDonHangCode, MaNguoiDung, TenNguoiNhan, SoDienThoaiNguoiNhan, DiaChiGiaoHang, GhiChu,
                                TongTienHang, PhiVanChuyen, SoTienGiam, TongThanhToan, TrangThaiDonHang, PhuongThucThanhToan,
                                TrangThaiThanhToan, NgayDatHang)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'ChoXacNhan', %s, 'ChuaThanhToan', NOW())
        """, (code, user_id, recipient, phone, address, notes, subtotal, shipping, discount, total, method))
        order_id = cursor.lastrowid

        items = data.get('items') or []
        for it in items:
            name = it.get('TenSanPham', 'Trang sức')
            variant = it.get('TenBienThe', '')
            qty = int(it.get('SoLuong') or 1)
            price = float(it.get('GiaBan') or 0)
            variant_id = int(it.get('MaBienThe') or 1)
            cursor.execute("""
                INSERT INTO chitietdonhang (MaDonHang, MaBienThe, TenSanPhamSnap, KichThuocSnap, SoLuong, DonGia)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (order_id, variant_id, name, variant, qty, price))

        conn.commit()
        return jsonify({'success': True, 'orderCode': code, 'orderId': order_id})
    except Exception as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@orders_bp.route('/orders/<string:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order fulfillment status."""
    data = request.get_json() or {}
    new_status = data.get('status', 'DaXacNhan')
    try:
        if str(order_id).isdigit():
            execute("UPDATE donhang SET TrangThaiDonHang = %s WHERE MaDonHang = %s", (new_status, int(order_id)))
        else:
            execute("UPDATE donhang SET TrangThaiDonHang = %s WHERE MaDonHangCode = %s", (new_status, order_id))
        return jsonify({'success': True, 'message': 'Cập nhật trạng thái đơn hàng thành công.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
