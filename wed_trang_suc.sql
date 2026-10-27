
DROP TABLE IF EXISTS `vaitro`;
CREATE TABLE `vaitro` (
  `MaVaiTro` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `TenVaiTro` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MoTa` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaVaiTro`),
  UNIQUE KEY `TenVaiTro` (`TenVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `vaitro` WRITE;
INSERT INTO `vaitro` VALUES 
(1,'ADMIN','Quản trị viên hệ thống'),
(2,'STAFF','Nhân viên bán hàng/kho'),
(3,'CUSTOMER','Khách hàng mua sắm');
UNLOCK TABLES;

--
-- Table structure for table `nguoidung`
--

DROP TABLE IF EXISTS `nguoidung`;
CREATE TABLE `nguoidung` (
  `MaNguoiDung` int NOT NULL AUTO_INCREMENT,
  `MaVaiTro` tinyint unsigned NOT NULL,
  `TenDangNhap` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MatKhauMaHoa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `NgayCapNhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaNguoiDung`),
  UNIQUE KEY `TenDangNhap` (`TenDangNhap`),
  UNIQUE KEY `Email` (`Email`),
  KEY `FK_NguoiDung_VaiTro` (`MaVaiTro`),
  CONSTRAINT `FK_NguoiDung_VaiTro` FOREIGN KEY (`MaVaiTro`) REFERENCES `vaitro` (`MaVaiTro`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `nguoidung` WRITE;
INSERT INTO `nguoidung` VALUES 
(1,1,'admin','scrypt:32768:8:1$q7aqw6nAAP4FxXpN$7dd65efe80a4206531b0a9597ab449d6e1c85392504a8d518f272d77721c14adcab8398e8c6a76ffd9cba9a369900a8da46697a60a58b54004385ff1c5391295','Quản Trị Viên Cao Cấp','admin@aurajewelry.vn','0901234567','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(2,2,'nhanvien','scrypt:32768:8:1$eMaUyWiBHwbqYYLj$af7b18cfa40de5748e85154f6db5b6ab2a3ce6cd11caa8de8d5d25cb2de0c0fe501431dfcdc4f6cabf035fcf4cb5822350a9294c8e9740b51d69a2bec0e454b9','Nguyễn Văn Nhân Viên','staff@aurajewelry.vn','0912345678','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(3,3,'khachhang','scrypt:32768:8:1$s6TWXCWWOPm8cbCE$d5456a91d4f9bbb94a9ee0dcb6bf9c5b7f6a81a590fd6b08323a63b028073ede9596ef71f857765dbb80696af13b60e445afd6bc5e853ef974491362bf32cc90','Lê Hoàng Yến Nhi','yennhi@gmail.com','0987654321','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(4,3,'minhtri','scrypt:32768:8:1$CAAnXhMEyV6xQitX$99f4f9eea4fd3a89a87f9a5954702eea2ae2f4c3b22a49724dd31747d7573cee08ad16d8a16208774424cfe03a6441d5a200fce34166730ae84476a66c6b0a5c','Trần Minh Trí','minhtri@gmail.com','0978999888','2026-10-17 22:41:11','2026-10-17 22:41:11');
UNLOCK TABLES;

--
-- Table structure for table `danhmuc`
--

DROP TABLE IF EXISTS `danhmuc`;
CREATE TABLE `danhmuc` (
  `MaDanhMuc` int NOT NULL AUTO_INCREMENT,
  `TenDanhMuc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaDanhMucCha` int DEFAULT NULL,
  `MoTa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaDanhMuc`),
  KEY `FK_DanhMuc_Cha` (`MaDanhMucCha`),
  CONSTRAINT `FK_DanhMuc_Cha` FOREIGN KEY (`MaDanhMucCha`) REFERENCES `danhmuc` (`MaDanhMuc`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
CREATE TABLE `sanpham` (
  `MaSanPham` int NOT NULL AUTO_INCREMENT,
  `TenSanPham` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaDanhMuc` int NOT NULL,
  `ChatLieu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhongCach` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DoiTuong` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GiaCoSo` decimal(12,2) NOT NULL,
  `MoTaChiTiet` text COLLATE utf8mb4_unicode_ci,
  `LaNoiBat` tinyint(1) DEFAULT '0',
  `TrangThai` enum('DangBan','NgungBan','HetHang') COLLATE utf8mb4_unicode_ci DEFAULT 'DangBan',
  `NgayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `NgayCapNhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaSanPham`),
  KEY `FK_SanPham_DanhMuc` (`MaDanhMuc`),
  CONSTRAINT `FK_SanPham_DanhMuc` FOREIGN KEY (`MaDanhMuc`) REFERENCES `danhmuc` (`MaDanhMuc`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `sanpham_chk_1` CHECK ((`GiaCoSo` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `bienthesanpham`
--

DROP TABLE IF EXISTS `bienthesanpham`;
CREATE TABLE `bienthesanpham` (
  `MaBienThe` int NOT NULL AUTO_INCREMENT,
  `MaSanPham` int NOT NULL,
  `SKU` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `KichThuocSize` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LoaiDa` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GiaBan` decimal(12,2) NOT NULL,
  `SoLuongTonKho` int NOT NULL DEFAULT '0',
  `HinhAnhBienThe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaBienThe`),
  UNIQUE KEY `SKU` (`SKU`),
  KEY `FK_BienThe_SanPham` (`MaSanPham`),
  CONSTRAINT `FK_BienThe_SanPham` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bienthesanpham_chk_1` CHECK ((`GiaBan` >= 0)),
  CONSTRAINT `bienthesanpham_chk_2` CHECK ((`SoLuongTonKho` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `hinhanhsanpham`
--

DROP TABLE IF EXISTS `hinhanhsanpham`;
CREATE TABLE `hinhanhsanpham` (
  `MaHinhAnh` int NOT NULL AUTO_INCREMENT,
  `MaSanPham` int NOT NULL,
  `DuongDanAnh` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ThuTuHienThi` tinyint unsigned DEFAULT '0',
  PRIMARY KEY (`MaHinhAnh`),
  KEY `FK_HinhAnh_SanPham` (`MaSanPham`),
  CONSTRAINT `FK_HinhAnh_SanPham` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `magiamgia`
--

DROP TABLE IF EXISTS `magiamgia`;
CREATE TABLE `magiamgia` (
  `MaVoucher` int NOT NULL AUTO_INCREMENT,
  `MaCode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LoaiGiamGia` enum('PERCENT','FIXED') COLLATE utf8mb4_unicode_ci DEFAULT 'PERCENT',
  `GiaTriGiam` decimal(12,2) NOT NULL,
  `GiaTriGiamToiDa` decimal(12,2) DEFAULT NULL,
  `DonHangToiThieu` decimal(12,2) DEFAULT '0.00',
  `SoLuongSuDung` int DEFAULT '100',
  `SoLuongDaDung` int DEFAULT '0',
  `NgayBatDau` datetime NOT NULL,
  `NgayKetThuc` datetime NOT NULL,
  `TrangThai` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`MaVoucher`),
  UNIQUE KEY `MaCode` (`MaCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `giohang`
--

DROP TABLE IF EXISTS `giohang`;
CREATE TABLE `giohang` (
  `MaGioHang` int NOT NULL AUTO_INCREMENT,
  `MaNguoiDung` int NOT NULL,
  `NgayCapNhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaGioHang`),
  UNIQUE KEY `MaNguoiDung` (`MaNguoiDung`),
  CONSTRAINT `FK_GioHang_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chitietgiohang`
--

DROP TABLE IF EXISTS `chitietgiohang`;
CREATE TABLE `chitietgiohang` (
  `MaChiTietGioHang` int NOT NULL AUTO_INCREMENT,
  `MaGioHang` int NOT NULL,
  `MaBienThe` int NOT NULL,
  `SoLuong` smallint unsigned DEFAULT '1',
  PRIMARY KEY (`MaChiTietGioHang`),
  KEY `FK_CTGH_GioHang` (`MaGioHang`),
  KEY `FK_CTGH_BienThe` (`MaBienThe`),
  CONSTRAINT `FK_CTGH_BienThe` FOREIGN KEY (`MaBienThe`) REFERENCES `bienthesanpham` (`MaBienThe`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_CTGH_GioHang` FOREIGN KEY (`MaGioHang`) REFERENCES `giohang` (`MaGioHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chitietgiohang_chk_1` CHECK ((`SoLuong` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `donhang`
--

DROP TABLE IF EXISTS `donhang`;
CREATE TABLE `donhang` (
  `MaDonHang` int NOT NULL AUTO_INCREMENT,
  `MaDonHangCode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaNguoiDung` int NOT NULL,
  `MaVoucher` int DEFAULT NULL,
  `TenNguoiNhan` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoaiNguoiNhan` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DiaChiGiaoHang` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TongTienHang` decimal(12,2) NOT NULL,
  `PhiVanChuyen` decimal(10,2) DEFAULT '0.00',
  `SoTienGiam` decimal(12,2) DEFAULT '0.00',
  `TongThanhToan` decimal(12,2) NOT NULL,
  `TrangThaiDonHang` enum('ChoXacNhan','DaXacNhan','DangGiao','DaGiao','DaHuy') COLLATE utf8mb4_unicode_ci DEFAULT 'ChoXacNhan',
  `PhuongThucThanhToan` enum('COD','VNPAY','MOMO','BANK_TRANSFER') COLLATE utf8mb4_unicode_ci DEFAULT 'COD',
  `TrangThaiThanhToan` enum('ChuaThanhToan','DaThanhToan','HoanTien') COLLATE utf8mb4_unicode_ci DEFAULT 'ChuaThanhToan',
  `NgayDatHang` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaDonHang`),
  UNIQUE KEY `MaDonHangCode` (`MaDonHangCode`),
  KEY `FK_DonHang_NguoiDung` (`MaNguoiDung`),
  KEY `FK_DonHang_Voucher` (`MaVoucher`),
  CONSTRAINT `FK_DonHang_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_DonHang_Voucher` FOREIGN KEY (`MaVoucher`) REFERENCES `magiamgia` (`MaVoucher`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donhang_chk_1` CHECK ((`TongThanhToan` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `chitietdonhang`
--

DROP TABLE IF EXISTS `chitietdonhang`;
CREATE TABLE `chitietdonhang` (
  `MaChiTietDonHang` int NOT NULL AUTO_INCREMENT,
  `MaDonHang` int NOT NULL,
  `MaBienThe` int NOT NULL,
  `TenSanPhamSnap` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `KichThuocSnap` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SoLuong` smallint unsigned NOT NULL,
  `DonGia` decimal(12,2) NOT NULL,
  PRIMARY KEY (`MaChiTietDonHang`),
  KEY `FK_CTDH_DonHang` (`MaDonHang`),
  KEY `FK_CTDH_BienThe` (`MaBienThe`),
  CONSTRAINT `FK_CTDH_BienThe` FOREIGN KEY (`MaBienThe`) REFERENCES `bienthesanpham` (`MaBienThe`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_CTDH_DonHang` FOREIGN KEY (`MaDonHang`) REFERENCES `donhang` (`MaDonHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chitietdonhang_chk_1` CHECK ((`SoLuong` > 0)),
  CONSTRAINT `chitietdonhang_chk_2` CHECK ((`DonGia` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
