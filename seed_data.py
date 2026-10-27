import sys
import argparse
from datetime import datetime
from werkzeug.security import generate_password_hash
from db import get_db

if sys.stdout and sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def reset_tables(cursor):
    """Xóa sạch dữ liệu các bảng theo đúng cấu trúc wed_trang_suc.sql để seed mới."""
    print("🧹 Đang đặt lại toàn bộ dữ liệu bảng...")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    tables = [
        "chitietdonhang",
        "donhang",
        "chitietgiohang",
        "giohang",
        "hinhanhsanpham",
        "bienthesanpham",
        "sanpham",
        "danhmuc",
        "magiamgia",
        "nguoidung",
        "vaitro"
    ]
    for table in tables:
        cursor.execute(f"TRUNCATE TABLE `{table}`")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    print("✓ Đã làm sạch toàn bộ các bảng trong cơ sở dữ liệu.")

def seed_roles(cursor):
    """1. Bảng vaitro (Vai Trò)"""
    roles = [
        (1, 'ADMIN', 'Quản trị viên hệ thống'),
        (2, 'STAFF', 'Nhân viên bán hàng/kho'),
        (3, 'CUSTOMER', 'Khách hàng mua sắm')
    ]
    for r in roles:
        cursor.execute("SELECT MaVaiTro FROM vaitro WHERE MaVaiTro = %s", (r[0],))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO vaitro (MaVaiTro, TenVaiTro, MoTa)
                VALUES (%s, %s, %s)
            """, r)
    print("✓ Hoàn thành seed bảng `vaitro` (3 vai trò).")

def seed_users(cursor):
    """2. Bảng nguoidung (Người Dùng)"""
    users = [
        (1, 1, 'admin', generate_password_hash('admin123'), 'Quản Trị Viên Cao Cấp', 'admin@aurajewelry.vn', '0901234567'),
        (2, 2, 'nhanvien', generate_password_hash('staff123'), 'Nguyễn Văn Nhân Viên', 'staff@aurajewelry.vn', '0912345678'),
        (3, 3, 'khachhang', generate_password_hash('123456'), 'Lê Hoàng Yến Nhi', 'yennhi@gmail.com', '0987654321'),
        (4, 3, 'minhtri', generate_password_hash('123456'), 'Trần Minh Trí', 'minhtri@gmail.com', '0978999888')
    ]
    user_map = {}
    for u in users:
        cursor.execute("SELECT MaNguoiDung FROM nguoidung WHERE TenDangNhap = %s", (u[2],))
        row = cursor.fetchone()
        if row:
            user_map[u[2]] = row['MaNguoiDung']
        else:
            cursor.execute("""
                INSERT INTO nguoidung (MaVaiTro, TenDangNhap, MatKhauMaHoa, HoTen, Email, SoDienThoai)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, u[1:])
            user_map[u[2]] = cursor.lastrowid
    print(f"✓ Hoàn thành seed bảng `nguoidung` ({len(users)} tài khoản: admin, nhanvien, khachhang, minhtri).")
    return user_map

