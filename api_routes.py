import os
import time
import uuid
from decimal import Decimal
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from db import query_all, query_one, execute, get_db_connection

api_bp = Blueprint('api', __name__, url_prefix='/api')

def decimal_serializer(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    return obj

def clean_row(row):
    if not row:
        return row
    return {k: decimal_serializer(v) for k, v in row.items()}

def clean_rows(rows):
    return [clean_row(r) for r in rows]

# ----------------- UPLOAD IMAGE API -----------------
@api_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files and 'file' not in request.files:
        return jsonify({'success': False, 'message': 'Không tìm thấy file tải lên.'}), 400
    
    file = request.files.get('image') or request.files.get('file')
    if not file or not file.filename:
        return jsonify({'success': False, 'message': 'Tên file không hợp lệ.'}), 400

    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'jpg'
    safe_name = f"upload_{int(time.time())}_{uuid.uuid4().hex[:6]}.{ext}"
    upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'products')
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, safe_name)
    file.save(file_path)

    url = f"/static/uploads/products/{safe_name}"
    return jsonify({'success': True, 'url': url})

# ----------------- PRODUCTS CRUD -----------------
@api_bp.route('/products', methods=['GET'])
def get_products():
    try:
        sql = """
            SELECT sp.*, dm.TenDanhMuc, dm.Slug AS CatSlug
            FROM sanpham sp
            LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
            ORDER BY sp.NgayTao DESC, sp.MaSanPham DESC
        """
        raw_prods = query_all(sql)
        products = []

        for p in raw_prods:
            pid = p['MaSanPham']
            # Fetch variants
            variants_raw = query_all("SELECT * FROM bienthesanpham WHERE MaSanPham = %s", (pid,))
            variants = []
            min_price = float(p.get('GiaCoSo') or 0)
            max_price = min_price
            total_stock = 0

            if variants_raw:
                prices = [float(v['GiaBan'] or 0) for v in variants_raw]
                min_price = min(prices)
                max_price = max(prices)
                total_stock = sum(int(v.get('SoLuongTonKho') or 0) for v in variants_raw)
                for v in variants_raw:
                    variants.append({
                        'MaBienThe': v['MaBienThe'],
                        'TenBienThe': v.get('KichThuocSize') or f"Phiên bản {v['MaBienThe']}",
                        'GiaBan': float(v.get('GiaBan') or 0),
                        'SoLuongTonKho': int(v.get('SoLuongTonKho') or 0),
                        'SKU': v.get('SKU', ''),
                        'LoaiDa': v.get('LoaiDa', ''),
                        'HinhAnhBienThe': v.get('HinhAnhBienThe', '')
                    })

            # Fetch images
            images_raw = query_all("SELECT DuongDanAnh FROM hinhanhsanpham WHERE MaSanPham = %s ORDER BY ThuTuHienThi ASC", (pid,))
            gallery = [img['DuongDanAnh'] for img in images_raw if img.get('DuongDanAnh')]
            main_image = gallery[0] if gallery else 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'

            prod_dict = {
                'MaSanPham': pid,
                'TenSanPham': p['TenSanPham'],
                'Slug': p['Slug'] or f"sp-{pid}",
                'CatSlug': p['CatSlug'] or 'nhan-kim-cuong',
                'TenDanhMuc': p['TenDanhMuc'] or 'Trang Sức',
                'ChatLieu': p.get('ChatLieu') or 'Vàng 18K',
                'PhongCach': p.get('PhongCach') or 'Sang trọng',
                'DoiTuong': p.get('DoiTuong') or 'Nữ',
                'GiaCoSo': float(p.get('GiaCoSo') or min_price),
                'GiaMin': min_price,
                'GiaMax': max_price,
                'HinhAnhChinh': main_image,
                'gallery': gallery if gallery else [main_image],
                'LaNoiBat': 1 if p.get('LaNoiBat') else 0,
                'TongBan': 0,
                'TongTonKho': total_stock or 20,
                'MoTa': p.get('MoTaChiTiet') or '',
                'bienthe': variants
            }
            products.append(prod_dict)

        return jsonify({'success': True, 'data': products})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/products/<id_or_slug>', methods=['GET'])
