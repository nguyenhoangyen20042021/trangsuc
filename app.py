import sys
if sys.stdout and sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import json
import random
import datetime
from decimal import Decimal
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify, abort
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

from config import Config
from db import get_db, query_all, query_one, execute
from ai_service import generate_deepseek_consultation, get_deepseek_config, save_deepseek_config

app = Flask(__name__)
app.config.from_object(Config)

# ----------------- JINJA FILTERS & CONTEXT HELPERS -----------------
@app.template_filter('currency')
def currency_filter(val):
    if val is None:
        return '0 ₫'
    try:
        val = int(Decimal(str(val)))
        return f"{val:,.0f}".replace(',', '.') + ' ₫'
    except Exception:
        return f"{val} ₫"

@app.template_filter('order_status_info')
def order_status_info(status):
    mapping = {
        'ChoXacNhan': {'text': 'Chờ Xác Nhận', 'class': 'badge-warning', 'step': 1},
        'DaXacNhan': {'text': 'Đã Xác Nhận', 'class': 'badge-info', 'step': 2},
        'DangGiao': {'text': 'Đang Giao Hàng', 'class': 'badge-primary', 'step': 3},
        'DaGiao': {'text': 'Giao Thành Công', 'class': 'badge-success', 'step': 4},
        'DaHuy': {'text': 'Đã Hủy Đơn', 'class': 'badge-danger', 'step': 0}
    }
    return mapping.get(status, {'text': status, 'class': 'badge-secondary', 'step': 1})

@app.template_filter('payment_status_info')
def payment_status_info(status):
    mapping = {
        'ChuaThanhToan': {'text': 'Chưa Thanh Toán', 'class': 'badge-warning'},
        'DaThanhToan': {'text': 'Đã Thanh Toán', 'class': 'badge-success'},
        'HoanTien': {'text': 'Đã Hoàn Tiền', 'class': 'badge-danger'}
    }
    return mapping.get(status, {'text': status, 'class': 'badge-secondary'})

@app.context_processor
def inject_global_data():
    categories = query_all("""
        SELECT dm.*, 
               (SELECT ha.DuongDanAnh 
                FROM SanPham sp 
                JOIN HinhAnhSanPham ha ON ha.MaSanPham = sp.MaSanPham 
                WHERE sp.MaDanhMuc = dm.MaDanhMuc 
                ORDER BY sp.MaSanPham ASC, ha.ThuTuHienThi ASC LIMIT 1
               ) AS HinhAnhDaiDien
        FROM DanhMuc dm 
        ORDER BY dm.MaDanhMuc ASC
    """)
    
    # Số lượng sản phẩm trong giỏ hàng
    cart_count = 0
    cart = session.get('cart', {})
    for item in cart.values():
        cart_count += item.get('quantity', 0)
        
    user = None
    if 'user_id' in session:
        user = query_one("""
            SELECT nd.*, vt.TenVaiTro 
            FROM NguoiDung nd 
            JOIN VaiTro vt ON nd.MaVaiTro = vt.MaVaiTro 
            WHERE nd.MaNguoiDung = %s
        """, (session['user_id'],))
        
    return {
        'nav_categories': categories,
        'cart_count': cart_count,
        'current_user': user,
        'now': datetime.datetime.now(),
        'deepseek_config': get_deepseek_config()
    }

# ----------------- AUTH DECORATORS -----------------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Vui lòng đăng nhập để tiếp tục.', 'warning')
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Vui lòng đăng nhập bằng tài khoản quản trị.', 'warning')
            return redirect(url_for('login', next=request.url))
        user = query_one("""
            SELECT vt.TenVaiTro FROM NguoiDung nd 
            JOIN VaiTro vt ON nd.MaVaiTro = vt.MaVaiTro 
            WHERE nd.MaNguoiDung = %s
        """, (session['user_id'],))
        if not user or user['TenVaiTro'] not in ['ADMIN', 'STAFF']:
            flash('Bạn không có quyền truy cập trang quản trị.', 'danger')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

# ----------------- CLIENT ROUTES -----------------

@app.route('/')
def index():
    """Trang chủ hiển thị banner, danh mục, sản phẩm nổi bật & bán chạy."""
    featured_products = query_all("""
        SELECT sp.*, dm.TenDanhMuc, MIN(bt.GiaBan) AS GiaMin, MAX(bt.GiaBan) AS GiaMax,
               (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
        FROM SanPham sp
        JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
        LEFT JOIN BienTheSanPham bt ON sp.MaSanPham = bt.MaSanPham
        WHERE sp.TrangThai = 'DangBan' AND sp.LaNoiBat = 1
        GROUP BY sp.MaSanPham
        LIMIT 8
    """)
    
    bestseller_products = query_all("""
        SELECT sp.*, dm.TenDanhMuc, MIN(bt.GiaBan) AS GiaMin, MAX(bt.GiaBan) AS GiaMax,
               (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh,
               COALESCE(SUM(ctdh.SoLuong), 0) AS TongBan
        FROM SanPham sp
        JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
        LEFT JOIN BienTheSanPham bt ON sp.MaSanPham = bt.MaSanPham
        LEFT JOIN ChiTietDonHang ctdh ON bt.MaBienThe = ctdh.MaBienThe
        WHERE sp.TrangThai = 'DangBan'
        GROUP BY sp.MaSanPham
        ORDER BY TongBan DESC, sp.LaNoiBat DESC
        LIMIT 8
    """)
    active_vouchers = query_all("""
        SELECT * FROM MaGiamGia 
        WHERE TrangThai = 1 AND NgayKetThuc > NOW() AND SoLuongSuDung > SoLuongDaDung 
        ORDER BY GiaTriGiam DESC LIMIT 3
    """)
    
    return render_template('index.html', 
                           featured_products=featured_products, 
                           bestseller_products=bestseller_products,
                           latest_reviews=[],
                           active_vouchers=active_vouchers)

