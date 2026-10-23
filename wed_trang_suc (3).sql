-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
-- Host: localhost    Database: wed_trang_suc
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `vaitro`
--

DROP TABLE IF EXISTS `vaitro`;
CREATE TABLE `vaitro` (
  `MaVaiTro` int NOT NULL AUTO_INCREMENT,
  `TenVaiTro` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MoTa` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- (Đã gộp thông tin địa chỉ mặc định từ diachinguoidung)
--

DROP TABLE IF EXISTS `nguoidung`;
CREATE TABLE `nguoidung` (
  `MaNguoiDung` int NOT NULL AUTO_INCREMENT,
  `MaVaiTro` int NOT NULL,
  `TenDangNhap` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MatKhauMaHoa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TinhThanh` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `QuanHuyen` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PhuongXa` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DiaChiChiTiet` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
(1,1,'admin','scrypt:32768:8:1$q7aqw6nAAP4FxXpN$7dd65efe80a4206531b0a9597ab449d6e1c85392504a8d518f272d77721c14adcab8398e8c6a76ffd9cba9a369900a8da46697a60a58b54004385ff1c5391295','Quản Trị Viên Cao Cấp','admin@aurajewelry.vn','0901234567',NULL,NULL,NULL,NULL,'2026-10-17 22:41:11','2026-10-17 22:41:11'),
(2,2,'nhanvien','scrypt:32768:8:1$eMaUyWiBHwbqYYLj$af7b18cfa40de5748e85154f6db5b6ab2a3ce6cd11caa8de8d5d25cb2de0c0fe501431dfcdc4f6cabf035fcf4cb5822350a9294c8e9740b51d69a2bec0e454b9','Nguyễn Văn Nhân Viên','staff@aurajewelry.vn','0912345678',NULL,NULL,NULL,NULL,'2026-10-17 22:41:11','2026-10-17 22:41:11'),
(3,3,'khachhang','scrypt:32768:8:1$s6TWXCWWOPm8cbCE$d5456a91d4f9bbb94a9ee0dcb6bf9c5b7f6a81a590fd6b08323a63b028073ede9596ef71f857765dbb80696af13b60e445afd6bc5e853ef974491362bf32cc90','Lê Hoàng Yến Nhi','yennhi@gmail.com','0987654321','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','Tầng 15, Vincom Center, 72 Lê Thánh Tôn','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(4,3,'minhtri','scrypt:32768:8:1$CAAnXhMEyV6xQitX$99f4f9eea4fd3a89a87f9a5954702eea2ae2f4c3b22a49724dd31747d7573cee08ad16d8a16208774424cfe03a6441d5a200fce34166730ae84476a66c6b0a5c','Trần Minh Trí','minhtri@gmail.com','0978999888',NULL,NULL,NULL,NULL,'2026-10-17 22:41:11','2026-10-17 22:41:11');
UNLOCK TABLES;

--
-- Table structure for table `danhmuc`
--

DROP TABLE IF EXISTS `danhmuc`;
CREATE TABLE `danhmuc` (
  `MaDanhMuc` int NOT NULL AUTO_INCREMENT,
  `TenDanhMuc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaDanhMucCha` int DEFAULT NULL,
  `MoTa` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`MaDanhMuc`),
  UNIQUE KEY `Slug` (`Slug`),
  KEY `FK_DanhMuc_Cha` (`MaDanhMucCha`),
  CONSTRAINT `FK_DanhMuc_Cha` FOREIGN KEY (`MaDanhMucCha`) REFERENCES `danhmuc` (`MaDanhMuc`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `danhmuc` WRITE;
INSERT INTO `danhmuc` VALUES 
(1,'Nhẫn Kim Cương & Nhẫn Cưới','nhan-kim-cuong',NULL,'Bộ sưu tập nhẫn đính hôn, nhẫn cưới và nhẫn kim cương tự nhiên đẳng cấp.'),
(2,'Dây Chuyền & Mặt Dây','day-chuyen-mat-day',NULL,'Dây chuyền vàng 18K, bạch kim phối kim cương và đá quý tinh xảo.'),
(3,'Vòng Tay & Lắc','vong-tay-lac',NULL,'Vòng tay Tennis, lắc bạc Ý và lắc vàng tôn vinh cổ tay phái đẹp.'),
(4,'Bông Tai Quý Phái','bong-tai',NULL,'Hoa tai kim cương, ngọc trai biển sâu kiêu sa cho mọi dịp tiệc tùng.'),
(5,'Bộ Sưu Tập Hoàng Gia','bo-suu-tap-hoang-gia',NULL,'Tuyệt tác trang sức đá quý Ruby, Sapphire và Emerald giới hạn.');
UNLOCK TABLES;

--
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
CREATE TABLE `sanpham` (
  `MaSanPham` int NOT NULL AUTO_INCREMENT,
  `TenSanPham` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaDanhMuc` int NOT NULL,
  `ChatLieu` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhongCach` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DoiTuong` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GiaCoSo` decimal(18,2) NOT NULL,
  `MoTaChiTiet` text COLLATE utf8mb4_unicode_ci,
  `LaNoiBat` tinyint(1) DEFAULT '0',
  `TrangThai` enum('DangBan','NgungBan','HetHang') COLLATE utf8mb4_unicode_ci DEFAULT 'DangBan',
  `NgayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `NgayCapNhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaSanPham`),
  UNIQUE KEY `Slug` (`Slug`),
  KEY `FK_SanPham_DanhMuc` (`MaDanhMuc`),
  CONSTRAINT `FK_SanPham_DanhMuc` FOREIGN KEY (`MaDanhMuc`) REFERENCES `danhmuc` (`MaDanhMuc`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `sanpham_chk_1` CHECK ((`GiaCoSo` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `sanpham` WRITE;
INSERT INTO `sanpham` VALUES 
(1,'Nhẫn Kim Cương Solitaire Eternal Grace','nhan-kim-cuong-solitaire-eternal-grace',1,'Kim Cương','Sang trọng','Nữ',28500000.00,'Nhẫn đính hôn Solitaire Eternal Grace sở hữu viên kim cương chủ chuẩn kiểm định GIA 4.5 ly nước F, độ sạch VVS1 gắn trên chấu 6 trấu kinh điển bằng vàng trắng 750 (18K). Thiết kế thanh thoát tôn vinh vẻ đẹp vĩnh cửu của tình yêu đôi lứa.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 23:35:59'),
(2,'Cặp Nhẫn Cưới Đôi Royal Eternity','cap-nhan-cuoi-doi-royal-eternity',1,'Vàng 18K','Hiện đại','Cặp đôi',18900000.00,'Cặp nhẫn cưới Royal Eternity được chế tác từ vàng 18K nguyên khối, nhẫn nam viền xước mờ lịch lãm, nhẫn nữ nạm dải kim cương tấm lấp lánh mang ý nghĩa gắn kết trọn đời không rời.',1,'DangBan','2026-10-17 22:41:11','2026-10-18 03:54:15'),
(3,'Dây Chuyền Mặt Kim Cương Halo Celestial','day-chuyen-mat-kim-cuong-halo-celestial',2,'Bạch Kim','Sang trọng','Nữ',22000000.00,'Dây chuyền chế tác từ bạch kim Platinum 950 cao cấp với mặt tròn Halo nạm viên kim cương chủ cùng vòng hào quang rực rỡ, phản chiếu ánh sáng kiêu sa dưới mọi góc nhìn.',0,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(4,'Vòng Tay Kim Cương Tennis Diamond Royale','vong-tay-kim-cuong-tennis-diamond-royale',3,'Kim Cương','Sang trọng','Nữ',68000000.00,'Biểu tượng kinh điển của sự xa hoa quý phái: Lắc tay Tennis nạm liền mạch 52 viên kim cương tấm tự nhiên tuyển chọn đồng đều giác cắt Excellent trên nền vàng trắng 18K.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(5,'Bông Tai Ngọc Trai South Sea Dát Vàng 18K','bong-tai-ngoc-trai-south-sea-dat-vang-18k',4,'Vàng 18K','Cổ điển','Nữ',16500000.00,'Đôi bông tai kết hợp giữa vẻ đẹp thuần khiết của ngọc trai biển South Sea 10-11mm ánh xà cừ óng ả và chấu khóa hoa tulip vàng vàng 18K điểm xuyết đá quý lấp lánh.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(6,'Nhẫn Nam Kim Cương Signet Black Onyx','nhan-nam-kim-cuong-signet-black-onyx',1,'Vàng 18K','Hiện đại','Nam',34500000.00,'Nhẫn nam dáng Signet quyền lực đúc đặc vàng hồng 18K kết hợp mặt đá Onyx đen bóng huyền bí và viên kim cương chủ 5 ly góc cạnh, khẳng định bản lĩnh của quý ông thành đạt.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 23:34:59'),
(7,'Dây Chuyền Đá Sapphire Hoàng Gia Vương Triều','day-chuyen-da-sapphire-hoang-gia-vuong-trieu',2,'Bạch Kim','Cổ điển','Nữ',45000000.00,'Lấy cảm hứng từ trang sức vương thất châu Âu, dây chuyền điểm viên đá Sapphire tự nhiên xanh biển thẳm 3.2 carat được bao bọc bởi dải kim cương kép rực rỡ.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(8,'Lắc Tay Bạc Ý S925 Tinh Khôi Sparkling Wish','lac-tay-bac-y-s925-tinh-khoi-sparkling-wish',3,'Bạc S925','Tối giản','Nữ',1250000.00,'Lắc tay bạc Ý xi mạ vàng trắng cao cấp, đính các hạt charm bi tròn và đá Swarovski lấp lánh nhẹ nhàng, phù hợp cho trang phục thường ngày hoặc đi làm văn phòng.',0,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(9,'Bông Tai Kim Cương Drop Grace Chùm Dài','bong-tai-kim-cuong-drop-grace-chum-dai',4,'Kim Cương','Sang trọng','Nữ',38000000.00,'Đôi hoa tai dáng giọt nước thanh mảnh đung đưa theo từng chuyển động, chế tác từ vàng trắng 18K đính 36 viên kim cương tấm tự nhiên tạo hiệu ứng bắt sáng tối đa.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),
(10,'Nhẫn Nữ Ruby Huyết Bồ Câu Passionate','nhan-nu-ruby-huyet-bo-cau-passionate',5,'Vàng 18K','Cổ điển','Nữ',52000000.00,'Viên đá Ruby đỏ thắm giác cắt Oval rực cháy tựa ngọn lửa tình yêu nồng nàn, kết hợp giác cắt kim cương bao quanh tạo nên một kiệt tác trang sức phong thủy mang lại may mắn và quyền uy.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11');
UNLOCK TABLES;

--
-- Table structure for table `bienthesanpham`
--

DROP TABLE IF EXISTS `bienthesanpham`;
CREATE TABLE `bienthesanpham` (
  `MaBienThe` int NOT NULL AUTO_INCREMENT,
  `MaSanPham` int NOT NULL,
  `SKU` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `KichThuocSize` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LoaiDa` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GiaBan` decimal(18,2) NOT NULL,
  `SoLuongTonKho` int NOT NULL DEFAULT '0',
  `HinhAnhBienThe` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaBienThe`),
  UNIQUE KEY `SKU` (`SKU`),
  KEY `FK_BienThe_SanPham` (`MaSanPham`),
  CONSTRAINT `FK_BienThe_SanPham` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bienthesanpham_chk_1` CHECK ((`GiaBan` >= 0)),
  CONSTRAINT `bienthesanpham_chk_2` CHECK ((`SoLuongTonKho` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `bienthesanpham` WRITE;
INSERT INTO `bienthesanpham` VALUES 
(1,1,'EG-R-10','Size 10','Kim cương tự nhiên GIA',28500000.00,8,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),
(2,1,'EG-R-11','Size 11','Kim cương tự nhiên GIA',28500000.00,12,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),
(3,1,'EG-R-12','Size 12','Kim cương tự nhiên GIA',29000000.00,5,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),
(4,1,'EG-R-10-MOIS','Size 10','Kim cương Moissanite',12500000.00,15,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),
(5,2,'RE-PAIR-11-14','Nam 14 - Nữ 10','Kim cương tấm tự nhiên',18900000.00,6,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'),
(6,2,'RE-PAIR-12-15','Nam 15 - Nữ 11','Kim cương tấm tự nhiên',19200000.00,4,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'),
(7,2,'RE-PAIR-13-16','Nam 16 - Nữ 12','Kim cương tấm tự nhiên',19500000.00,5,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'),
(8,3,'HC-NK-42','Dây 42cm','Kim cương tự nhiên',22000000.00,7,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'),
(9,3,'HC-NK-45','Dây 45cm','Kim cương tự nhiên',22800000.00,9,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'),
(10,4,'TD-BR-16','Size 16cm','Kim cương tự nhiên 2.5ct',68000000.00,3,'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80'),
(11,4,'TD-BR-17','Size 17cm','Kim cương tự nhiên 2.7ct',72000000.00,2,'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80'),
(12,5,'ST-ER-GOLD','Tiêu chuẩn','Ngọc trai vàng South Sea',16500000.00,10,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'),
(13,5,'ST-ER-WHITE','Tiêu chuẩn','Ngọc trai trắng South Sea',15800000.00,8,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'),
(14,6,'SG-MEN-17','Size 17','Kim cương & Đá Onyx',34500000.00,5,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'),
(15,6,'SG-MEN-18','Size 18','Kim cương & Đá Onyx',34500000.00,7,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'),
(16,6,'SG-MEN-19','Size 19','Kim cương & Đá Onyx',35000000.00,4,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'),
(17,7,'SPH-ROYAL-45','Dây 45cm','Sapphire tự nhiên & Kim Cương',45000000.00,3,'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'),
(18,8,'S925-BR-FREE','Freesize (15-18cm)','Đá CZ Áo',1250000.00,40,'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'),
(19,9,'DG-ER-WHITE','Tiêu chuẩn','Kim cương tự nhiên',38000000.00,6,'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80'),
(20,10,'RUBY-R-11','Size 11','Ruby tự nhiên Myanmar',52000000.00,2,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),
(21,10,'RUBY-R-12','Size 12','Ruby tự nhiên Myanmar',52000000.00,3,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80');
UNLOCK TABLES;

--
-- Table structure for table `hinhanhsanpham`
--

DROP TABLE IF EXISTS `hinhanhsanpham`;
CREATE TABLE `hinhanhsanpham` (
  `MaHinhAnh` int NOT NULL AUTO_INCREMENT,
  `MaSanPham` int NOT NULL,
  `DuongDanAnh` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ThuTuHienThi` int DEFAULT '0',
  PRIMARY KEY (`MaHinhAnh`),
  KEY `FK_HinhAnh_SanPham` (`MaSanPham`),
  CONSTRAINT `FK_HinhAnh_SanPham` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `hinhanhsanpham` WRITE;
INSERT INTO `hinhanhsanpham` VALUES 
(1,1,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',0),
(2,1,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',1),
(3,2,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',0),
(4,2,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',1),
(5,3,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',0),
(6,3,'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',1),
(7,4,'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80',0),
(8,5,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',0),
(9,6,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',0),
(10,7,'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',0),
(11,8,'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',0),
(12,9,'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80',0),
(13,10,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',0);
UNLOCK TABLES;

--
-- Table structure for table `magiamgia`
--

DROP TABLE IF EXISTS `magiamgia`;
CREATE TABLE `magiamgia` (
  `MaVoucher` int NOT NULL AUTO_INCREMENT,
  `MaCode` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LoaiGiamGia` enum('PERCENT','FIXED') COLLATE utf8mb4_unicode_ci DEFAULT 'PERCENT',
  `GiaTriGiam` decimal(18,2) NOT NULL,
  `GiaTriGiamToiDa` decimal(18,2) DEFAULT NULL,
  `DonHangToiThieu` decimal(18,2) DEFAULT '0.00',
  `SoLuongSuDung` int DEFAULT '100',
  `SoLuongDaDung` int DEFAULT '0',
  `NgayBatDau` datetime NOT NULL,
  `NgayKetThuc` datetime NOT NULL,
  `TrangThai` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`MaVoucher`),
  UNIQUE KEY `MaCode` (`MaCode`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `magiamgia` WRITE;
INSERT INTO `magiamgia` VALUES 
(1,'AURA2026','PERCENT',10.00,500000.00,2000000.00,100,5,'2026-01-01 00:00:00','2026-12-31 23:59:59',1),
(2,'LUXURYVIP','PERCENT',15.00,2500000.00,15000000.00,50,2,'2026-01-01 00:00:00','2026-12-31 23:59:59',1),
(3,'GIAM100K','FIXED',100000.00,100000.00,1000000.00,200,12,'2026-01-01 00:00:00','2026-12-31 23:59:59',1);
UNLOCK TABLES;

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

LOCK TABLES `giohang` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `chitietgiohang`
--

DROP TABLE IF EXISTS `chitietgiohang`;
CREATE TABLE `chitietgiohang` (
  `MaChiTietGioHang` int NOT NULL AUTO_INCREMENT,
  `MaGioHang` int NOT NULL,
  `MaBienThe` int NOT NULL,
  `SoLuong` int DEFAULT '1',
  PRIMARY KEY (`MaChiTietGioHang`),
  KEY `FK_CTGH_GioHang` (`MaGioHang`),
  KEY `FK_CTGH_BienThe` (`MaBienThe`),
  CONSTRAINT `FK_CTGH_BienThe` FOREIGN KEY (`MaBienThe`) REFERENCES `bienthesanpham` (`MaBienThe`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_CTGH_GioHang` FOREIGN KEY (`MaGioHang`) REFERENCES `giohang` (`MaGioHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chitietgiohang_chk_1` CHECK ((`SoLuong` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `chitietgiohang` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `donhang`
-- (Địa chỉ giao hàng đã lưu trực tiếp snapshot tại thời điểm đặt)
--

DROP TABLE IF EXISTS `donhang`;
CREATE TABLE `donhang` (
  `MaDonHang` int NOT NULL AUTO_INCREMENT,
  `MaDonHangCode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaNguoiDung` int NOT NULL,
  `MaVoucher` int DEFAULT NULL,
  `TenNguoiNhan` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoaiNguoiNhan` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DiaChiGiaoHang` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `GhiChu` text COLLATE utf8mb4_unicode_ci,
  `TongTienHang` decimal(18,2) NOT NULL,
  `PhiVanChuyen` decimal(18,2) DEFAULT '0.00',
  `SoTienGiam` decimal(18,2) DEFAULT '0.00',
  `TongThanhToan` decimal(18,2) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `donhang` WRITE;
INSERT INTO `donhang` VALUES 
(1,'AURA2026101701',3,NULL,'Lê Hoàng Yến Nhi','0987654321','Tầng 15, Vincom Center, 72 Lê Thánh Tôn, Q1, TP.HCM','Giao hàng giờ hành chính',28500000.00,0.00,0.00,28500000.00,'DaXacNhan','BANK_TRANSFER','DaThanhToan','2026-10-17 22:41:11');
UNLOCK TABLES;

--
-- Table structure for table `chitietdonhang`
--

DROP TABLE IF EXISTS `chitietdonhang`;
CREATE TABLE `chitietdonhang` (
  `MaChiTietDonHang` int NOT NULL AUTO_INCREMENT,
  `MaDonHang` int NOT NULL,
  `MaBienThe` int NOT NULL,
  `TenSanPhamSnap` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `KichThuocSnap` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SoLuong` int NOT NULL,
  `DonGia` decimal(18,2) NOT NULL,
  PRIMARY KEY (`MaChiTietDonHang`),
  KEY `FK_CTDH_DonHang` (`MaDonHang`),
  KEY `FK_CTDH_BienThe` (`MaBienThe`),
  CONSTRAINT `FK_CTDH_BienThe` FOREIGN KEY (`MaBienThe`) REFERENCES `bienthesanpham` (`MaBienThe`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_CTDH_DonHang` FOREIGN KEY (`MaDonHang`) REFERENCES `donhang` (`MaDonHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chitietdonhang_chk_1` CHECK ((`SoLuong` > 0)),
  CONSTRAINT `chitietdonhang_chk_2` CHECK ((`DonGia` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `chitietdonhang` WRITE;
INSERT INTO `chitietdonhang` VALUES 
(1,1,1,'Nhẫn Kim Cương Solitaire Eternal Grace','Size 10',1,28500000.00);
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;