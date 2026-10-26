import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Initial Data (Đồng bộ với DB TrangSuc & seed_data.py)
export const MOCK_CATEGORIES = [
  {
    MaDanhMuc: 1,
    TenDanhMuc: 'Nhẫn Kim Cương & Cưới',
    Slug: 'nhan-kim-cuong',
    AnhDaiDien: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    MoTa: 'Bộ sưu tập nhẫn đính hôn, nhẫn cưới và nhẫn kim cương tự nhiên đẳng cấp.',
    children: [
      { MaDanhMuc: 6, TenDanhMuc: 'Nhẫn Cầu Hôn Solitaire', Slug: 'nhan-cau-hon-solitaire' },
      { MaDanhMuc: 7, TenDanhMuc: 'Nhẫn Cưới Uyên Ương', Slug: 'nhan-cuoi-cap' },
      { MaDanhMuc: 8, TenDanhMuc: 'Nhẫn Nữ Moissanite', Slug: 'nhan-moissanite' }
    ]
  },
  {
    MaDanhMuc: 2,
    TenDanhMuc: 'Dây Chuyền & Mặt Dây',
    Slug: 'day-chuyen-mat-day',
    AnhDaiDien: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    MoTa: 'Dây chuyền vàng 18K, bạch kim phối kim cương và đá quý tinh xảo.',
    children: [
      { MaDanhMuc: 9, TenDanhMuc: 'Dây Chuyền Vàng Ý 18K', Slug: 'day-chuyen-vang-18k' },
      { MaDanhMuc: 10, TenDanhMuc: 'Mặt Dây Đính Kim Cương', Slug: 'mat-day-kim-cuong' }
    ]
  },
  {
    MaDanhMuc: 3,
    TenDanhMuc: 'Vòng Tay & Lắc',
    Slug: 'vong-tay-lac',
    AnhDaiDien: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
    MoTa: 'Vòng tay Tennis, lắc bạc Ý và lắc vàng tôn vinh cổ tay phái đẹp.',
    children: [
      { MaDanhMuc: 11, TenDanhMuc: 'Vòng Tay Tennis Diamond', Slug: 'vong-tay-tennis' },
      { MaDanhMuc: 12, TenDanhMuc: 'Lắc Tay Quý Cô', Slug: 'lac-tay-quy-co' }
    ]
  },
  {
    MaDanhMuc: 4,
    TenDanhMuc: 'Bông Tai Quý Phái',
    Slug: 'bong-tai',
    AnhDaiDien: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    MoTa: 'Hoa tai kim cương, ngọc trai biển sâu kiêu sa cho mọi dịp tiệc tùng.',
    children: [
      { MaDanhMuc: 13, TenDanhMuc: 'Bông Tai Nụ Halo', Slug: 'bong-tai-nu-halo' },
      { MaDanhMuc: 14, TenDanhMuc: 'Bông Tai Dáng Dài Dạ Hội', Slug: 'bong-tai-dang-dai' }
    ]
  },
  {
    MaDanhMuc: 5,
    TenDanhMuc: 'Bộ Sưu Tập Hoàng Gia',
    Slug: 'bo-suu-tap-hoang-gia',
    AnhDaiDien: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    MoTa: 'Tuyệt tác trang sức đá quý Ruby, Sapphire và Emerald giới hạn.',
    children: [
      { MaDanhMuc: 15, TenDanhMuc: 'Trang Sức Ruby Huyết Bồ Câu', Slug: 'trang-suc-ruby-hoang-gia' },
      { MaDanhMuc: 16, TenDanhMuc: 'Trang Sức Emerald Lục Bảo', Slug: 'trang-suc-emerald-hoang-gia' }
    ]
  }
];

