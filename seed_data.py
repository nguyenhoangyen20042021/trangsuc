import sys
sys.stdout.reconfigure(encoding='utf-8')
from werkzeug.security import generate_password_hash
from db import get_db

def seed_database():
    print("Bắt đầu nạp dữ liệu mẫu cho website Trang Sức...")
    with get_db() as (cursor, conn):
        # 1. Kiểm tra / chèn VaiTro nếu chưa có
        cursor.execute("SELECT COUNT(*) AS cnt FROM VaiTro")
        if cursor.fetchone()['cnt'] == 0:
            cursor.execute("""
                INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES 
                (1, 'ADMIN', 'Quản trị viên hệ thống'),
                (2, 'STAFF', 'Nhân viên bán hàng và kho'),
                (3, 'CUSTOMER', 'Khách hàng mua sắm')
            """)

        users = [
            (1, 'admin', generate_password_hash('admin123'), 'Quản Trị Viên Cao Cấp', 'admin@aurajewelry.vn', '0901234567'),
            (2, 'nhanvien', generate_password_hash('staff123'), 'Nguyễn Văn Nhân Viên', 'staff@aurajewelry.vn', '0912345678'),
            (3, 'khachhang', generate_password_hash('123456'), 'Lê Hoàng Yến Nhi', 'yennhi@gmail.com', '0987654321'),
            (3, 'minhtri', generate_password_hash('123456'), 'Trần Minh Trí', 'minhtri@gmail.com', '0978999888')
        ]
        for u in users:
            cursor.execute("SELECT MaNguoiDung FROM NguoiDung WHERE TenDangNhap = %s", (u[1],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO NguoiDung (MaVaiTro, TenDangNhap, MatKhauMaHoa, HoTen, Email, SoDienThoai)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, u)

        # 3. Danh mục sản phẩm
        categories = [
            ('Nhẫn Kim Cương & Nhẫn Cưới', 'nhan-kim-cuong', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', 'Bộ sưu tập nhẫn đính hôn, nhẫn cưới và nhẫn kim cương tự nhiên đẳng cấp.'),
            ('Dây Chuyền & Mặt Dây', 'day-chuyen-mat-day', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80', 'Dây chuyền vàng 18K, bạch kim phối kim cương và đá quý tinh xảo.'),
            ('Vòng Tay & Lắc', 'vong-tay-lac', 'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80', 'Vòng tay Tennis, lắc bạc Ý và lắc vàng tôn vinh cổ tay phái đẹp.'),
            ('Bông Tai Quý Phái', 'bong-tai', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80', 'Hoa tai kim cương, ngọc trai biển sâu kiêu sa cho mọi dịp tiệc tùng.'),
            ('Bộ Sưu Tập Hoàng Gia', 'bo-suu-tap-hoang-gia', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80', 'Tuyệt tác trang sức đá quý Ruby, Sapphire và Emerald giới hạn.')
        ]
        cat_map = {}
        for cat in categories:
            cursor.execute("SELECT MaDanhMuc FROM DanhMuc WHERE Slug = %s", (cat[1],))
            row = cursor.fetchone()
            if row:
                cat_map[cat[1]] = row['MaDanhMuc']
            else:
                cursor.execute("""
                    INSERT INTO DanhMuc (TenDanhMuc, Slug, HinhAnh, MoTa)
                    VALUES (%s, %s, %s, %s)
                """, cat)
                cat_map[cat[1]] = cursor.lastrowid

        # 4. Sản phẩm mẫu & biến thể
        products = [
            {
                'ten': 'Nhẫn Kim Cương Solitaire Eternal Grace',
                'slug': 'nhan-kim-cuong-solitaire-eternal-grace',
                'danhmuc': 'nhan-kim-cuong',
                'chatlieu': 'Kim Cương',
                'phongcach': 'Sang trọng',
                'doituong': 'Nữ',
                'gia': 28500000,
                'mota': 'Nhẫn đính hôn Solitaire Eternal Grace sở hữu viên kim cương chủ chuẩn kiểm định GIA 4.5 ly nước F, độ sạch VVS1 gắn trên chấu 6 trấu kinh điển bằng vàng trắng 750 (18K). Thiết kế thanh thoát tôn vinh vẻ đẹp vĩnh cửu của tình yêu đôi lứa.',
                'anh': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
                'banchay': True,
                'noibat': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('EG-R-10', 'Size 10', 'Kim cương tự nhiên GIA', 28500000, 8),
                    ('EG-R-11', 'Size 11', 'Kim cương tự nhiên GIA', 28500000, 12),
                    ('EG-R-12', 'Size 12', 'Kim cương tự nhiên GIA', 29000000, 5),
                    ('EG-R-10-MOIS', 'Size 10', 'Kim cương Moissanite', 12500000, 15)
                ]
            },
            {
                'ten': 'Cặp Nhẫn Cưới Đôi Royal Eternity',
                'slug': 'cap-nhan-cuoi-doi-royal-eternity',
                'danhmuc': 'nhan-kim-cuong',
                'chatlieu': 'Vàng 18K',
                'phongcach': 'Hiện đại',
                'doituong': 'Cặp đôi',
                'gia': 18900000,
                'mota': 'Cặp nhẫn cưới Royal Eternity được chế tác từ vàng 18K nguyên khối, nhẫn nam viền xước mờ lịch lãm, nhẫn nữ nạm dải kim cương tấm lấp lánh mang ý nghĩa gắn kết trọn đời không rời.',
                'anh': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
                'banchay': True,
                'noibat': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('RE-PAIR-11-14', 'Nam 14 - Nữ 10', 'Kim cương tấm tự nhiên', 18900000, 6),
                    ('RE-PAIR-12-15', 'Nam 15 - Nữ 11', 'Kim cương tấm tự nhiên', 19200000, 4),
                    ('RE-PAIR-13-16', 'Nam 16 - Nữ 12', 'Kim cương tấm tự nhiên', 19500000, 5)
                ]
            },
            {
                'ten': 'Dây Chuyền Mặt Kim Cương Halo Celestial',
                'slug': 'day-chuyen-mat-kim-cuong-halo-celestial',
                'danhmuc': 'day-chuyen-mat-day',
                'chatlieu': 'Bạch Kim',
                'phongcach': 'Sang trọng',
                'doituong': 'Nữ',
                'gia': 22000000,
                'mota': 'Dây chuyền chế tác từ bạch kim Platinum 950 cao cấp với mặt tròn Halo nạm viên kim cương chủ cùng vòng hào quang rực rỡ, phản chiếu ánh sáng kiêu sa dưới mọi góc nhìn.',
                'anh': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
                'banchay': True,
                'noibat': False,
                'gallery': [
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('HC-NK-42', 'Dây 42cm', 'Kim cương tự nhiên', 22000000, 7),
                    ('HC-NK-45', 'Dây 45cm', 'Kim cương tự nhiên', 22800000, 9)
                ]
            },
            {
                'ten': 'Vòng Tay Kim Cương Tennis Diamond Royale',
                'slug': 'vong-tay-kim-cuong-tennis-diamond-royale',
                'danhmuc': 'vong-tay-lac',
                'chatlieu': 'Kim Cương',
                'phongcach': 'Sang trọng',
                'doituong': 'Nữ',
                'gia': 68000000,
                'mota': 'Biểu tượng kinh điển của sự xa hoa quý phái: Lắc tay Tennis nạm liền mạch 52 viên kim cương tấm tự nhiên tuyển chọn đồng đều giác cắt Excellent trên nền vàng trắng 18K.',
                'anh': 'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80',
                'banchay': True,
                'noibat': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('TD-BR-16', 'Size 16cm', 'Kim cương tự nhiên 2.5ct', 68000000, 3),
                    ('TD-BR-17', 'Size 17cm', 'Kim cương tự nhiên 2.7ct', 72000000, 2)
                ]
            },
            {
                'ten': 'Bông Tai Ngọc Trai South Sea Dát Vàng 18K',
                'slug': 'bong-tai-ngoc-trai-south-sea-dat-vang-18k',
                'danhmuc': 'bong-tai',
                'chatlieu': 'Vàng 18K',
                'phongcach': 'Cổ điển',
                'doituong': 'Nữ',
                'gia': 16500000,
                'mota': 'Đôi bông tai kết hợp giữa vẻ đẹp thuần khiết của ngọc trai biển South Sea 10-11mm ánh xà cừ óng ả và chấu khóa hoa tulip vàng vàng 18K điểm xuyết đá quý lấp lánh.',
                'anh': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
                'banchay': False,
                'noibat': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('ST-ER-GOLD', 'Tiêu chuẩn', 'Ngọc trai vàng South Sea', 16500000, 10),
                    ('ST-ER-WHITE', 'Tiêu chuẩn', 'Ngọc trai trắng South Sea', 15800000, 8)
                ]
            },
            {
                'ten': 'Nhẫn Nam Kim Cương Signet Black Onyx',
                'slug': 'nhan-nam-kim-cuong-signet-black-onyx',
                'danhmuc': 'nhan-kim-cuong',
                'chatlieu': 'Vàng 18K',
                'phongcach': 'Hiện đại',
                'doituong': 'Nam',
                'gia': 34500000,
                'mota': 'Nhẫn nam dáng Signet quyền lực đúc đặc vàng hồng 18K kết hợp mặt đá Onyx đen bóng huyền bí và viên kim cương chủ 5 ly góc cạnh, khẳng định bản lĩnh của quý ông thành đạt.',
                'anh': 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
                'banchay': True,
                'noibat': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('SG-MEN-17', 'Size 17', 'Kim cương & Đá Onyx', 34500000, 5),
                    ('SG-MEN-18', 'Size 18', 'Kim cương & Đá Onyx', 34500000, 7),
                    ('SG-MEN-19', 'Size 19', 'Kim cương & Đá Onyx', 35000000, 4)
                ]
            },
            {
                'ten': 'Dây Chuyền Đá Sapphire Hoàng Gia Vương Triều',
                'slug': 'day-chuyen-da-sapphire-hoang-gia-vuong-trieu',
                'danhmuc': 'day-chuyen-mat-day',
                'chatlieu': 'Bạch Kim',
                'phongcach': 'Cổ điển',
                'doituong': 'Nữ',
                'gia': 45000000,
                'mota': 'Lấy cảm hứng từ trang sức vương thất châu Âu, dây chuyền điểm viên đá Sapphire tự nhiên xanh biển thẳm 3.2 carat được bao bọc bởi dải kim cương kép rực rỡ.',
                'anh': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
                'banchay': False,
                'noibat': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('SPH-ROYAL-45', 'Dây 45cm', 'Sapphire tự nhiên & Kim Cương', 45000000, 3)
                ]
            },
            {
                'ten': 'Lắc Tay Bạc Ý S925 Tinh Khôi Sparkling Wish',
                'slug': 'lac-tay-bac-y-s925-tinh-khoi-sparkling-wish',
                'danhmuc': 'vong-tay-lac',
                'chatlieu': 'Bạc S925',
                'phongcach': 'Tối giản',
                'doituong': 'Nữ',
                'gia': 1250000,
                'mota': 'Lắc tay bạc Ý xi mạ vàng trắng cao cấp, đính các hạt charm bi tròn và đá Swarovski lấp lánh nhẹ nhàng, phù hợp cho trang phục thường ngày hoặc đi làm văn phòng.',
                'anh': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
                'banchay': True,
                'noibat': False,
                'gallery': [
                    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('S925-BR-FREE', 'Freesize (15-18cm)', 'Đá CZ Áo', 1250000, 40)
                ]
            },
            {
                'ten': 'Bông Tai Kim Cương Drop Grace Chùm Dài',
                'slug': 'bong-tai-kim-cuong-drop-grace-chum-dai',
                'danhmuc': 'bong-tai',
                'chatlieu': 'Kim Cương',
                'phongcach': 'Sang trọng',
                'doituong': 'Nữ',
                'gia': 38000000,
                'mota': 'Đôi hoa tai dáng giọt nước thanh mảnh đung đưa theo từng chuyển động, chế tác từ vàng trắng 18K đính 36 viên kim cương tấm tự nhiên tạo hiệu ứng bắt sáng tối đa.',
                'anh': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80',
                'banchay': False,
                'noibat': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('DG-ER-WHITE', 'Tiêu chuẩn', 'Kim cương tự nhiên', 38000000, 6)
                ]
            },
            {
                'ten': 'Nhẫn Nữ Ruby Huyết Bồ Câu Passionate',
                'slug': 'nhan-nu-ruby-huyet-bo-cau-passionate',
                'danhmuc': 'bo-suu-tap-hoang-gia',
                'chatlieu': 'Vàng 18K',
                'phongcach': 'Cổ điển',
                'doituong': 'Nữ',
                'gia': 52000000,
                'mota': 'Viên đá Ruby đỏ thắm giác cắt Oval rực cháy tựa ngọn lửa tình yêu nồng nàn, kết hợp giác cắt kim cương bao quanh tạo nên một kiệt tác trang sức phong thủy mang lại may mắn và quyền uy.',
                'anh': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
                'banchay': False,
                'noibat': True,
                'gallery': [
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
                ],
                'bienthe': [
                    ('RUBY-R-11', 'Size 11', 'Ruby tự nhiên Myanmar', 52000000, 2),
                    ('RUBY-R-12', 'Size 12', 'Ruby tự nhiên Myanmar', 52000000, 3)
                ]
            }
        ]

        for p in products:
            cursor.execute("SELECT MaSanPham FROM SanPham WHERE Slug = %s", (p['slug'],))
            sp_row = cursor.fetchone()
            cat_id = cat_map[p['danhmuc']]
            if not sp_row:
                cursor.execute("""
                    INSERT INTO SanPham (TenSanPham, Slug, MaDanhMuc, ChatLieu, PhongCach, DoiTuong, GiaCoSo, MoTaChiTiet, HinhAnhChinh, LaBanChay, LaNoiBat, LuotXem, TrangThai)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'DangBan')
                """, (
                    p['ten'], p['slug'], cat_id, p['chatlieu'], p['phongcach'], p['doituong'],
                    p['gia'], p['mota'], p['anh'], p['banchay'], p['noibat'], 150
                ))
                sp_id = cursor.lastrowid
                
                # Biến thể
                for bt in p['bienthe']:
                    cursor.execute("""
                        INSERT INTO BienTheSanPham (MaSanPham, SKU, KichThuocSize, LoaiDa, GiaBan, SoLuongTonKho, HinhAnhBienThe)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (sp_id, bt[0], bt[1], bt[2], bt[3], bt[4], p['anh']))
                
                # Gallery
                for idx, img in enumerate(p['gallery']):
                    cursor.execute("""
                        INSERT INTO HinhAnhSanPham (MaSanPham, DuongDanAnh, ThuTuHienThi)
                        VALUES (%s, %s, %s)
                    """, (sp_id, img, idx))

        # 5. Mã giảm giá (MaGiamGia)
        vouchers = [
            ('AURA2026', 'PERCENT', 10, 500000, 2000000, 100, 5, '2026-01-01 00:00:00', '2026-12-31 23:59:59', True),
            ('LUXURYVIP', 'PERCENT', 15, 2500000, 15000000, 50, 2, '2026-01-01 00:00:00', '2026-12-31 23:59:59', True),
            ('GIAM100K', 'FIXED', 100000, 100000, 1000000, 200, 12, '2026-01-01 00:00:00', '2026-12-31 23:59:59', True),
        ]
        for v in vouchers:
            cursor.execute("SELECT MaVoucher FROM MaGiamGia WHERE MaCode = %s", (v[0],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO MaGiamGia (MaCode, LoaiGiamGia, GiaTriGiam, GiaTriGiamToiDa, DonHangToiThieu, SoLuongSuDung, SoLuongDaDung, NgayBatDau, NgayKetThuc, TrangThai)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, v)

        # 6. Đánh giá sản phẩm mẫu
        cursor.execute("SELECT MaSanPham FROM SanPham LIMIT 3")
        sample_sps = cursor.fetchall()
        if sample_sps:
            for s in sample_sps:
                cursor.execute("SELECT COUNT(*) AS cnt FROM DanhGia WHERE MaSanPham = %s", (s['MaSanPham'],))
                if cursor.fetchone()['cnt'] == 0:
                    cursor.execute("""
                        INSERT INTO DanhGia (MaNguoiDung, MaSanPham, SoSao, BinhLuan)
                        VALUES (%s, %s, 5, 'Sản phẩm bên ngoài nhìn sáng bóng lộng lẫy hơn cả ảnh chụp! Đóng gói hộp nhung rất cao cấp, có đầy đủ giấy kiểm định GIA.')
                    """, (khach_id, s['MaSanPham']))

        # 7. Đơn hàng mẫu để hiển thị thống kê & quản lý
        cursor.execute("SELECT COUNT(*) AS cnt FROM DonHang")
        if cursor.fetchone()['cnt'] == 0:
            cursor.execute("SELECT MaBienThe, GiaBan, MaSanPham FROM BienTheSanPham LIMIT 2")
            bts = cursor.fetchall()
            if bts:
                bt1 = bts[0]
                total = bt1['GiaBan']
                cursor.execute("""
                    INSERT INTO DonHang (MaDonHangCode, MaNguoiDung, TenNguoiNhan, SoDienThoaiNguoiNhan, DiaChiGiaoHang, GhiChu, TongTienHang, PhiVanChuyen, SoTienGiam, TongThanhToan, TrangThaiDonHang, PhuongThucThanhToan, TrangThaiThanhToan)
                    VALUES ('AURA2026101701', %s, 'Lê Hoàng Yến Nhi', '0987654321', 'Tầng 15, Vincom Center, 72 Lê Thánh Tôn, Q1, TP.HCM', 'Giao hàng giờ hành chính', %s, 0, 0, %s, 'DaXacNhan', 'BANK_TRANSFER', 'DaThanhToan')
                """, (khach_id, total, total))
                dh_id = cursor.lastrowid
                
                cursor.execute("""
                    INSERT INTO ChiTietDonHang (MaDonHang, MaBienThe, TenSanPhamSnap, KichThuocSnap, SoLuong, DonGia)
                    VALUES (%s, %s, 'Nhẫn Kim Cương Solitaire Eternal Grace', 'Size 10', 1, %s)
                """, (dh_id, bt1['MaBienThe'], bt1['GiaBan']))

                cursor.execute("""
                    INSERT INTO LichSuDonHang (MaDonHang, TrangThai, GhiChu)
                    VALUES (%s, 'ChoXacNhan', 'Khách hàng đặt đơn thành công qua website'),
                           (%s, 'DaXacNhan', 'Cửa hàng đã xác nhận thanh toán chuyển khoản và chuẩn bị trang sức')
                """, (dh_id, dh_id))

    print("Hoàn tất nạp dữ liệu mẫu thành công!")

if __name__ == '__main__':
    seed_database()