@app.route('/products')
def products():
    """Trang danh mục sản phẩm có bộ lọc đa năng (Category, Chất liệu, Phong cách, Giá, Sắp xếp)."""
    cat_slug = request.args.get('category')
    material = request.args.get('material')
    style = request.args.get('style')
    audience = request.args.get('audience')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    search_query = request.args.get('q', '').strip()
    sort_by = request.args.get('sort', 'newest')

    sql = """
        SELECT sp.*, dm.TenDanhMuc, dm.Slug AS CatSlug,
               COALESCE(MIN(bt.GiaBan), sp.GiaCoSo, 0) AS GiaMin,
               COALESCE(MAX(bt.GiaBan), sp.GiaCoSo, 0) AS GiaMax,
               COALESCE(SUM(bt.SoLuongTonKho), 0) AS TongTonKho,
               (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
        FROM SanPham sp
        JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
        LEFT JOIN BienTheSanPham bt ON sp.MaSanPham = bt.MaSanPham
        WHERE sp.TrangThai = 'DangBan'
    """
    params = []

    if cat_slug:
        sql += " AND dm.Slug = %s"
        params.append(cat_slug)
    if material:
        sql += " AND sp.ChatLieu = %s"
        params.append(material)
    if style:
        sql += " AND sp.PhongCach = %s"
        params.append(style)
    if audience:
        sql += " AND sp.DoiTuong = %s"
        params.append(audience)
    if search_query:
        sql += " AND (sp.TenSanPham LIKE %s OR sp.MoTaChiTiet LIKE %s OR sp.ChatLieu LIKE %s)"
        like_str = f"%{search_query}%"
        params.extend([like_str, like_str, like_str])

    sql += " GROUP BY sp.MaSanPham"

    having_clauses = []
    if min_price is not None:
        having_clauses.append("COALESCE(MIN(bt.GiaBan), sp.GiaCoSo, 0) >= %s")
        params.append(min_price)
    if max_price is not None:
        having_clauses.append("COALESCE(MIN(bt.GiaBan), sp.GiaCoSo, 0) <= %s")
        params.append(max_price)
    if having_clauses:
        sql += " HAVING " + " AND ".join(having_clauses)

    if sort_by == 'price_asc':
        sql += " ORDER BY GiaMin ASC"
    elif sort_by == 'price_desc':
        sql += " ORDER BY GiaMin DESC"
    elif sort_by == 'bestseller':
        sql += " ORDER BY sp.LaNoiBat DESC, sp.NgayTao DESC"
    else:
        sql += " ORDER BY sp.NgayTao DESC"

    products_list = query_all(sql, params)

    categories_with_count = query_all("""
        SELECT dm.*, COUNT(sp.MaSanPham) AS SoLuongSP
        FROM DanhMuc dm
        LEFT JOIN SanPham sp ON dm.MaDanhMuc = sp.MaDanhMuc AND sp.TrangThai = 'DangBan'
        GROUP BY dm.MaDanhMuc
        ORDER BY dm.MaDanhMuc ASC
    """)

    materials = query_all("SELECT DISTINCT ChatLieu FROM SanPham WHERE ChatLieu IS NOT NULL AND ChatLieu != ''")
    styles = query_all("SELECT DISTINCT PhongCach FROM SanPham WHERE PhongCach IS NOT NULL AND PhongCach != ''")
    audiences = query_all("SELECT DISTINCT DoiTuong FROM SanPham WHERE DoiTuong IS NOT NULL AND DoiTuong != ''")

    selected_category = None
    if cat_slug:
        selected_category = query_one("SELECT * FROM DanhMuc WHERE Slug = %s", (cat_slug,))

    return render_template('products.html', 
                           products=products_list, 
                           categories=categories_with_count,
                           materials=materials, 
                           styles=styles, 
                           audiences=audiences,
                           selected_category=selected_category,
                           current_filters={
                               'category': cat_slug,
                               'material': material,
                               'style': style,
                               'audience': audience,
                               'min_price': min_price,
                               'max_price': max_price,
                               'q': search_query,
                               'sort': sort_by
                           })

@app.route('/product/<slug>')
def product_detail(slug):
    """Trang chi tiết sản phẩm: Thư viện ảnh, chọn biến thể size/đá, đánh giá, sp liên quan."""
    product = query_one("""
        SELECT sp.*, dm.TenDanhMuc, dm.Slug AS CatSlug,
               (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
        FROM SanPham sp
        JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
        WHERE sp.Slug = %s
    """, (slug,))
    
    if not product:
        abort(404)

    # Danh sách biến thể
    variants = query_all("""
        SELECT * FROM BienTheSanPham 
        WHERE MaSanPham = %s 
        ORDER BY GiaBan ASC
    """, (product['MaSanPham'],))

    # Gallery hình ảnh
    gallery = query_all("""
        SELECT * FROM HinhAnhSanPham 
        WHERE MaSanPham = %s 
        ORDER BY ThuTuHienThi ASC
    """, (product['MaSanPham'],))

    reviews = []
    avg_rating = 5.0

    # Sản phẩm liên quan cùng danh mục
    related_products = query_all("""
        SELECT sp.*, MIN(bt.GiaBan) as GiaMin,
               (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
        FROM SanPham sp
        LEFT JOIN BienTheSanPham bt ON sp.MaSanPham = bt.MaSanPham
        WHERE sp.MaDanhMuc = %s AND sp.MaSanPham != %s AND sp.TrangThai = 'DangBan'
        GROUP BY sp.MaSanPham
        LIMIT 4
    """, (product['MaDanhMuc'], product['MaSanPham']))

    # Kiểm tra xem sản phẩm đã có trong wishlist chưa
    is_in_wishlist = False
    if 'user_id' in session:
        fav = query_one("SELECT MaYeuThich FROM SanPhamYeuThich WHERE MaNguoiDung = %s AND MaSanPham = %s",
                        (session['user_id'], product['MaSanPham']))
        if fav:
            is_in_wishlist = True

    return render_template('product_detail.html',
                           product=product,
                           variants=variants,
                           gallery=gallery,
                           reviews=reviews,
                           avg_rating=avg_rating,
                           related_products=related_products,
                           is_in_wishlist=is_in_wishlist)

# ----------------- CART & CHECKOUT -----------------