def seed_categories(cursor):
    """3. Bảng danhmuc (Danh Mục Chính & Danh Mục Con)"""
    # 3.1 Danh mục chính (MaDanhMucCha = NULL)
    parent_categories = [
        ('Nhẫn Kim Cương & Nhẫn Cưới', 'Bộ sưu tập nhẫn đính hôn, nhẫn cưới và nhẫn kim cương tự nhiên đẳng cấp.'),
        ('Dây Chuyền & Mặt Dây', 'Dây chuyền vàng 18K, bạch kim phối kim cương và đá quý tinh xảo.'),
        ('Vòng Tay & Lắc', 'Vòng tay Tennis, lắc bạc Ý và lắc vàng tôn vinh cổ tay phái đẹp.'),
        ('Bông Tai Quý Phái', 'Hoa tai kim cương, ngọc trai biển sâu kiêu sa cho mọi dịp tiệc tùng.'),
        ('Bộ Sưu Tập Hoàng Gia', 'Tuyệt tác trang sức đá quý Ruby, Sapphire và Emerald giới hạn.')
    ]
    cat_map = {}
    for cat in parent_categories:
        cursor.execute("SELECT MaDanhMuc FROM danhmuc WHERE TenDanhMuc = %s", (cat[0],))
        row = cursor.fetchone()
        if row:
            cat_map[cat[0]] = row['MaDanhMuc']
        else:
            cursor.execute("""
                INSERT INTO danhmuc (TenDanhMuc, MaDanhMucCha, MoTa)
                VALUES (%s, NULL, %s)
            """, (cat[0], cat[1]))
            cat_map[cat[0]] = cursor.lastrowid

    # 3.2 Danh mục con (Subcategories)
    subcategories = [
        ('Nhẫn Cầu Hôn Solitaire', cat_map['Nhẫn Kim Cương & Nhẫn Cưới'], 'Các mẫu nhẫn cầu hôn kim cương giác cắt tròn Brilliant kiêu sa.'),
        ('Nhẫn Cưới Cặp Uyên Ương', cat_map['Nhẫn Kim Cương & Nhẫn Cưới'], 'Nhẫn cưới vàng 18K và bạch kim minh chứng cho tình yêu vĩnh cửu.'),
        ('Nhẫn Nữ Kim Cương Moissanite', cat_map['Nhẫn Kim Cương & Nhẫn Cưới'], 'Nhẫn Moissanite nước D giác cắt giác tinh hoa rực rỡ.'),
        ('Dây Chuyền Vàng Ý 18K', cat_map['Dây Chuyền & Mặt Dây'], 'Dây chuyền vàng Ý thanh mảnh, tôn vinh bờ vai quý phái.'),
        ('Mặt Dây Chuyền Đính Kim Cương', cat_map['Dây Chuyền & Mặt Dây'], 'Mặt dây chuyền hình giọt nước và trái tim đính đá lấp lánh.'),
        ('Vòng Tay Tennis Diamond', cat_map['Vòng Tay & Lắc'], 'Vòng tay Tennis đính dải kim cương liên hoàn sang trọng.'),
        ('Lắc Tay Bạc & Vàng Quý Cô', cat_map['Vòng Tay & Lắc'], 'Lắc tay đính đá quý phong cách thanh lịch hiện đại.'),
        ('Bông Tai Nụ Halo Kiêu Sa', cat_map['Bông Tai Quý Phái'], 'Bông tai nụ viền hào quang Halo sáng bừng gương mặt.'),
        ('Bông Tai Dáng Dài Dạ Hội', cat_map['Bông Tai Quý Phái'], 'Bông tai chùm dài đính đá quý chuyển động uyển chuyển.'),
        ('Trang Sức Ruby Huyết Bồ Câu', cat_map['Bộ Sưu Tập Hoàng Gia'], 'Trang sức đá quý Ruby đỏ rực quý phái biểu tượng quyền uy.'),
        ('Trang Sức Emerald Ngọc Lục Bảo', cat_map['Bộ Sưu Tập Hoàng Gia'], 'Trang sức đá ngọc lục bảo Emerald Columbia thiên nhiên quý hiếm.')
    ]
    for sub in subcategories:
        cursor.execute("SELECT MaDanhMuc FROM danhmuc WHERE TenDanhMuc = %s", (sub[0],))
        row = cursor.fetchone()
        if row:
            cat_map[sub[0]] = row['MaDanhMuc']
        else:
            cursor.execute("""
                INSERT INTO danhmuc (TenDanhMuc, MaDanhMucCha, MoTa)
                VALUES (%s, %s, %s)
            """, sub)
            cat_map[sub[0]] = cursor.lastrowid

    print(f"✓ Hoàn thành seed bảng `danhmuc` (5 danh mục chính, {len(subcategories)} danh mục con phân cấp).")
    return cat_map

