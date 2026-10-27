from flask import Blueprint, request, jsonify
from db import query_all, query_one, get_db_connection
from api.utils import clean_row, clean_rows

products_bp = Blueprint('products_api', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    """Retrieve full list of products with category and variant information."""
    try:
        sql = """
            SELECT sp.*, dm.TenDanhMuc
            FROM sanpham sp
            LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
            ORDER BY sp.NgayTao DESC, sp.MaSanPham DESC
        """
        raw_prods = query_all(sql)
        products = []

        for p in raw_prods:
            pid = p['MaSanPham']
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

            images_raw = query_all("SELECT DuongDanAnh FROM hinhanhsanpham WHERE MaSanPham = %s ORDER BY ThuTuHienThi ASC", (pid,))
            gallery = [img['DuongDanAnh'] for img in images_raw if img.get('DuongDanAnh')]
            main_image = gallery[0] if gallery else 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'

            prod_dict = {
                'MaSanPham': pid,
                'TenSanPham': p['TenSanPham'],
                'Slug': f"sp-{pid}",
                'CatSlug': str(p.get('MaDanhMuc', 1)),
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

@products_bp.route('/products/<id_or_slug>', methods=['GET'])
def get_product(id_or_slug):
    """Retrieve detailed information of a single product by ID or Slug."""
    try:
        is_id = str(id_or_slug).isdigit()
        if is_id:
            p = query_one("""
                SELECT sp.*, dm.TenDanhMuc
                FROM sanpham sp
                LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
                WHERE sp.MaSanPham = %s
            """, (int(id_or_slug),))
        else:
            pid_cand = str(id_or_slug).replace('sp-', '')
            if pid_cand.isdigit():
                p = query_one("""
                    SELECT sp.*, dm.TenDanhMuc
                    FROM sanpham sp
                    LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
                    WHERE sp.MaSanPham = %s
                """, (int(pid_cand),))
            else:
                p = query_one("""
                    SELECT sp.*, dm.TenDanhMuc
                    FROM sanpham sp
                    LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
                    WHERE sp.TenSanPham = %s
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
            'Slug': f"sp-{actual_id}",
            'CatSlug': str(p.get('MaDanhMuc', 1)),
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

@products_bp.route('/products', methods=['POST'])
def create_product():
    """Create a new product with images and variants."""
    data = request.get_json() or {}
    name = data.get('TenSanPham', '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Vui lòng cung cấp tên sản phẩm.'}), 400

    cat_id = 1
    if data.get('MaDanhMuc'):
        try:
            cat_id = int(data['MaDanhMuc'])
        except (ValueError, TypeError):
            pass

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
            INSERT INTO sanpham (TenSanPham, MaDanhMuc, ChatLieu, PhongCach, DoiTuong, GiaCoSo, MoTaChiTiet, LaNoiBat, TrangThai, NgayTao)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'DangBan', NOW())
        """, (name, cat_id, material, style, audience, base_price, desc, is_featured))
        new_id = cursor.lastrowid

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

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update product information, images, and variants."""
    data = request.get_json() or {}
    name = data.get('TenSanPham', '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Vui lòng cung cấp tên sản phẩm.'}), 400

    cat_id = 1
    if data.get('MaDanhMuc'):
        try:
            cat_id = int(data['MaDanhMuc'])
        except (ValueError, TypeError):
            pass

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
            SET TenSanPham = %s, MaDanhMuc = %s, ChatLieu = %s, PhongCach = %s,
                DoiTuong = %s, GiaCoSo = %s, MoTaChiTiet = %s, LaNoiBat = %s, NgayCapNhat = NOW()
            WHERE MaSanPham = %s
        """, (name, cat_id, material, style, audience, base_price, desc, is_featured, product_id))

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

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product or soft-delete if it has existing orders."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT COUNT(*) AS cnt 
            FROM chitietdonhang ctdh 
            JOIN bienthesanpham bt ON ctdh.MaBienThe = bt.MaBienThe 
            WHERE bt.MaSanPham = %s
        """, (product_id,))
        res = cursor.fetchone()
        order_count = res.get('cnt', 0) if res else 0

        if order_count > 0:
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