@app.route('/cart')
def cart():
    """Xem giỏ hàng, cập nhật số lượng và tính voucher."""
    cart_items = session.get('cart', {})
    
    # Tính toán chi tiết từng món hàng
    items_detail = []
    subtotal = Decimal('0')

    for variant_id_str, item_info in list(cart_items.items()):
        variant_id = int(variant_id_str)
        variant = query_one("""
            SELECT bt.*, sp.TenSanPham, sp.Slug, sp.ChatLieu,
                   (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
            FROM BienTheSanPham bt
            JOIN SanPham sp ON bt.MaSanPham = sp.MaSanPham
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
            'slug': variant['Slug'],
            'sku': variant['SKU'],
            'size': variant['KichThuocSize'],
            'gemstone': variant['LoaiDa'],
            'price': variant['GiaBan'],
            'image': variant['HinhAnhBienThe'] or variant['HinhAnhChinh'],
            'quantity': qty,
            'stock': variant['SoLuongTonKho'],
            'line_total': line_total
        })

    # Tính phí vận chuyển (Free ship cho đơn trên 5,000,000 VND)
    shipping_fee = Decimal('0') if (subtotal >= 5000000 or subtotal == 0) else Decimal('30000')

    # Kiểm tra voucher
    discount_amount = Decimal('0')
    voucher_code = session.get('voucher_code')
    applied_voucher = None

    if voucher_code and subtotal > 0:
        applied_voucher = query_one("""
            SELECT * FROM MaGiamGia 
            WHERE MaCode = %s AND TrangThai = 1 AND NgayKetThuc > NOW() AND SoLuongSuDung > SoLuongDaDung
        """, (voucher_code,))

        if applied_voucher:
            min_order = Decimal(str(applied_voucher['DonHangToiThieu']))
            if subtotal >= min_order:
                if applied_voucher['LoaiGiamGia'] == 'PERCENT':
                    discount = (subtotal * Decimal(str(applied_voucher['GiaTriGiam']))) / Decimal('100')
                    if applied_voucher['GiaTriGiamToiDa']:
                        max_discount = Decimal(str(applied_voucher['GiaTriGiamToiDa']))
                        discount = min(discount, max_discount)
                    discount_amount = discount
                else:
                    discount_amount = Decimal(str(applied_voucher['GiaTriGiam']))
            else:
                flash(f"Mã {voucher_code} yêu cầu đơn hàng tối thiểu {min_order:,.0f} ₫", "warning")
                session.pop('voucher_code', None)
                applied_voucher = None
        else:
            session.pop('voucher_code', None)

    grand_total = max(Decimal('0'), subtotal + shipping_fee - discount_amount)

    return render_template('cart.html',
                           items=items_detail,
                           subtotal=subtotal,
                           shipping_fee=shipping_fee,
                           discount_amount=discount_amount,
                           grand_total=grand_total,
                           applied_voucher=applied_voucher)

@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    """Thêm sản phẩm biến thể vào giỏ hàng (hỗ trợ cả Form và AJAX)."""
    variant_id = request.form.get('variant_id', type=int)
    quantity = request.form.get('quantity', 1, type=int)

    if not variant_id:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.is_json:
            return jsonify({'success': False, 'message': 'Không tìm thấy biến thể sản phẩm.'}), 400
        flash('Vui lòng chọn biến thể hợp lệ.', 'danger')
        return redirect(request.referrer or url_for('products'))

    variant = query_one("SELECT * FROM BienTheSanPham WHERE MaBienThe = %s", (variant_id,))
    if not variant:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.is_json:
            return jsonify({'success': False, 'message': 'Sản phẩm không tồn tại.'}), 404
        flash('Sản phẩm không tồn tại.', 'danger')
        return redirect(request.referrer or url_for('products'))

    cart = session.get('cart', {})
    key = str(variant_id)
    current_qty = cart.get(key, {}).get('quantity', 0)
    new_qty = current_qty + quantity

    if new_qty > variant['SoLuongTonKho']:
        msg = f"Kho chỉ còn {variant['SoLuongTonKho']} sản phẩm."
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.is_json:
            return jsonify({'success': False, 'message': msg}), 400
        flash(msg, 'warning')
        return redirect(request.referrer or url_for('cart'))

    cart[key] = {'quantity': new_qty}
    session['cart'] = cart
    session.modified = True

    # Đồng bộ DB nếu đã đăng nhập
    if 'user_id' in session:
        sync_cart_to_db(session['user_id'], cart)

    total_count = sum(item['quantity'] for item in cart.values())

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.is_json:
        return jsonify({
            'success': True, 
            'message': 'Đã thêm trang sức vào giỏ hàng!',
            'cart_count': total_count
        })

    flash('Đã thêm sản phẩm vào giỏ hàng!', 'success')
    if request.form.get('buy_now') == '1':
        return redirect(url_for('checkout'))
    return redirect(url_for('cart'))

@app.route('/cart/update', methods=['POST'])
def update_cart():
    """Cập nhật số lượng hoặc xóa sản phẩm trong giỏ."""
    variant_id = request.form.get('variant_id', type=int)
    quantity = request.form.get('quantity', type=int)

    cart = session.get('cart', {})
    key = str(variant_id)

    if key in cart:
        if quantity and quantity > 0:
            variant = query_one("SELECT SoLuongTonKho FROM BienTheSanPham WHERE MaBienThe = %s", (variant_id,))
            if variant and quantity <= variant['SoLuongTonKho']:
                cart[key]['quantity'] = quantity
                flash('Đã cập nhật số lượng giỏ hàng.', 'info')
            else:
                flash('Số lượng vượt quá tồn kho khả dụng.', 'warning')
        else:
            del cart[key]
            flash('Đã xóa sản phẩm khỏi giỏ hàng.', 'info')

    session['cart'] = cart
    session.modified = True

    if 'user_id' in session:
        sync_cart_to_db(session['user_id'], cart)

    return redirect(url_for('cart'))

@app.route('/cart/remove', methods=['POST'])
def remove_from_cart():
    variant_id = request.form.get('variant_id', type=int)
    cart = session.get('cart', {})
    key = str(variant_id)
    if key in cart:
        del cart[key]
        session['cart'] = cart
        session.modified = True
        flash('Đã gỡ sản phẩm khỏi giỏ hàng.', 'info')
        if 'user_id' in session:
            sync_cart_to_db(session['user_id'], cart)

    return redirect(url_for('cart'))

@app.route('/cart/apply-voucher', methods=['POST'])
def apply_voucher():
    code = request.form.get('voucher_code', '').strip().upper()
    if not code:
        session.pop('voucher_code', None)
        flash('Vui lòng nhập mã giảm giá.', 'warning')
        return redirect(url_for('cart'))

    voucher = query_one("""
        SELECT * FROM MaGiamGia 
        WHERE MaCode = %s AND TrangThai = 1 AND NgayKetThuc > NOW() AND SoLuongSuDung > SoLuongDaDung
    """, (code,))

    if voucher:
        session['voucher_code'] = code
        flash(f"Áp dụng mã ưu đãi '{code}' thành công!", 'success')
    else:
        flash(f"Mã giảm giá '{code}' không hợp lệ hoặc đã hết hạn.", 'danger')

    return redirect(url_for('cart'))

def sync_cart_to_db(user_id, cart_dict):
    """Lưu giỏ hàng vào bảng GioHang và ChiTietGioHang."""
    try:
        with get_db() as (cursor, conn):
            cursor.execute("SELECT MaGioHang FROM GioHang WHERE MaNguoiDung = %s", (user_id,))
            gh = cursor.fetchone()
            if not gh:
                cursor.execute("INSERT INTO GioHang (MaNguoiDung) VALUES (%s)", (user_id,))
                gio_hang_id = cursor.lastrowid
            else:
                gio_hang_id = gh['MaGioHang']

            cursor.execute("DELETE FROM ChiTietGioHang WHERE MaGioHang = %s", (gio_hang_id,))
            for var_id_str, item in cart_dict.items():
                cursor.execute("""
                    INSERT INTO ChiTietGioHang (MaGioHang, MaBienThe, SoLuong)
                    VALUES (%s, %s, %s)
                """, (gio_hang_id, int(var_id_str), item['quantity']))
    except Exception as e:
        print(f"Error syncing cart: {e}")

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
    """Trang thanh toán đặt đơn hàng."""
    cart_items = session.get('cart', {})
    if not cart_items:
        flash('Giỏ hàng của bạn đang trống.', 'warning')
        return redirect(url_for('products'))

    # Chuẩn bị dữ liệu giỏ hàng
    items_detail = []
    subtotal = Decimal('0')

    for variant_id_str, item_info in cart_items.items():
        variant_id = int(variant_id_str)
        variant = query_one("""
            SELECT bt.*, sp.TenSanPham, sp.Slug,
                   (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
            FROM BienTheSanPham bt
            JOIN SanPham sp ON bt.MaSanPham = sp.MaSanPham
            WHERE bt.MaBienThe = %s
        """, (variant_id,))
        if variant:
            qty = item_info.get('quantity', 1)
            line_total = Decimal(str(variant['GiaBan'])) * qty
            subtotal += line_total
            items_detail.append({
                'variant_id': variant['MaBienThe'],
                'product_name': variant['TenSanPham'],
                'size': variant['KichThuocSize'],
                'gemstone': variant['LoaiDa'],
                'price': variant['GiaBan'],
                'quantity': qty,
                'stock': variant['SoLuongTonKho'],
                'line_total': line_total,
                'image': variant['HinhAnhBienThe'] or variant['HinhAnhChinh']
            })

    shipping_fee = Decimal('0') if subtotal >= 5000000 else Decimal('30000')

    # Tính voucher
    discount_amount = Decimal('0')
    voucher_id = None
    voucher_code = session.get('voucher_code')
    if voucher_code:
        v = query_one("""
            SELECT * FROM MaGiamGia 
            WHERE MaCode = %s AND TrangThai = 1 AND NgayKetThuc > NOW() AND SoLuongSuDung > SoLuongDaDung
        """, (voucher_code,))
        if v and subtotal >= Decimal(str(v['DonHangToiThieu'])):
            voucher_id = v['MaVoucher']
            if v['LoaiGiamGia'] == 'PERCENT':
                discount = (subtotal * Decimal(str(v['GiaTriGiam']))) / Decimal('100')
                if v['GiaTriGiamToiDa']:
                    discount = min(discount, Decimal(str(v['GiaTriGiamToiDa'])))
                discount_amount = discount
            else:
                discount_amount = Decimal(str(v['GiaTriGiam']))

    grand_total = max(Decimal('0'), subtotal + shipping_fee - discount_amount)

    # Nếu submit đơn hàng
    if request.method == 'POST':
        fullname = request.form.get('fullname', '').strip()
        phone = request.form.get('phone', '').strip()
        city = request.form.get('city', '').strip()
        district = request.form.get('district', '').strip()
        ward = request.form.get('ward', '').strip()
        address = request.form.get('address', '').strip()
        note = request.form.get('note', '').strip()
        payment_method = request.form.get('payment_method', 'COD')

        if not fullname or not phone or not address:
            flash('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.', 'danger')
            return redirect(url_for('checkout'))

        full_shipping_address = f"{address}, {ward}, {district}, {city}".strip(', ')

        # Xác định user ID (nếu chưa login, gán vào khách vãng lai hoặc tạo tạm)
        user_id = session.get('user_id')
        if not user_id:
            # Tìm xem có user guest chưa hoặc dùng tài khoản khách hàng mặc định
            guest = query_one("SELECT MaNguoiDung FROM NguoiDung WHERE Email = %s", ('guest@aurajewelry.vn',))
            if guest:
                user_id = guest['MaNguoiDung']
            else:
                _, user_id = execute("""
                    INSERT INTO NguoiDung (MaVaiTro, TenDangNhap, MatKhauMaHoa, HoTen, Email, SoDienThoai)
                    VALUES (3, %s, %s, %s, %s, %s)
                """, (f"guest_{random.randint(10000, 99999)}", generate_password_hash('123456'), fullname, f"guest_{datetime.datetime.now().timestamp()}@aurajewelry.vn", phone))

        # Tạo mã đơn hàng duy nhất: VD AURA20261017-XXXX
        order_code = f"AURA{datetime.datetime.now().strftime('%Y%m%d%H%M')}-{random.randint(100, 999)}"

        try:
            with get_db() as (cursor, conn):
                # 1. Thêm vào DonHang
                cursor.execute("""
                    INSERT INTO DonHang (
                        MaDonHangCode, MaNguoiDung, MaVoucher, TenNguoiNhan, SoDienThoaiNguoiNhan,
                        DiaChiGiaoHang, GhiChu, TongTienHang, PhiVanChuyen, SoTienGiam, TongThanhToan,
                        TrangThaiDonHang, PhuongThucThanhToan, TrangThaiThanhToan
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'ChoXacNhan', %s, 'ChuaThanhToan')
                """, (
                    order_code, user_id, voucher_id, fullname, phone,
                    full_shipping_address, note, subtotal, shipping_fee, discount_amount, grand_total,
                    payment_method
                ))
                order_id = cursor.lastrowid

                # 2. Thêm ChiTietDonHang & Trừ tồn kho
                for it in items_detail:
                    cursor.execute("""
                        INSERT INTO ChiTietDonHang (MaDonHang, MaBienThe, TenSanPhamSnap, KichThuocSnap, SoLuong, DonGia)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        order_id, it['variant_id'], it['product_name'], it['size'], it['quantity'], it['price']
                    ))

                    # Trừ tồn kho
                    cursor.execute("""
                        UPDATE BienTheSanPham 
                        SET SoLuongTonKho = GREATEST(0, SoLuongTonKho - %s)
                        WHERE MaBienThe = %s
                    """, (it['quantity'], it['variant_id']))

                # 3. Tăng lượt dùng voucher
                if voucher_id:
                    cursor.execute("""
                        UPDATE MaGiamGia SET SoLuongDaDung = SoLuongDaDung + 1 WHERE MaVoucher = %s
                    """, (voucher_id,))

            # Dọn giỏ hàng
            session.pop('cart', None)
            session.pop('voucher_code', None)
            session.modified = True

            flash('Đặt hàng thành công! Cảm ơn bạn đã lựa chọn AURA Jewelry.', 'success')
            return redirect(url_for('order_success', order_code=order_code))

        except Exception as e:
            flash(f"Lỗi khi đặt hàng: {str(e)}", 'danger')
            return redirect(url_for('checkout'))

    # Load địa chỉ mặc định của user nếu đã login
    saved_address = None
    if 'user_id' in session:
        saved_address = query_one("""
            SELECT * FROM DiaChiNguoiDung 
            WHERE MaNguoiDung = %s 
            ORDER BY LaMacDinh DESC LIMIT 1
        """, (session['user_id'],))

    return render_template('checkout.html',
                           items=items_detail,
                           subtotal=subtotal,
                           shipping_fee=shipping_fee,
                           discount_amount=discount_amount,
                           grand_total=grand_total,
                           saved_address=saved_address)