def get_product(id_or_slug):
    try:
        is_id = str(id_or_slug).isdigit()
        if is_id:
            p = query_one("""
                SELECT sp.*, dm.TenDanhMuc, dm.Slug AS CatSlug
                FROM sanpham sp
                LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
                WHERE sp.MaSanPham = %s
            """, (int(id_or_slug),))
        else:
            p = query_one("""
                SELECT sp.*, dm.TenDanhMuc, dm.Slug AS CatSlug
                FROM sanpham sp
                LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
                WHERE sp.Slug = %s
            """, (id_or_slug,))

        if not p:
            return jsonify({'success': False, 'message': 'Không tìm thấy sản phẩm.'}), 404

        actual_id = p['MaSanPham']
        variants_raw = query_all("SELECT * FROM bienthesanpham WHERE MaSanPham = %s", (actual_id,))
        variants = []
        min_price = float(p.get('GiaCoSo') or 0)
        max_price = min_price
        total_stock = 0

        if variants_raw:
            prices = [float(v['GiaBan'] or 0) for v in variants_raw]
            min_price = min(prices)
            max_price = max(prices)
            total_stock = sum(int(v.get('SoLuongTonKho') or 0) for v in variants_raw)
            for v in variants_raw:
                variants.append({
                    'MaBienThe': v['MaBienThe'],
                    'TenBienThe': v.get('KichThuocSize') or f"Phiên bản {v['MaBienThe']}",
                    'GiaBan': float(v.get('GiaBan') or 0),
                    'SoLuongTonKho': int(v.get('SoLuongTonKho') or 0)
                })

        images_raw = query_all("SELECT DuongDanAnh FROM hinhanhsanpham WHERE MaSanPham = %s ORDER BY ThuTuHienThi ASC", (actual_id,))
        gallery = [img['DuongDanAnh'] for img in images_raw if img.get('DuongDanAnh')]
        main_image = gallery[0] if gallery else 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'

        prod_dict = {
            'MaSanPham': actual_id,
            'TenSanPham': p['TenSanPham'],
            'Slug': p['Slug'] or f"sp-{actual_id}",
            'CatSlug': p['CatSlug'] or 'nhan-kim-cuong',
            'TenDanhMuc': p['TenDanhMuc'] or 'Trang Sức',
            'ChatLieu': p.get('ChatLieu') or 'Vàng 18K',
            'PhongCach': p.get('PhongCach') or 'Sang trọng',
            'DoiTuong': p.get('DoiTuong') or 'Nữ',
            'GiaCoSo': float(p.get('GiaCoSo') or min_price),
            'GiaMin': min_price,
            'GiaMax': max_price,
            'HinhAnhChinh': main_image,
            'gallery': gallery if gallery else [main_image],
            'LaNoiBat': 1 if p.get('LaNoiBat') else 0,
            'TongTonKho': total_stock or 20,
            'MoTa': p.get('MoTaChiTiet') or '',
            'bienthe': variants
        }
        return jsonify({'success': True, 'data': prod_dict})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/products', methods=['POST'])