def seed_products(cursor, cat_map):
    """4. Bảng sanpham, bienthesanpham, hinhanhsanpham"""
    products = [
        {
            'ten': 'Nhẫn Kim Cương Solitaire Eternal Grace',
            'danhmuc': 'Nhẫn Cầu Hôn Solitaire',
            'chatlieu': 'Kim Cương GIA & Vàng Trắng 18K',
            'phongcach': 'Sang trọng',
            'doituong': 'Nữ',
            'gia': 28500000,
            'mota': 'Nhẫn đính hôn Solitaire Eternal Grace sở hữu viên kim cương chủ chuẩn kiểm định GIA 4.5 ly nước F, độ sạch VVS1 gắn trên chấu 6 trấu kinh điển bằng vàng trắng 750 (18K). Thiết kế thanh thoát tôn vinh vẻ đẹp vĩnh cửu của tình yêu đôi lứa.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'
            ],
            'bienthe': [
                ('EG-R-10', 'Size 10', 'Kim cương tự nhiên GIA 4.5 ly', 28500000, 8),
                ('EG-R-11', 'Size 11', 'Kim cương tự nhiên GIA 4.5 ly', 28500000, 12),
                ('EG-R-12', 'Size 12', 'Kim cương tự nhiên GIA 4.5 ly', 29000000, 5),
                ('EG-R-10-MOIS', 'Size 10', 'Kim cương Moissanite 5.0 ly', 12500000, 15)
            ]
        },
        {
            'ten': 'Cặp Nhẫn Cưới Đôi Royal Eternity',
            'danhmuc': 'Nhẫn Cưới Cặp Uyên Ương',
            'chatlieu': 'Vàng 18K & Kim Cương Tấm',
            'phongcach': 'Hiện đại',
            'doituong': 'Cặp đôi',
            'gia': 18900000,
            'mota': 'Cặp nhẫn cưới Royal Eternity được chế tác từ vàng 18K nguyên khối, nhẫn nam viền xước mờ lịch lãm, nhẫn nữ nạm dải kim cương tấm lấp lánh mang ý nghĩa gắn kết trọn đời không rời.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
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
            'danhmuc': 'Mặt Dây Chuyền Đính Kim Cương',
            'chatlieu': 'Bạch Kim Platinum 950',
            'phongcach': 'Sang trọng',
            'doituong': 'Nữ',
            'gia': 22000000,
            'mota': 'Dây chuyền chế tác từ bạch kim Platinum 950 cao cấp với mặt tròn Halo nạm viên kim cương chủ cùng vòng hào quang rực rỡ, phản chiếu ánh sáng kiêu sa dưới mọi góc nhìn.',
            'noibat': 0,
            'anh': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
            ],
            'bienthe': [
                ('HC-NK-42', 'Dây 42cm', 'Kim cương tự nhiên Halo', 22000000, 7),
                ('HC-NK-45', 'Dây 45cm', 'Kim cương tự nhiên Halo', 22800000, 9)
            ]
        },
        {
            'ten': 'Vòng Tay Kim Cương Tennis Diamond Royale',
            'danhmuc': 'Vòng Tay Tennis Diamond',
            'chatlieu': 'Kim Cương & Vàng Trắng 18K',
            'phongcach': 'Sang trọng',
            'doituong': 'Nữ',
            'gia': 68000000,
            'mota': 'Biểu tượng kinh điển của sự xa hoa quý phái: Lắc tay Tennis nạm liền mạch 52 viên kim cương tấm tự nhiên tuyển chọn đồng đều giác cắt Excellent trên nền vàng trắng 18K.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80',
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
            'danhmuc': 'Bông Tai Nụ Halo Kiêu Sa',
            'chatlieu': 'Vàng 18K & Ngọc Trai Biển',
            'phongcach': 'Cổ điển',
            'doituong': 'Nữ',
            'gia': 16500000,
            'mota': 'Đôi bông tai kết hợp giữa vẻ đẹp thuần khiết của ngọc trai biển South Sea 10-11mm ánh xà cừ óng ả và chấu khóa hoa tulip vàng vàng 18K điểm xuyết đá quý lấp lánh.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
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
            'danhmuc': 'Nhẫn Kim Cương & Nhẫn Cưới',
            'chatlieu': 'Vàng 18K & Đá Onyx Đen',
            'phongcach': 'Hiện đại',
            'doituong': 'Nam',
            'gia': 34500000,
            'mota': 'Nhẫn nam dáng Signet quyền lực đúc đặc vàng hồng 18K kết hợp mặt đá Onyx đen bóng huyền bí và viên kim cương chủ 5 ly góc cạnh, khẳng định bản lĩnh của quý ông thành đạt.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
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
            'danhmuc': 'Dây Chuyền Vàng Ý 18K',
            'chatlieu': 'Bạch Kim & Sapphire Xanh',
            'phongcach': 'Cổ điển',
            'doituong': 'Nữ',
            'gia': 45000000,
            'mota': 'Lấy cảm hứng từ trang sức vương thất châu Âu, dây chuyền điểm viên đá Sapphire tự nhiên xanh biển thẳm 3.2 carat được bao bọc bởi dải kim cương kép rực rỡ.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
            ],
            'bienthe': [
                ('SPH-ROYAL-45', 'Dây 45cm', 'Sapphire tự nhiên & Kim Cương', 45000000, 3)
            ]
        },
        {
            'ten': 'Lắc Tay Bạc Ý S925 Tinh Khôi Sparkling Wish',
            'danhmuc': 'Lắc Tay Bạc & Vàng Quý Cô',
            'chatlieu': 'Bạc Ý S925 & Xi Bạch Kim',
            'phongcach': 'Tối giản',
            'doituong': 'Nữ',
            'gia': 1250000,
            'mota': 'Lắc tay bạc Ý xi mạ vàng trắng cao cấp, đính các hạt charm bi tròn và đá Swarovski lấp lánh nhẹ nhàng, phù hợp cho trang phục thường ngày hoặc đi làm văn phòng.',
            'noibat': 0,
            'anh': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'
            ],
            'bienthe': [
                ('S925-BR-FREE', 'Freesize (15-18cm)', 'Đá CZ Áo', 1250000, 40)
            ]
        },
        {
            'ten': 'Bông Tai Kim Cương Drop Grace Chùm Dài',
            'danhmuc': 'Bông Tai Dáng Dài Dạ Hội',
            'chatlieu': 'Kim Cương & Vàng Trắng 18K',
            'phongcach': 'Sang trọng',
            'doituong': 'Nữ',
            'gia': 38000000,
            'mota': 'Đôi hoa tai dáng giọt nước thanh mảnh đung đưa theo từng chuyển động, chế tác từ vàng trắng 18K đính 36 viên kim cương tấm tự nhiên tạo hiệu ứng bắt sáng tối đa.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80'
            ],
            'bienthe': [
                ('DG-ER-WHITE', 'Tiêu chuẩn', 'Kim cương tự nhiên', 38000000, 6)
            ]
        },
        {
            'ten': 'Nhẫn Nữ Ruby Huyết Bồ Câu Passionate',
            'danhmuc': 'Trang Sức Ruby Huyết Bồ Câu',
            'chatlieu': 'Vàng 18K & Đá Ruby Myanmar',
            'phongcach': 'Cổ điển',
            'doituong': 'Nữ',
            'gia': 52000000,
            'mota': 'Viên đá Ruby đỏ thắm giác cắt Oval rực cháy tựa ngọn lửa tình yêu nồng nàn, kết hợp giác cắt kim cương bao quanh tạo nên một kiệt tác trang sức phong thủy mang lại may mắn và quyền uy.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
            ],
            'bienthe': [
                ('RUBY-R-11', 'Size 11', 'Ruby tự nhiên Myanmar', 52000000, 2),
                ('RUBY-R-12', 'Size 12', 'Ruby tự nhiên Myanmar', 52000000, 3)
            ]
        },
        {
            'ten': 'Dây Chuyền Emerald Ngọc Lục Bảo Hoàng Gia',
            'danhmuc': 'Trang Sức Emerald Ngọc Lục Bảo',
            'chatlieu': 'Bạch Kim & Ngọc Lục Bảo Columbia',
            'phongcach': 'Cổ điển',
            'doituong': 'Nữ',
            'gia': 48000000,
            'mota': 'Viên ngọc lục bảo Emerald Columbia thiên nhiên nước xanh mướt hút mắt, chế tác trên ổ chấu bạch kim đính kim cương tấm tôn lên vẻ đẹp vương giả.',
            'noibat': 1,
            'anh': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
            ],
            'bienthe': [
                ('EM-NK-42', 'Dây 42cm', 'Emerald tự nhiên & Kim Cương', 48000000, 4)
            ]
        },
        {
            'ten': 'Nhẫn Nữ Moissanite Cushion Cut Sparkling',
            'danhmuc': 'Nhẫn Nữ Kim Cương Moissanite',
            'chatlieu': 'Vàng Trắng 18K & Đá Moissanite',
            'phongcach': 'Hiện đại',
            'doituong': 'Nữ',
            'gia': 14500000,
            'mota': 'Nhẫn nữ Moissanite giác cắt Cushion 6.5 ly chuẩn nước D, độ phản quang rực rỡ 7 màu kèm chấu 4 trấu thanh thoát, phù hợp với quý cô hiện đại.',
            'noibat': 0,
            'anh': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
            'gallery': [
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
            ],
            'bienthe': [
                ('MOIS-CSH-10', 'Size 10', 'Moissanite nước D 6.5 ly', 14500000, 10),
                ('MOIS-CSH-11', 'Size 11', 'Moissanite nước D 6.5 ly', 14500000, 8)
            ]
        }
    ]

    total_variants = 0
    total_images = 0

    for p in products:
        cursor.execute("SELECT MaSanPham FROM sanpham WHERE TenSanPham = %s", (p['ten'],))
        sp_row = cursor.fetchone()
        cat_id = cat_map.get(p['danhmuc']) or cat_map.get('Nhẫn Kim Cương & Nhẫn Cưới') or list(cat_map.values())[0]

        if not sp_row:
            cursor.execute("""
                INSERT INTO sanpham (TenSanPham, MaDanhMuc, ChatLieu, PhongCach, DoiTuong, GiaCoSo, MoTaChiTiet, LaNoiBat, TrangThai)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'DangBan')
            """, (
                p['ten'], cat_id, p['chatlieu'], p['phongcach'], p['doituong'],
                p['gia'], p['mota'], p.get('noibat', 0)
            ))
            sp_id = cursor.lastrowid
        else:
            sp_id = sp_row['MaSanPham']
            # Cập nhật danh mục chuẩn
            cursor.execute("UPDATE sanpham SET MaDanhMuc = %s, GiaCoSo = %s WHERE MaSanPham = %s", (cat_id, p['gia'], sp_id))

        # Biến thể (bienthesanpham)
        for bt in p['bienthe']:
            cursor.execute("SELECT MaBienThe FROM bienthesanpham WHERE SKU = %s", (bt[0],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO bienthesanpham (MaSanPham, SKU, KichThuocSize, LoaiDa, GiaBan, SoLuongTonKho, HinhAnhBienThe)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (sp_id, bt[0], bt[1], bt[2], bt[3], bt[4], p['anh']))
                total_variants += 1

        # Bộ sưu tập ảnh (hinhanhsanpham)
        for idx, img in enumerate(p['gallery']):
            cursor.execute("SELECT MaHinhAnh FROM hinhanhsanpham WHERE MaSanPham = %s AND DuongDanAnh = %s", (sp_id, img))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO hinhanhsanpham (MaSanPham, DuongDanAnh, ThuTuHienThi)
                    VALUES (%s, %s, %s)
                """, (sp_id, img, idx))
                total_images += 1

    print(f"✓ Hoàn thành seed bảng `sanpham`, `bienthesanpham`, `hinhanhsanpham` ({len(products)} sản phẩm trang sức cao cấp).")

def seed_vouchers(cursor):
    """5. Bảng magiamgia (Mã Giảm Giá)"""
    vouchers = [
        ('AURA2026', 'PERCENT', 10, 500000, 2000000, 100, 5, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
        ('LUXURYVIP', 'PERCENT', 15, 2500000, 15000000, 50, 2, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
        ('GIAM100K', 'FIXED', 100000, 100000, 1000000, 200, 12, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
        ('WELCOME50', 'FIXED', 50000, 50000, 500000, 500, 35, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
    ]
    voucher_map = {}
    for v in vouchers:
        cursor.execute("SELECT MaVoucher FROM magiamgia WHERE MaCode = %s", (v[0],))
        row = cursor.fetchone()
        if row:
            voucher_map[v[0]] = row['MaVoucher']
        else:
            cursor.execute("""
                INSERT INTO magiamgia (MaCode, LoaiGiamGia, GiaTriGiam, GiaTriGiamToiDa, DonHangToiThieu, SoLuongSuDung, SoLuongDaDung, NgayBatDau, NgayKetThuc, TrangThai)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, v)
            voucher_map[v[0]] = cursor.lastrowid

    print(f"✓ Hoàn thành seed bảng `magiamgia` ({len(vouchers)} vouchers khuyến mãi).")
    return voucher_map