@app.route('/order-success/<order_code>')
def order_success(order_code):
    """Trang thông báo đặt hàng thành công và hiển thị mã QR VietQR (nếu chuyển khoản)."""
    order = query_one("SELECT * FROM DonHang WHERE MaDonHangCode = %s", (order_code,))
    if not order:
        abort(404)

    items = query_all("SELECT * FROM ChiTietDonHang WHERE MaDonHang = %s", (order['MaDonHang'],))

    # Sinh link VietQR động
    vietqr_url = f"https://img.vietqr.io/image/MB-0901234567-compact2.png?amount={int(order['TongThanhToan'])}&addInfo={order['MaDonHangCode']}&accountName=AURA%20JEWELRY"

    return render_template('order_success.html', order=order, items=items, vietqr_url=vietqr_url)

@app.route('/tracking', methods=['GET', 'POST'])
def order_tracking():
    """Tra cứu tình trạng đơn hàng bằng Mã đơn hàng hoặc Số điện thoại."""
    order = None
    items = []
    timeline = []
    search_val = request.values.get('search_query', '').strip()

    if search_val:
        order = query_one("""
            SELECT * FROM DonHang 
            WHERE MaDonHangCode = %s OR SoDienThoaiNguoiNhan = %s
            ORDER BY NgayDatHang DESC LIMIT 1
        """, (search_val, search_val))

        if order:
            items = query_all("SELECT * FROM ChiTietDonHang WHERE MaDonHang = %s", (order['MaDonHang'],))
            timeline = []
        else:
            flash(f"Không tìm thấy đơn hàng nào khớp với '{search_val}'.", 'warning')

    return render_template('order_tracking.html', order=order, items=items, timeline=timeline, search_val=search_val)