export const MOCK_PRODUCTS = [
  {
    MaSanPham: 1,
    TenSanPham: 'Nhẫn Kim Cương Solitaire Eternal Grace',
    Slug: 'nhan-kim-cuong-solitaire-eternal-grace',
    CatSlug: 'nhan-kim-cuong',
    TenDanhMuc: 'Nhẫn Kim Cương & Cưới',
    ChatLieu: 'Kim Cương GIA',
    PhongCach: 'Sang trọng',
    DoiTuong: 'Nữ',
    GiaCoSo: 28500000,
    GiaMin: 28500000,
    GiaMax: 32000000,
    HinhAnhChinh: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'
    ],
    LaNoiBat: 1,
    TongBan: 24,
    TongTonKho: 35,
    MoTa: 'Nhẫn đính hôn Solitaire Eternal Grace sở hữu viên kim cương chủ chuẩn kiểm định GIA 4.5 ly nước F, độ sạch VVS1 gắn trên chấu 6 trấu kinh điển bằng vàng trắng 750 (18K). Thiết kế thanh thoát tôn vinh vẻ đẹp vĩnh cửu của tình yêu đôi lứa.',
    bienthe: [
      { MaBienThe: 101, TenBienThe: 'Size 10 - Vàng Trắng 18K', GiaBan: 28500000, SoLuongTonKho: 8 },
      { MaBienThe: 102, TenBienThe: 'Size 11 - Vàng Trắng 18K', GiaBan: 28500000, SoLuongTonKho: 12 },
      { MaBienThe: 103, TenBienThe: 'Size 12 - Vàng Hồng Rose Gold', GiaBan: 29500000, SoLuongTonKho: 6 }
    ]
  },
  {
    MaSanPham: 2,
    TenSanPham: 'Dây Chuyền Mặt Tim Royal Romance Moissanite',
    Slug: 'day-chuyen-mat-tim-royal-romance',
    CatSlug: 'day-chuyen-mat-day',
    TenDanhMuc: 'Dây Chuyền & Mặt Dây',
    ChatLieu: 'Vàng 18K & Moissanite',
    PhongCach: 'Lãng mạn',
    DoiTuong: 'Nữ',
    GiaCoSo: 16800000,
    GiaMin: 16800000,
    GiaMax: 18500000,
    HinhAnhChinh: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    LaNoiBat: 1,
    TongBan: 38,
    TongTonKho: 22,
    MoTa: 'Mặt dây chuyền hình trái tim giác cắt trái tim Heart Cut 2 carat Moissanite nước D tinh khiết, viền đá tấm hào quang lấp lánh phản chiếu ánh sáng kiêu sa.',
    bienthe: [
      { MaBienThe: 104, TenBienThe: 'Dây 42cm - Vàng Hồng 18K', GiaBan: 16800000, SoLuongTonKho: 12 },
      { MaBienThe: 105, TenBienThe: 'Dây 45cm - Vàng Trắng 18K', GiaBan: 17500000, SoLuongTonKho: 10 }
    ]
  },
  {
    MaSanPham: 3,
    TenSanPham: 'Vòng Tay Tennis Diamond Riviera Sparkle',
    Slug: 'vong-tay-tennis-diamond-riviera',
    CatSlug: 'vong-tay-lac',
    TenDanhMuc: 'Vòng Tay & Lắc',
    ChatLieu: 'Kim Cương & Bạch Kim',
    PhongCach: 'Đẳng cấp',
    DoiTuong: 'Unisex',
    GiaCoSo: 45000000,
    GiaMin: 45000000,
    GiaMax: 52000000,
    HinhAnhChinh: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80'
    ],
    LaNoiBat: 1,
    TongBan: 18,
    TongTonKho: 15,
    MoTa: 'Biểu tượng của sự quyền quý với dải 55 viên kim cương liên kết liền mạch chuẩn giác cắt Round Brilliant trên nền ổ chấu 4 chấu chắc chắn bằng Platinum 950.',
    bienthe: [
      { MaBienThe: 106, TenBienThe: 'Cỡ 16cm - Bạch Kim Pt950', GiaBan: 45000000, SoLuongTonKho: 5 },
      { MaBienThe: 107, TenBienThe: 'Cỡ 17.5cm - Vàng Trắng 18K', GiaBan: 48000000, SoLuongTonKho: 7 }
    ]
  },
  {
    MaSanPham: 4,
    TenSanPham: 'Bông Tai Ngọc Trai Biển South Sea Empress',
    Slug: 'bong-tai-ngoc-trai-south-sea-empress',
    CatSlug: 'bong-tai',
    TenDanhMuc: 'Bông Tai Quý Phái',
    ChatLieu: 'Ngọc Trai South Sea & Vàng 18K',
    PhongCach: 'Quý phái',
    DoiTuong: 'Nữ',
    GiaCoSo: 22000000,
    GiaMin: 22000000,
    GiaMax: 24500000,
    HinhAnhChinh: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    LaNoiBat: 1,
    TongBan: 14,
    TongTonKho: 18,
    MoTa: 'Cặp ngọc trai tự nhiên South Sea ánh vàng kim vương giả kích thước 11mm hoàn hảo kết hợp chấu vương miện đính kim cương nước D.',
    bienthe: [
      { MaBienThe: 108, TenBienThe: 'Vàng Hồng 18K - Ngọc Ánh Vàng', GiaBan: 22000000, SoLuongTonKho: 8 },
      { MaBienThe: 109, TenBienThe: 'Vàng Trắng 18K - Ngọc Trắng Bạc', GiaBan: 24500000, SoLuongTonKho: 10 }
    ]
  },
  {
    MaSanPham: 5,
    TenSanPham: 'Nhẫn Nam Hoàng Đế Emerald Signet Ring',
    Slug: 'nhan-nam-emerald-signet-ring',
    CatSlug: 'bo-suu-tap-hoang-gia',
    TenDanhMuc: 'Bộ Sưu Tập Hoàng Gia',
    ChatLieu: 'Đá Quý Emerald & Vàng Vàng 18K',
    PhongCach: 'Quyền lực',
    DoiTuong: 'Nam',
    GiaCoSo: 58000000,
    GiaMin: 58000000,
    GiaMax: 65000000,
    HinhAnhChinh: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    LaNoiBat: 0,
    TongBan: 9,
    TongTonKho: 8,
    MoTa: 'Viên ngọc lục bảo Colombia 3.2 carat màu xanh lục bảo sâu thẳm, giác cắt Emerald Cut kinh điển trên đai nhẫn chạm khắc vân hoàng gia đúc đặc vàng 18K.',
    bienthe: [
      { MaBienThe: 110, TenBienThe: 'Size 18 - Vàng Vàng 18K', GiaBan: 58000000, SoLuongTonKho: 4 },
      { MaBienThe: 111, TenBienThe: 'Size 19 - Vàng Vàng 18K', GiaBan: 58000000, SoLuongTonKho: 4 }
    ]
  },
  {
    MaSanPham: 6,
    TenSanPham: 'Bộ Nhẫn Cưới Cặp Eternal Harmony',
    Slug: 'bo-nhan-cuoi-cap-eternal-harmony',
    CatSlug: 'nhan-kim-cuong',
    TenDanhMuc: 'Nhẫn Kim Cương & Cưới',
    ChatLieu: 'Vàng Trắng & Vàng Hồng 18K',
    PhongCach: 'Tối giản',
    DoiTuong: 'Cặp đôi',
    GiaCoSo: 19500000,
    GiaMin: 19500000,
    GiaMax: 21000000,
    HinhAnhChinh: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'
    ],
    LaNoiBat: 1,
    TongBan: 42,
    TongTonKho: 26,
    MoTa: 'Cặp nhẫn cưới phối 2 màu vàng trắng và vàng hồng tạo điểm nhấn đan quyện, nhẫn nữ gắn viên kim cương chủ 2.5 ly.',
    bienthe: [
      { MaBienThe: 112, TenBienThe: 'Cặp Nam 18 + Nữ 11', GiaBan: 19500000, SoLuongTonKho: 12 },
      { MaBienThe: 113, TenBienThe: 'Cặp Nam 19 + Nữ 12', GiaBan: 19500000, SoLuongTonKho: 14 }
    ]
  }
];

export const MOCK_VOUCHERS = [
  {
    MaGiamGia: 1,
    MaCode: 'LUNA500',
    MoTa: 'Giảm 500.000₫ cho đơn hàng trang sức từ 5 triệu',
    GiaTriGiam: 500000,
    GiaTriDonToiThieu: 5000000,
    LoaiGiamGia: 'TienMat',
  },
  {
    MaGiamGia: 2,
    MaCode: 'VIPROYAL',
    MoTa: 'Giảm 1.500.000₫ cho đơn hàng kim cương từ 25 triệu',
    GiaTriGiam: 1500000,
    GiaTriDonToiThieu: 25000000,
    LoaiGiamGia: 'TienMat',
  },
  {
    MaGiamGia: 3,
    MaCode: 'FREESHIP',
    MoTa: 'Miễn phí giao hàng hỏa tốc bảo hiểm toàn quốc',
    GiaTriGiam: 100000,
    GiaTriDonToiThieu: 2000000,
    LoaiGiamGia: 'TienMat',
  }
];

export const formatCurrency = (val) => {
  if (val == null) return '0 ₫';
  return Number(val).toLocaleString('vi-VN') + ' ₫';
};