def seed_carts(cursor, user_map):
    """6. Bảng giohang & chitietgiohang (Giỏ hàng mẫu cho khách hàng)"""
    khach_id = user_map.get('khachhang')
    if not khach_id:
        return

    cursor.execute("SELECT MaGioHang FROM giohang WHERE MaNguoiDung = %s", (khach_id,))
    row = cursor.fetchone()
    if row:
        cart_id = row['MaGioHang']
    else:
        cursor.execute("INSERT INTO giohang (MaNguoiDung) VALUES (%s)", (khach_id,))
        cart_id = cursor.lastrowid

    # Lấy 2 biến thể sản phẩm đầu tiên để thêm vào giỏ hàng
    cursor.execute("SELECT MaBienThe FROM bienthesanpham LIMIT 2")
    sample_bts = cursor.fetchall()

    for idx, bt in enumerate(sample_bts):
        cursor.execute("SELECT MaChiTietGioHang FROM chitietgiohang WHERE MaGioHang = %s AND MaBienThe = %s", (cart_id, bt['MaBienThe']))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO chitietgiohang (MaGioHang, MaBienThe, SoLuong)
                VALUES (%s, %s, %s)
            """, (cart_id, bt['MaBienThe'], idx + 1))

    print("✓ Hoàn thành seed bảng `giohang` và `chitietgiohang` cho khách hàng.")

def seed_orders(cursor, user_map, voucher_map):
    """7. Bảng donhang & chitietdonhang (Đơn Hàng Mẫu nhiều trạng thái)"""
    khach_id = user_map.get('khachhang')
    tri_id = user_map.get('minhtri')
    if not khach_id or not tri_id:
        return

    cursor.execute("SELECT MaBienThe, GiaBan, MaSanPham FROM bienthesanpham ORDER BY MaBienThe ASC LIMIT 4")
    sample_bts = cursor.fetchall()
    if not sample_bts:
        return

    sample_orders = [
        {
            'code': 'AURA2026101701',
            'user_id': khach_id,
            'voucher_id': None,
            'receiver': 'Lê Hoàng Yến Nhi',
            'phone': '0987654321',
            'address': 'Tầng 15, Vincom Center, 72 Lê Thánh Tôn, Q1, TP.HCM',
            'note': 'Giao hàng giờ hành chính kèm hộp quà nhung',
            'shipping': 0,
            'discount': 0,
            'status': 'DaGiao',
            'payment_method': 'BANK_TRANSFER',
            'payment_status': 'DaThanhToan',
            'items': [
                (sample_bts[0]['MaBienThe'], 'Nhẫn Kim Cương Solitaire Eternal Grace', 'Size 10', 1, sample_bts[0]['GiaBan'])
            ]
        },
        {
            'code': 'AURA2026101702',
            'user_id': tri_id,
            'voucher_id': voucher_map.get('AURA2026'),
            'receiver': 'Trần Minh Trí',
            'phone': '0978999888',
            'address': 'Khu Đô Thị Sala, Phường An Lợi Đông, TP. Thủ Đức, TP.HCM',
            'note': 'Khắc chữ Royal & YN lên lòng nhẫn cưới',
            'shipping': 0,
            'discount': 500000,
            'status': 'DangGiao',
            'payment_method': 'VNPAY',
            'payment_status': 'DaThanhToan',
            'items': [
                (sample_bts[1]['MaBienThe'], 'Cặp Nhẫn Cưới Đôi Royal Eternity', 'Nam 14 - Nữ 10', 1, sample_bts[1]['GiaBan'])
            ]
        },
        {
            'code': 'AURA2026101703',
            'user_id': khach_id,
            'voucher_id': voucher_map.get('GIAM100K'),
            'receiver': 'Lê Hoàng Yến Nhi',
            'phone': '0987654321',
            'address': 'Landmark 81, Vinhomes Central Park, Bình Thạnh, TP.HCM',
            'note': 'Gọi điện trước khi giao hàng 30 phút',
            'shipping': 0,
            'discount': 100000,
            'status': 'DaXacNhan',
            'payment_method': 'BANK_TRANSFER',
            'payment_status': 'DaThanhToan',
            'items': [
                (sample_bts[2]['MaBienThe'], 'Dây Chuyền Mặt Kim Cương Halo Celestial', 'Dây 42cm', 1, sample_bts[2]['GiaBan'])
            ]
        },
        {
            'code': 'AURA2026101704',
            'user_id': tri_id,
            'voucher_id': voucher_map.get('LUXURYVIP'),
            'receiver': 'Trần Minh Trí',
            'phone': '0978999888',
            'address': 'Toà nhà Bitexco Financial, 2 Hải Triều, Q1, TP.HCM',
            'note': 'Đơn hàng giá trị cao cần bảo vệ giao tận tay',
            'shipping': 0,
            'discount': 2500000,
            'status': 'ChoXacNhan',
            'payment_method': 'COD',
            'payment_status': 'ChuaThanhToan',
            'items': [
                (sample_bts[3]['MaBienThe'], 'Vòng Tay Kim Cương Tennis Diamond Royale', 'Size 16cm', 1, sample_bts[3]['GiaBan'])
            ]
        }
    ]

    for ord_info in sample_orders:
        cursor.execute("SELECT MaDonHang FROM donhang WHERE MaDonHangCode = %s", (ord_info['code'],))
        if cursor.fetchone():
            continue

        raw_total = sum(item[3] * float(item[4]) for item in ord_info['items'])
        final_total = max(0.0, raw_total + ord_info['shipping'] - ord_info['discount'])

        cursor.execute("""
            INSERT INTO donhang (
                MaDonHangCode, MaNguoiDung, MaVoucher, TenNguoiNhan, SoDienThoaiNguoiNhan,
                DiaChiGiaoHang, GhiChu, TongTienHang, PhiVanChuyen, SoTienGiam, TongThanhToan,
                TrangThaiDonHang, PhuongThucThanhToan, TrangThaiThanhToan, NgayDatHang
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            ord_info['code'], ord_info['user_id'], ord_info['voucher_id'], ord_info['receiver'],
            ord_info['phone'], ord_info['address'], ord_info['note'], raw_total,
            ord_info['shipping'], ord_info['discount'], final_total,
            ord_info['status'], ord_info['payment_method'], ord_info['payment_status'],
            datetime.now()
        ))
        dh_id = cursor.lastrowid

        for it in ord_info['items']:
            cursor.execute("""
                INSERT INTO chitietdonhang (MaDonHang, MaBienThe, TenSanPhamSnap, KichThuocSnap, SoLuong, DonGia)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (dh_id, it[0], it[1], it[2], it[3], it[4]))

    print(f"✓ Hoàn thành seed bảng `donhang` & `chitietdonhang` ({len(sample_orders)} đơn hàng mẫu nhiều trạng thái).")

def seed_database(reset=False):
    """Quy trình seed dữ liệu đầy đủ khớp 100% database wed_trang_suc.sql"""
    print("=" * 60)
    print("   BẮT ĐẦU SEED DỮ LIỆU CHUẨN CHO DATABASE LUNA BELLE")
    print("=" * 60)

    with get_db() as (cursor, conn):
        if reset:
            reset_tables(cursor)

        seed_roles(cursor)
        user_map = seed_users(cursor)
        cat_map = seed_categories(cursor)
        seed_products(cursor, cat_map)
        voucher_map = seed_vouchers(cursor)
        seed_carts(cursor, user_map)
        seed_orders(cursor, user_map, voucher_map)

    print("=" * 60)
    print("✨ TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ VÀ NẠP THÀNH CÔNG VÀO MYSQL!")
    print("=" * 60)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Seed dữ liệu cho hệ thống website Trang Sức")
    parser.add_argument('--reset', '--fresh', action='store_true', help="Xóa sạch dữ liệu cũ và nạp mới hoàn toàn")
    args = parser.parse_args()

    seed_database(reset=args.reset)