# ----------------- WISHLIST -----------------

@app.route('/wishlist')
@login_required
def wishlist():
    """Xem danh sách sản phẩm yêu thích."""
    items = query_all("""
        SELECT yt.MaYeuThich, sp.*, dm.TenDanhMuc, MIN(bt.GiaBan) as GiaMin,
               (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
        FROM SanPhamYeuThich yt
        JOIN SanPham sp ON yt.MaSanPham = sp.MaSanPham
        JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
        LEFT JOIN BienTheSanPham bt ON sp.MaSanPham = bt.MaSanPham
        WHERE yt.MaNguoiDung = %s
        GROUP BY sp.MaSanPham
        ORDER BY yt.NgayThem DESC
    """, (session['user_id'],))
    return render_template('wishlist.html', items=items)

@app.route('/wishlist/toggle', methods=['POST'])
def toggle_wishlist():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Vui lòng đăng nhập để lưu sản phẩm yêu thích.', 'require_login': True}), 401

    product_id = request.form.get('product_id', type=int)
    if not product_id:
        return jsonify({'success': False, 'message': 'Mã sản phẩm không hợp lệ.'}), 400

    existing = query_one("SELECT MaYeuThich FROM SanPhamYeuThich WHERE MaNguoiDung = %s AND MaSanPham = %s",
                         (session['user_id'], product_id))

    if existing:
        execute("DELETE FROM SanPhamYeuThich WHERE MaYeuThich = %s", (existing['MaYeuThich'],))
        return jsonify({'success': True, 'added': False, 'message': 'Đã bỏ khỏi danh sách yêu thích.'})
    else:
        execute("INSERT INTO SanPhamYeuThich (MaNguoiDung, MaSanPham) VALUES (%s, %s)",
                (session['user_id'], product_id))
        return jsonify({'success': True, 'added': True, 'message': 'Đã thêm vào danh sách yêu thích!'})

# ----------------- AI JEWELRY CONSULTANT -----------------

@app.route('/ai-consultant')
def ai_consultant():
    """Trang trợ lý AI tư vấn chọn trang sức, size nhẫn, phong cách."""
    return render_template('ai_consultant.html')

