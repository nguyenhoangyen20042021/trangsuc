import datetime
from decimal import Decimal
from db import query_all, query_one, get_db
from api.utils import currency_format

def calculate_order_pricing(cart_items, voucher_code=None):
    """
    Tính toán chi tiết sản phẩm, tạm tính, phí ship, số tiền giảm và tổng thanh toán.
    Hỗ trợ kiểm tra điều kiện voucher và trả về applied_voucher cùng thông báo lỗi chi tiết nếu có.
    """
    items_detail = []
    subtotal = Decimal('0')

    for variant_id_str, item_info in list(cart_items.items()):
        try:
            variant_id = int(variant_id_str)
        except (ValueError, TypeError):
            continue

        variant = query_one("""
            SELECT bt.*, sp.TenSanPham, sp.ChatLieu,
                   (SELECT DuongDanAnh FROM hinhanhsanpham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
            FROM bienthesanpham bt
            JOIN sanpham sp ON bt.MaSanPham = sp.MaSanPham
            WHERE bt.MaBienThe = %s
        """, (variant_id,))

        if not variant:
            continue

        qty = item_info.get('quantity', 1)
        line_total = Decimal(str(variant['GiaBan'])) * qty
        subtotal += line_total

        items_detail.append({
            'variant_id': variant['MaBienThe'],
            'product_name': variant['TenSanPham'],
            'slug': f"sp-{variant['MaSanPham']}",
            'sku': variant.get('SKU', ''),
            'size': variant.get('KichThuocSize', ''),
            'gemstone': variant.get('LoaiDa', ''),
            'price': float(variant['GiaBan']),
            'image': variant.get('HinhAnhBienThe') or variant.get('HinhAnhChinh'),
            'quantity': qty,
            'stock': variant.get('SoLuongTonKho', 0),
            'line_total': float(line_total)
        })

    # Miễn phí vận chuyển cho đơn hàng từ 5,000,000 VND hoặc giỏ hàng trống
    shipping_fee = Decimal('0') if (subtotal >= Decimal('5000000') or subtotal == Decimal('0')) else Decimal('30000')

    discount_amount = Decimal('0')
    applied_voucher = None
    voucher_error = None

    if voucher_code and subtotal > Decimal('0'):
        v = query_one("SELECT * FROM magiamgia WHERE MaCode = %s", (voucher_code,))
        if not v:
            voucher_error = f"Mã giảm giá '{voucher_code}' không tồn tại."
        elif not v.get('TrangThai'):
            voucher_error = f"Mã ưu đãi '{voucher_code}' hiện đang tạm ngừng hoạt động."
        elif v.get('NgayKetThuc') and v['NgayKetThuc'] <= datetime.datetime.now():
            voucher_error = f"Mã ưu đãi '{voucher_code}' đã hết hạn sử dụng."
        elif v.get('SoLuongSuDung') and v.get('SoLuongDaDung', 0) >= v['SoLuongSuDung']:
            voucher_error = f"Mã ưu đãi '{voucher_code}' đã hết lượt sử dụng."
        else:
            min_order = Decimal(str(v.get('DonHangToiThieu', 0)))
            if subtotal < min_order:
                voucher_error = f"Mã '{voucher_code}' yêu cầu đơn hàng tối thiểu {currency_format(min_order)} (Hiện tại: {currency_format(subtotal)})."
            else:
                applied_voucher = v
                val_giam = Decimal(str(v.get('GiaTriGiam', 0)))
                if v.get('LoaiGiamGia') == 'PERCENT':
                    discount = (subtotal * val_giam) / Decimal('100')
                    if v.get('GiaTriGiamToiDa'):
                        max_discount = Decimal(str(v['GiaTriGiamToiDa']))
                        discount = min(discount, max_discount)
                    discount_amount = min(discount, subtotal)
                else:
                    discount_amount = min(val_giam, subtotal)

    grand_total = max(Decimal('0'), subtotal + shipping_fee - discount_amount)

    return {
        'items': items_detail,
        'subtotal': subtotal,
        'shipping_fee': shipping_fee,
        'discount_amount': discount_amount,
        'grand_total': grand_total,
        'applied_voucher': applied_voucher,
        'voucher_error': voucher_error
    }

def get_available_vouchers(subtotal=Decimal('0')):
    """Lấy danh sách các mã giảm giá đang kích hoạt và còn hạn sử dụng."""
    vouchers = query_all("""
        SELECT * FROM magiamgia 
        WHERE TrangThai = 1 AND (NgayKetThuc IS NULL OR NgayKetThuc > NOW()) AND (SoLuongSuDung IS NULL OR SoLuongSuDung > SoLuongDaDung)
        ORDER BY DonHangToiThieu ASC
    """)
    res = []
    for v in vouchers:
        v_dict = dict(v)
        min_order = Decimal(str(v_dict.get('DonHangToiThieu', 0)))
        v_dict['is_eligible'] = (subtotal >= min_order)
        v_dict['needed_amount'] = max(Decimal('0'), min_order - subtotal)
        val_giam = v_dict.get('GiaTriGiam', 0)
        if v_dict.get('LoaiGiamGia') == 'PERCENT':
            desc = f"Giảm {val_giam:g}%"
            if v_dict.get('GiaTriGiamToiDa'):
                desc += f" (Tối đa {currency_format(v_dict['GiaTriGiamToiDa'])})"
        else:
            desc = f"Giảm {currency_format(val_giam)}"
        v_dict['description'] = desc
        res.append(v_dict)
    return res

def sync_cart_to_db(user_id, cart_dict):
    """Lưu giỏ hàng vào bảng giohang và chitietgiohang."""
    try:
        with get_db() as (cursor, conn):
            cursor.execute("SELECT MaGioHang FROM giohang WHERE MaNguoiDung = %s", (user_id,))
            gh = cursor.fetchone()
            if not gh:
                cursor.execute("INSERT INTO giohang (MaNguoiDung) VALUES (%s)", (user_id,))
                gio_hang_id = cursor.lastrowid
            else:
                gio_hang_id = gh['MaGioHang']

            cursor.execute("DELETE FROM chitietgiohang WHERE MaGioHang = %s", (gio_hang_id,))
            for var_id_str, item in cart_dict.items():
                cursor.execute("""
                    INSERT INTO chitietgiohang (MaGioHang, MaBienThe, SoLuong)
                    VALUES (%s, %s, %s)
                """, (gio_hang_id, int(var_id_str), item.get('quantity', 1)))
    except Exception as e:
        print(f"Error syncing cart: {e}")