def create_product():
    data = request.get_json() or {}
    name = data.get('TenSanPham', '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Vui lòng cung cấp tên sản phẩm.'}), 400

    slug = data.get('Slug') or name.lower().replace(' ', '-').replace('/', '-')
    cat_slug = data.get('CatSlug', '')
    cat_id = 1
    if cat_slug:
        cat_row = query_one("SELECT MaDanhMuc FROM danhmuc WHERE Slug = %s", (cat_slug,))
        if cat_row:
            cat_id = cat_row['MaDanhMuc']

    base_price = float(data.get('GiaCoSo') or 20000000)
    material = data.get('ChatLieu', 'Kim Cương GIA')
    style = data.get('PhongCach', 'Sang trọng')
    audience = data.get('DoiTuong', 'Nữ')
    desc = data.get('MoTa', '') or data.get('MoTaChiTiet', '')
    is_featured = 1 if data.get('LaNoiBat') else 0

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO sanpham (TenSanPham, Slug, MaDanhMuc, ChatLieu, PhongCach, DoiTuong, GiaCoSo, MoTaChiTiet, LaNoiBat, TrangThai, NgayTao)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'DangBan', NOW())
        """, (name, slug, cat_id, material, style, audience, base_price, desc, is_featured))
        new_id = cursor.lastrowid

        # Insert images
        gallery = data.get('gallery') or []
        main_img = data.get('HinhAnhChinh')
        if main_img and main_img not in gallery:
            gallery.insert(0, main_img)
        if not gallery and main_img:
            gallery = [main_img]

        for idx, img_url in enumerate(gallery):
            if img_url:
                cursor.execute("""
                    INSERT INTO hinhanhsanpham (MaSanPham, DuongDanAnh, ThuTuHienThi)
                    VALUES (%s, %s, %s)
                """, (new_id, img_url, idx + 1))

        # Insert variants
        variants = data.get('bienthe') or []
        for idx, v in enumerate(variants):
            v_name = v.get('TenBienThe') or f"Size {idx + 10}"
            v_price = float(v.get('GiaBan') or base_price)
            v_stock = int(v.get('SoLuongTonKho') or 5)
            sku = f"SKU-{new_id}-{idx + 1}"
            cursor.execute("""
                INSERT INTO bienthesanpham (MaSanPham, SKU, KichThuocSize, GiaBan, SoLuongTonKho)
                VALUES (%s, %s, %s, %s, %s)
            """, (new_id, sku, v_name, v_price, v_stock))

        conn.commit()
        return jsonify({'success': True, 'message': 'Tạo sản phẩm mới thành công.', 'id': new_id})
    except Exception as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@api_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json() or {}
    name = data.get('TenSanPham', '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Vui lòng cung cấp tên sản phẩm.'}), 400

    slug = data.get('Slug') or name.lower().replace(' ', '-').replace('/', '-')
    cat_slug = data.get('CatSlug', '')
    cat_id = 1
    if cat_slug:
        cat_row = query_one("SELECT MaDanhMuc FROM danhmuc WHERE Slug = %s", (cat_slug,))
        if cat_row:
            cat_id = cat_row['MaDanhMuc']

    base_price = float(data.get('GiaCoSo') or 20000000)
    material = data.get('ChatLieu', 'Kim Cương GIA')
    style = data.get('PhongCach', 'Sang trọng')
    audience = data.get('DoiTuong', 'Nữ')
    desc = data.get('MoTa', '') or data.get('MoTaChiTiet', '')
    is_featured = 1 if data.get('LaNoiBat') else 0

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE sanpham 
            SET TenSanPham = %s, Slug = %s, MaDanhMuc = %s, ChatLieu = %s, PhongCach = %s,
                DoiTuong = %s, GiaCoSo = %s, MoTaChiTiet = %s, LaNoiBat = %s, NgayCapNhat = NOW()
            WHERE MaSanPham = %s
        """, (name, slug, cat_id, material, style, audience, base_price, desc, is_featured, product_id))

        # Replace images
        gallery = data.get('gallery') or []
        main_img = data.get('HinhAnhChinh')
        if main_img and main_img not in gallery:
            gallery.insert(0, main_img)

        if gallery:
            cursor.execute("DELETE FROM hinhanhsanpham WHERE MaSanPham = %s", (product_id,))
            for idx, img_url in enumerate(gallery):
                if img_url:
                    cursor.execute("""
                        INSERT INTO hinhanhsanpham (MaSanPham, DuongDanAnh, ThuTuHienThi)
                        VALUES (%s, %s, %s)
                    """, (product_id, img_url, idx + 1))

        # Replace or update variants safely without foreign key violations
        variants = data.get('bienthe')
        if variants is not None:
            cursor.execute("SELECT MaBienThe FROM bienthesanpham WHERE MaSanPham = %s", (product_id,))
            existing_rows = cursor.fetchall() or []
            existing_ids = {r['MaBienThe'] for r in existing_rows}
            kept_ids = set()

            for idx, v in enumerate(variants):
                v_id = v.get('MaBienThe')
                v_name = v.get('TenBienThe') or f"Size {idx + 10}"
                v_price = float(v.get('GiaBan') or base_price)
                v_stock = int(v.get('SoLuongTonKho') or 5)
                sku = f"SKU-{product_id}-{idx + 1}"

                if v_id and v_id in existing_ids:
                    cursor.execute("""
                        UPDATE bienthesanpham 
                        SET KichThuocSize = %s, GiaBan = %s, SoLuongTonKho = %s 
                        WHERE MaBienThe = %s
                    """, (v_name, v_price, v_stock, v_id))
                    kept_ids.add(v_id)
                else:
                    cursor.execute("""
                        INSERT INTO bienthesanpham (MaSanPham, SKU, KichThuocSize, GiaBan, SoLuongTonKho)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (product_id, sku, v_name, v_price, v_stock))

            to_remove = existing_ids - kept_ids
            for r_id in to_remove:
                try:
                    cursor.execute("DELETE FROM bienthesanpham WHERE MaBienThe = %s", (r_id,))
                except Exception:
                    pass

        conn.commit()
        return jsonify({'success': True, 'message': 'Cập nhật sản phẩm thành công.'})
    except Exception as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@api_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if product variants exist in orders
        cursor.execute("""
            SELECT COUNT(*) AS cnt 
            FROM chitietdonhang ctdh 
            JOIN bienthesanpham bt ON ctdh.MaBienThe = bt.MaBienThe 
            WHERE bt.MaSanPham = %s
        """, (product_id,))
        res = cursor.fetchone()
        order_count = res.get('cnt', 0) if res else 0

        if order_count > 0:
            # Soft delete to preserve historical order logs
            cursor.execute("UPDATE sanpham SET TrangThai = 'NgungBan' WHERE MaSanPham = %s", (product_id,))
        else:
            cursor.execute("DELETE FROM hinhanhsanpham WHERE MaSanPham = %s", (product_id,))
            cursor.execute("DELETE FROM bienthesanpham WHERE MaSanPham = %s", (product_id,))
            cursor.execute("DELETE FROM sanpham WHERE MaSanPham = %s", (product_id,))

        conn.commit()
        return jsonify({'success': True, 'message': 'Đã xóa sản phẩm thành công.'})
    except Exception as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ----------------- CATEGORIES CRUD -----------------
@api_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        cats_raw = query_all("SELECT * FROM danhmuc ORDER BY MaDanhMuc ASC")
        # Build hierarchy
        parents = [c for c in cats_raw if not c.get('MaDanhMucCha')]
        for p in parents:
            p['children'] = [c for c in cats_raw if c.get('MaDanhMucCha') == p['MaDanhMuc']]
            count_row = query_one("SELECT COUNT(*) AS cnt FROM sanpham WHERE MaDanhMuc = %s", (p['MaDanhMuc'],))
            p['SoLuongSP'] = count_row['cnt'] if count_row else 0
            # Default placeholder image if none
            if not p.get('AnhDaiDien'):
                p['AnhDaiDien'] = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'
        return jsonify({'success': True, 'data': clean_rows(parents)})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json() or {}
    name = data.get('TenDanhMuc', '').strip()
    slug = data.get('Slug') or name.lower().replace(' ', '-')
    desc = data.get('MoTa', '')
    parent_id = data.get('MaDanhMucCha') or None

    try:
        rowcount, last_id = execute("""
            INSERT INTO danhmuc (TenDanhMuc, Slug, MaDanhMucCha, MoTa)
            VALUES (%s, %s, %s, %s)
        """, (name, slug, parent_id, desc))
        return jsonify({'success': True, 'message': 'Tạo danh mục mới thành công.', 'id': last_id})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/categories/<int:cat_id>', methods=['PUT'])
def update_category(cat_id):
    data = request.get_json() or {}
    name = data.get('TenDanhMuc', '').strip()
    slug = data.get('Slug') or name.lower().replace(' ', '-')
    desc = data.get('MoTa', '')

    try:
        execute("""
            UPDATE danhmuc SET TenDanhMuc = %s, Slug = %s, MoTa = %s WHERE MaDanhMuc = %s
        """, (name, slug, desc, cat_id))
        return jsonify({'success': True, 'message': 'Cập nhật danh mục thành công.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/categories/<int:cat_id>', methods=['DELETE'])
def delete_category(cat_id):
    try:
        execute("DELETE FROM danhmuc WHERE MaDanhMuc = %s", (cat_id,))
        return jsonify({'success': True, 'message': 'Đã xóa danh mục.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ----------------- ORDERS CRUD -----------------
@api_bp.route('/orders', methods=['GET'])
def get_orders():
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

@api_bp.route('/orders', methods=['POST'])
def create_order():
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

@api_bp.route('/orders/<string:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
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

# ----------------- VOUCHERS CRUD -----------------
@api_bp.route('/vouchers', methods=['GET'])
def get_vouchers():
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

@api_bp.route('/vouchers', methods=['POST'])
def create_voucher():
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

@api_bp.route('/vouchers/<int:vid>', methods=['DELETE'])
def delete_voucher(vid):
    try:
        execute("DELETE FROM magiamgia WHERE MaVoucher = %s", (vid,))
        return jsonify({'success': True, 'message': 'Đã xóa voucher.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ----------------- USERS CRUD -----------------
@api_bp.route('/users', methods=['GET'])
def get_users():
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

@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    fullname = data.get('fullName', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    role_str = data.get('role', 'CUSTOMER')
    role_id = 3
    if role_str == 'ADMIN':
        role_id = 1
    elif role_str == 'STAFF':
        role_id = 2

    try:
        rowcount, last_id = execute("""
            INSERT INTO nguoidung (TenDangNhap, MatKhauMaHoa, HoTen, Email, SoDienThoai, MaVaiTro, NgayTao)
            VALUES (%s, '123456', %s, %s, %s, %s, NOW())
        """, (username, fullname, email, phone, role_id))
        return jsonify({'success': True, 'message': 'Đã tạo tài khoản người dùng thành công.', 'id': last_id})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads', 'products')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

@api_bp.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'Không tìm thấy file ảnh tải lên.'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'Chưa chọn file ảnh.'}), 400
    
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'jpg'
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({'success': False, 'message': 'Định dạng ảnh không được hỗ trợ (chỉ nhận JPG, PNG, WEBP, GIF).'}), 400
    
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    timestamp = int(time.time())
    rand_str = uuid.uuid4().hex[:6]
    safe_filename = f"prod_upload_{timestamp}_{rand_str}.{ext}"
    save_path = os.path.join(UPLOAD_FOLDER, safe_filename)
    file.save(save_path)
    
    rel_url = f"/static/uploads/products/{safe_filename}"
    return jsonify({'success': True, 'url': rel_url, 'filename': safe_filename})