@app.route('/api/ai-consultant', methods=['POST'])
def ai_consultant_api():
    """Xử lý tư vấn AI thông minh bằng mô hình DeepSeek và lưu log vào LichSuTuvaiAI."""
    data = request.get_json() or {}
    user_msg = data.get('message', '').strip()
    style = data.get('style', '')
    budget = data.get('budget', '')
    occasion = data.get('occasion', '')
    finger_size = data.get('finger_size', '')

    user_id = session.get('user_id', None)

    if not user_msg:
        return jsonify({'success': False, 'message': 'Vui lòng nhập câu hỏi.'}), 400

    context_dict = {
        'style': style,
        'budget': budget,
        'occasion': occasion,
        'finger_size': finger_size
    }

    # Gọi mô hình DeepSeek AI
    result = generate_deepseek_consultation(user_msg, context_dict)
    reply = result.get('reply', '')
    suggested_products = result.get('products', [])

    # Lưu vào DB bảng LichSuTuvaiAI
    context_json = json.dumps(context_dict, ensure_ascii=False)
    try:
        execute("""
            INSERT INTO LichSuTuvaiAI (MaNguoiDung, CauHoiNguoiDung, PhanHoiAI, ContextNguoiDung)
            VALUES (%s, %s, %s, %s)
        """, (user_id, user_msg, reply, context_json))
    except Exception as e:
        print(f"Error logging AI chat: {e}")

    # Format JSON response
    return jsonify({
        'success': True,
        'reply': reply,
        'products': suggested_products,
        'model': result.get('model', 'DeepSeek-V3'),
        'engine': result.get('engine', 'Logistic Regression (ML Classifier)'),
        'intent': result.get('intent', ''),
        'intent_name': result.get('intent_name', ''),
        'confidence': result.get('confidence', 0),
        'is_live_ai': result.get('is_live_ai', False)
    })

# ----------------- REVIEWS -----------------

@app.route('/product/<int:product_id>/review', methods=['POST'])
@login_required
def add_review(product_id):
    flash('Cảm ơn quý khách đã gửi đánh giá quý báu cho LUNA BELLE!', 'success')
    return redirect(request.referrer or url_for('index'))

# ----------------- AUTHENTICATION -----------------

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        user = query_one("""
            SELECT nd.*, vt.TenVaiTro 
            FROM NguoiDung nd
            JOIN VaiTro vt ON nd.MaVaiTro = vt.MaVaiTro
            WHERE nd.TenDangNhap = %s OR nd.Email = %s
        """, (username, username))

        if user and check_password_hash(user['MatKhauMaHoa'], password):
            if not user.get('KichHoat', 1):
                flash('Tài khoản đã bị tạm khóa.', 'danger')
                return render_template('login.html')

            session['user_id'] = user['MaNguoiDung']
            session['username'] = user['TenDangNhap']
            session['role'] = user['TenVaiTro']
            session['fullname'] = user['HoTen']

            flash(f"Chào mừng trở lại, {user['HoTen']}!", 'success')
            next_url = request.args.get('next')
            if user['TenVaiTro'] in ['ADMIN', 'STAFF']:
                return redirect(next_url or url_for('admin_dashboard'))
            return redirect(next_url or url_for('index'))
        else:
            flash('Tên đăng nhập hoặc mật khẩu không chính xác.', 'danger')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('index'))

    if request.method == 'POST':
        fullname = request.form.get('fullname', '').strip()
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        password = request.form.get('password', '').strip()
        confirm_password = request.form.get('confirm_password', '').strip()
        finger_size = request.form.get('finger_size', '')
        style = request.form.get('style', '')

        if not fullname or not username or not email or not password:
            flash('Vui lòng điền đầy đủ các thông tin bắt buộc.', 'warning')
            return render_template('register.html')

        if password != confirm_password:
            flash('Mật khẩu nhập lại không khớp.', 'danger')
            return render_template('register.html')

        # Kiểm tra trùng tên hoặc email
        exist = query_one("SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = %s OR Email = %s", (username, email))
        if exist:
            flash('Tên đăng nhập hoặc email đã được sử dụng.', 'danger')
            return render_template('register.html')

        pwd_hash = generate_password_hash(password)
        _, user_id = execute("""
            INSERT INTO NguoiDung (MaVaiTro, TenDangNhap, MatKhauMaHoa, HoTen, Email, SoDienThoai)
            VALUES (3, %s, %s, %s, %s, %s)
        """, (username, pwd_hash, fullname, email, phone))

        session['user_id'] = user_id
        session['username'] = username
        session['role'] = 'CUSTOMER'
        session['fullname'] = fullname

        flash('Đăng ký tài khoản thành công! Khám phá ngay các ưu đãi đặc quyền.', 'success')
        return redirect(url_for('index'))

    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Bạn đã đăng xuất tài khoản.', 'info')
    return redirect(url_for('index'))

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    user = query_one("SELECT * FROM NguoiDung WHERE MaNguoiDung = %s", (session['user_id'],))
    
    if request.method == 'POST':
        fullname = request.form.get('fullname', '').strip()
        phone = request.form.get('phone', '').strip()
        finger_size = request.form.get('finger_size', '')
        style = request.form.get('style', '')
        new_pass = request.form.get('new_password', '').strip()

        if new_pass:
            pwd_hash = generate_password_hash(new_pass)
            execute("""
                UPDATE NguoiDung 
                SET HoTen = %s, SoDienThoai = %s, MatKhauMaHoa = %s
                WHERE MaNguoiDung = %s
            """, (fullname, phone, pwd_hash, session['user_id']))
        else:
            execute("""
                UPDATE NguoiDung 
                SET HoTen = %s, SoDienThoai = %s
                WHERE MaNguoiDung = %s
            """, (fullname, phone, session['user_id']))

        flash('Cập nhật thông tin cá nhân thành công!', 'success')
        return redirect(url_for('profile'))

    # Danh sách đơn hàng đã mua
    orders = query_all("""
        SELECT * FROM DonHang 
        WHERE MaNguoiDung = %s 
        ORDER BY NgayDatHang DESC
    """, (session['user_id'],))

    # Sổ địa chỉ
    addresses = query_all("SELECT * FROM DiaChiNguoiDung WHERE MaNguoiDung = %s", (session['user_id'],))

    return render_template('profile.html', user=user, orders=orders, addresses=addresses)

# ----------------- ADMIN DASHBOARD & MANAGEMENT -----------------

@app.route('/admin')
@admin_required
def admin_redirect():
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    stats = {}
    rev = query_one("SELECT SUM(TongThanhToan) AS total_revenue FROM DonHang WHERE TrangThaiDonHang != 'DaHuy'")
    stats['revenue'] = rev['total_revenue'] or Decimal('0')

    ord_cnt = query_one("SELECT COUNT(*) AS total_orders FROM DonHang")
    stats['orders_count'] = ord_cnt['total_orders'] or 0

    prod_cnt = query_one("SELECT COUNT(*) AS total_products FROM SanPham")
    stats['products_count'] = prod_cnt['total_products'] or 0

    user_cnt = query_one("SELECT COUNT(*) AS total_users FROM NguoiDung WHERE MaVaiTro = 3")
    stats['users_count'] = user_cnt['total_users'] or 0

    recent_orders = query_all("""
        SELECT dh.*, nd.HoTen AS TenKhachHang 
        FROM DonHang dh
        LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
        ORDER BY dh.NgayDatHang DESC LIMIT 6
    """)

    return render_template('admin/dashboard.html', stats=stats, recent_orders=recent_orders)

@app.route('/admin/products')
@admin_required
def admin_products():
    products = query_all("""
        SELECT sp.*, dm.TenDanhMuc, COUNT(bt.MaBienThe) AS SoBienThe, SUM(bt.SoLuongTonKho) AS TongTonKho,
               (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
        FROM SanPham sp
        JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
        LEFT JOIN BienTheSanPham bt ON sp.MaSanPham = bt.MaSanPham
        GROUP BY sp.MaSanPham
        ORDER BY sp.NgayTao DESC
    """)
    return render_template('admin/products.html', products=products)

@app.route('/admin/product/new', methods=['GET', 'POST'])
@admin_required
def admin_product_new():
    categories = query_all("SELECT * FROM DanhMuc ORDER BY TenDanhMuc ASC")
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        slug = request.form.get('slug', '').strip() or name.lower().replace(' ', '-')
        cat_id = request.form.get('category_id', type=int)
        material = request.form.get('material', '').strip()
        style = request.form.get('style', '').strip()
        audience = request.form.get('audience', '').strip()
        price = request.form.get('price', type=float)
        desc = request.form.get('description', '').strip()
        img = request.form.get('image', '').strip()
        is_featured = 1 if request.form.get('is_featured') else 0

        # Tạo sản phẩm (theo đúng schema SanPham)
        _, product_id = execute("""
            INSERT INTO SanPham (TenSanPham, Slug, MaDanhMuc, ChatLieu, PhongCach, DoiTuong, GiaCoSo, MoTaChiTiet, LaNoiBat, TrangThai)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'DangBan')
        """, (name, slug, cat_id, material, style, audience, price, desc, is_featured))

        # Lưu ảnh chính vào HinhAnhSanPham
        if img:
            execute("""
                INSERT INTO HinhAnhSanPham (MaSanPham, DuongDanAnh, ThuTuHienThi)
                VALUES (%s, %s, 1)
            """, (product_id, img))

        # Lưu danh sách biến thể từ form
        var_sizes = request.form.getlist('variant_size[]')
        var_stones = request.form.getlist('variant_stone[]')
        var_prices = request.form.getlist('variant_price[]')
        var_stocks = request.form.getlist('variant_stock[]')
        var_skus = request.form.getlist('variant_sku[]')
        var_images = request.form.getlist('variant_image[]')

        if var_sizes and len(var_sizes) > 0:
            for i in range(len(var_sizes)):
                size = var_sizes[i].strip() or 'Tiêu Chuẩn'
                stone = var_stones[i].strip() if i < len(var_stones) and var_stones[i] else 'Mặc định'
                v_price = float(var_prices[i]) if i < len(var_prices) and var_prices[i] else price
                v_stock = int(var_stocks[i]) if i < len(var_stocks) and var_stocks[i] else 10
                v_sku = var_skus[i].strip() if i < len(var_skus) and var_skus[i] else f"SKU-{product_id}-{i+1}-{random.randint(100, 999)}"
                v_img = var_images[i].strip() if i < len(var_images) and var_images[i] else img

                execute("""
                    INSERT INTO BienTheSanPham (MaSanPham, SKU, KichThuocSize, LoaiDa, GiaBan, SoLuongTonKho, HinhAnhBienThe)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (product_id, v_sku, size, stone, v_price, v_stock, v_img))
        else:
            sku = f"SKU-{product_id}-{random.randint(100, 999)}"
            execute("""
                INSERT INTO BienTheSanPham (MaSanPham, SKU, KichThuocSize, LoaiDa, GiaBan, SoLuongTonKho, HinhAnhBienThe)
                VALUES (%s, %s, 'Tiêu Chuẩn', 'Mặc định', %s, 10, %s)
            """, (product_id, sku, price, img))

        flash('Thêm mới sản phẩm trang sức và các biến thể thành công!', 'success')
        return redirect(url_for('admin_products'))

    return render_template('admin/product_form.html', product=None, categories=categories, variants=[])

@app.route('/admin/product/edit/<int:id>', methods=['GET', 'POST'])
@admin_required
def admin_product_edit(id):
    product = query_one("""
        SELECT sp.*, 
               (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
        FROM SanPham sp 
        WHERE sp.MaSanPham = %s
    """, (id,))
    if not product:
        abort(404)
    categories = query_all("SELECT * FROM DanhMuc ORDER BY TenDanhMuc ASC")
    variants = query_all("SELECT * FROM BienTheSanPham WHERE MaSanPham = %s", (id,))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        slug = request.form.get('slug', '').strip()
        cat_id = request.form.get('category_id', type=int)
        material = request.form.get('material', '').strip()
        style = request.form.get('style', '').strip()
        audience = request.form.get('audience', '').strip()
        price = request.form.get('price', type=float)
        desc = request.form.get('description', '').strip()
        img = request.form.get('image', '').strip()
        status = request.form.get('status', 'DangBan')
        is_featured = 1 if request.form.get('is_featured') else 0

        # Cập nhật SanPham chuẩn theo schema
        execute("""
            UPDATE SanPham 
            SET TenSanPham = %s, Slug = %s, MaDanhMuc = %s, ChatLieu = %s, PhongCach = %s,
                DoiTuong = %s, GiaCoSo = %s, MoTaChiTiet = %s,
                LaNoiBat = %s, TrangThai = %s
            WHERE MaSanPham = %s
        """, (name, slug, cat_id, material, style, audience, price, desc, is_featured, status, id))

        # Cập nhật hoặc thêm ảnh đại diện trong HinhAnhSanPham
        if img:
            has_img = query_one("SELECT MaHinhAnh FROM HinhAnhSanPham WHERE MaSanPham = %s ORDER BY ThuTuHienThi ASC LIMIT 1", (id,))
            if has_img:
                execute("UPDATE HinhAnhSanPham SET DuongDanAnh = %s WHERE MaHinhAnh = %s", (img, has_img['MaHinhAnh']))
            else:
                execute("INSERT INTO HinhAnhSanPham (MaSanPham, DuongDanAnh, ThuTuHienThi) VALUES (%s, %s, 1)", (id, img))

        # Cập nhật danh sách biến thể
        var_sizes = request.form.getlist('variant_size[]')
        var_stones = request.form.getlist('variant_stone[]')
        var_prices = request.form.getlist('variant_price[]')
        var_stocks = request.form.getlist('variant_stock[]')
        var_skus = request.form.getlist('variant_sku[]')
        var_images = request.form.getlist('variant_image[]')

        if var_sizes and len(var_sizes) > 0:
            execute("DELETE FROM BienTheSanPham WHERE MaSanPham = %s", (id,))
            for i in range(len(var_sizes)):
                size = var_sizes[i].strip() or 'Tiêu Chuẩn'
                stone = var_stones[i].strip() if i < len(var_stones) and var_stones[i] else 'Mặc định'
                v_price = float(var_prices[i]) if i < len(var_prices) and var_prices[i] else price
                v_stock = int(var_stocks[i]) if i < len(var_stocks) and var_stocks[i] else 10
                v_sku = var_skus[i].strip() if i < len(var_skus) and var_skus[i] else f"SKU-{id}-{i+1}-{random.randint(100, 999)}"
                v_img = var_images[i].strip() if i < len(var_images) and var_images[i] else img

                execute("""
                    INSERT INTO BienTheSanPham (MaSanPham, SKU, KichThuocSize, LoaiDa, GiaBan, SoLuongTonKho, HinhAnhBienThe)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (id, v_sku, size, stone, v_price, v_stock, v_img))

        flash('Đã cập nhật sản phẩm và biến thể thành công!', 'success')
        return redirect(url_for('admin_products'))

    return render_template('admin/product_form.html', product=product, categories=categories, variants=variants)

@app.route('/admin/product/delete/<int:id>', methods=['POST'])
@admin_required
def admin_product_delete(id):
    execute("DELETE FROM SanPham WHERE MaSanPham = %s", (id,))
    flash('Đã xóa sản phẩm thành công.', 'info')
    return redirect(url_for('admin_products'))

@app.route('/admin/orders')
@admin_required
def admin_orders():
    status_filter = request.args.get('status')
    sql = """
        SELECT dh.*, nd.HoTen AS TenKhachHang, nd.Email 
        FROM DonHang dh
        LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
    """
    params = []
    if status_filter:
        sql += " WHERE dh.TrangThaiDonHang = %s"
        params.append(status_filter)
    sql += " ORDER BY dh.NgayDatHang DESC"

    orders = query_all(sql, params)
    return render_template('admin/orders.html', orders=orders, current_status=status_filter)

@app.route('/admin/order/<int:id>')
@admin_required
def admin_order_detail(id):
    order = query_one("""
        SELECT dh.*, nd.HoTen, nd.Email, nd.SoDienThoai AS PhoneUser
        FROM DonHang dh
        LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
        WHERE dh.MaDonHang = %s
    """, (id,))
    if not order:
        abort(404)

    # Lấy danh sách item kèm theo hình ảnh sản phẩm thực tế từ biến thể hoặc sản phẩm
    items = query_all("""
        SELECT ctdh.*, bt.SKU, bt.HinhAnhBienThe,
               COALESCE(bt.HinhAnhBienThe, (SELECT DuongDanAnh FROM HinhAnhSanPham ha WHERE ha.MaSanPham = bt.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1)) AS HinhAnh
        FROM ChiTietDonHang ctdh
        LEFT JOIN BienTheSanPham bt ON ctdh.MaBienThe = bt.MaBienThe
        WHERE ctdh.MaDonHang = %s
    """, (id,))

    return render_template('admin/order_detail.html', order=order, items=items)

@app.route('/admin/order/<int:id>/status', methods=['POST'])
@admin_required
def admin_order_update_status(id):
    new_order_status = request.form.get('order_status')
    new_payment_status = request.form.get('payment_status')
    note = request.form.get('note', '').strip()

    if note:
        execute("""
            UPDATE DonHang 
            SET TrangThaiDonHang = %s, TrangThaiThanhToan = %s, GhiChu = %s 
            WHERE MaDonHang = %s
        """, (new_order_status, new_payment_status, note, id))
    else:
        execute("""
            UPDATE DonHang 
            SET TrangThaiDonHang = %s, TrangThaiThanhToan = %s 
            WHERE MaDonHang = %s
        """, (new_order_status, new_payment_status, id))

    flash(f"Đã cập nhật trạng thái đơn hàng #{id}!", 'success')
    return redirect(url_for('admin_order_detail', id=id))

@app.route('/admin/vouchers', methods=['GET', 'POST'])
@admin_required
def admin_vouchers():
    if request.method == 'POST':
        code = request.form.get('code', '').strip().upper()
        discount_type = request.form.get('discount_type', 'PERCENT')
        val = request.form.get('value', type=float)
        max_val = request.form.get('max_value', type=float)
        min_order = request.form.get('min_order', 0, type=float)
        usage = request.form.get('usage_limit', 100, type=int)
        start = request.form.get('start_date')
        end = request.form.get('end_date')

        execute("""
            INSERT INTO MaGiamGia (MaCode, LoaiGiamGia, GiaTriGiam, GiaTriGiamToiDa, DonHangToiThieu, SoLuongSuDung, NgayBatDau, NgayKetThuc, TrangThai)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 1)
        """, (code, discount_type, val, max_val, min_order, usage, start, end))

        flash(f"Đã tạo thành công voucher '{code}'!", 'success')
        return redirect(url_for('admin_vouchers'))

    vouchers = query_all("SELECT * FROM MaGiamGia ORDER BY MaVoucher DESC")
    return render_template('admin/vouchers.html', vouchers=vouchers)

@app.route('/admin/ai-settings', methods=['GET', 'POST'])
@admin_required
def admin_ai_settings():
    if request.method == 'POST':
        api_key = request.form.get('api_key', '').strip()
        model = request.form.get('model', 'deepseek-chat').strip()
        base_url = request.form.get('base_url', 'https://api.deepseek.com').strip()
        save_deepseek_config(api_key, model, base_url)
        flash('Đã lưu cấu hình mô hình DeepSeek AI thành công!', 'success')
        return redirect(url_for('admin_ai_settings'))

    cfg = get_deepseek_config()
    return render_template('admin/ai_settings.html', config=cfg)

# ----------------- RUN SERVER -----------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
