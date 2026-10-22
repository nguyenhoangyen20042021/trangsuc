-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: wed_trang_suc
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bienthesanpham`
--

DROP TABLE IF EXISTS `bienthesanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  CONSTRAINT `FK_BienThe_SanPham` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE,
  CONSTRAINT `bienthesanpham_chk_1` CHECK ((`GiaBan` >= 0)),
  CONSTRAINT `bienthesanpham_chk_2` CHECK ((`SoLuongTonKho` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bienthesanpham`
--

LOCK TABLES `bienthesanpham` WRITE;
/*!40000 ALTER TABLE `bienthesanpham` DISABLE KEYS */;
INSERT INTO `bienthesanpham` VALUES (1,1,'EG-R-10','Size 10','Kim cương tự nhiên GIA',28500000.00,8,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),(2,1,'EG-R-11','Size 11','Kim cương tự nhiên GIA',28500000.00,12,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),(3,1,'EG-R-12','Size 12','Kim cương tự nhiên GIA',29000000.00,5,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),(4,1,'EG-R-10-MOIS','Size 10','Kim cương Moissanite',12500000.00,15,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),(5,2,'RE-PAIR-11-14','Nam 14 - Nữ 10','Kim cương tấm tự nhiên',18900000.00,6,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'),(6,2,'RE-PAIR-12-15','Nam 15 - Nữ 11','Kim cương tấm tự nhiên',19200000.00,4,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'),(7,2,'RE-PAIR-13-16','Nam 16 - Nữ 12','Kim cương tấm tự nhiên',19500000.00,5,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'),(8,3,'HC-NK-42','Dây 42cm','Kim cương tự nhiên',22000000.00,7,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'),(9,3,'HC-NK-45','Dây 45cm','Kim cương tự nhiên',22800000.00,9,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'),(10,4,'TD-BR-16','Size 16cm','Kim cương tự nhiên 2.5ct',68000000.00,3,'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80'),(11,4,'TD-BR-17','Size 17cm','Kim cương tự nhiên 2.7ct',72000000.00,2,'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80'),(12,5,'ST-ER-GOLD','Tiêu chuẩn','Ngọc trai vàng South Sea',16500000.00,10,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'),(13,5,'ST-ER-WHITE','Tiêu chuẩn','Ngọc trai trắng South Sea',15800000.00,8,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'),(14,6,'SG-MEN-17','Size 17','Kim cương & Đá Onyx',34500000.00,5,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'),(15,6,'SG-MEN-18','Size 18','Kim cương & Đá Onyx',34500000.00,7,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'),(16,6,'SG-MEN-19','Size 19','Kim cương & Đá Onyx',35000000.00,4,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'),(17,7,'SPH-ROYAL-45','Dây 45cm','Sapphire tự nhiên & Kim Cương',45000000.00,3,'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'),(18,8,'S925-BR-FREE','Freesize (15-18cm)','Đá CZ Áo',1250000.00,40,'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'),(19,9,'DG-ER-WHITE','Tiêu chuẩn','Kim cương tự nhiên',38000000.00,6,'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80'),(20,10,'RUBY-R-11','Size 11','Ruby tự nhiên Myanmar',52000000.00,2,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'),(21,10,'RUBY-R-12','Size 12','Ruby tự nhiên Myanmar',52000000.00,3,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80');
/*!40000 ALTER TABLE `bienthesanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitietdonhang`
--

DROP TABLE IF EXISTS `chitietdonhang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  CONSTRAINT `FK_CTDH_BienThe` FOREIGN KEY (`MaBienThe`) REFERENCES `bienthesanpham` (`MaBienThe`),
  CONSTRAINT `FK_CTDH_DonHang` FOREIGN KEY (`MaDonHang`) REFERENCES `donhang` (`MaDonHang`) ON DELETE CASCADE,
  CONSTRAINT `chitietdonhang_chk_1` CHECK ((`SoLuong` > 0)),
  CONSTRAINT `chitietdonhang_chk_2` CHECK ((`DonGia` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietdonhang`
--

LOCK TABLES `chitietdonhang` WRITE;
/*!40000 ALTER TABLE `chitietdonhang` DISABLE KEYS */;
INSERT INTO `chitietdonhang` VALUES (1,1,1,'Nhẫn Kim Cương Solitaire Eternal Grace','Size 10',1,28500000.00);
/*!40000 ALTER TABLE `chitietdonhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitietgiohang`
--

DROP TABLE IF EXISTS `chitietgiohang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitietgiohang` (
  `MaChiTietGioHang` int NOT NULL AUTO_INCREMENT,
  `MaGioHang` int NOT NULL,
  `MaBienThe` int NOT NULL,
  `SoLuong` int DEFAULT '1',
  PRIMARY KEY (`MaChiTietGioHang`),
  KEY `FK_CTGH_GioHang` (`MaGioHang`),
  KEY `FK_CTGH_BienThe` (`MaBienThe`),
  CONSTRAINT `FK_CTGH_BienThe` FOREIGN KEY (`MaBienThe`) REFERENCES `bienthesanpham` (`MaBienThe`) ON DELETE CASCADE,
  CONSTRAINT `FK_CTGH_GioHang` FOREIGN KEY (`MaGioHang`) REFERENCES `giohang` (`MaGioHang`) ON DELETE CASCADE,
  CONSTRAINT `chitietgiohang_chk_1` CHECK ((`SoLuong` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietgiohang`
--

LOCK TABLES `chitietgiohang` WRITE;
/*!40000 ALTER TABLE `chitietgiohang` DISABLE KEYS */;
/*!40000 ALTER TABLE `chitietgiohang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danhmuc`
--

DROP TABLE IF EXISTS `danhmuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danhmuc` (
  `MaDanhMuc` int NOT NULL AUTO_INCREMENT,
  `TenDanhMuc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaDanhMucCha` int DEFAULT NULL,
  `MoTa` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`MaDanhMuc`),
  UNIQUE KEY `Slug` (`Slug`),
  KEY `FK_DanhMuc_Cha` (`MaDanhMucCha`),
  CONSTRAINT `FK_DanhMuc_Cha` FOREIGN KEY (`MaDanhMucCha`) REFERENCES `danhmuc` (`MaDanhMuc`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhmuc`
--

LOCK TABLES `danhmuc` WRITE;
/*!40000 ALTER TABLE `danhmuc` DISABLE KEYS */;
INSERT INTO `danhmuc` VALUES (1,'Nhẫn Kim Cương & Nhẫn Cưới','nhan-kim-cuong',NULL,'Bộ sưu tập nhẫn đính hôn, nhẫn cưới và nhẫn kim cương tự nhiên đẳng cấp.'),(2,'Dây Chuyền & Mặt Dây','day-chuyen-mat-day',NULL,'Dây chuyền vàng 18K, bạch kim phối kim cương và đá quý tinh xảo.'),(3,'Vòng Tay & Lắc','vong-tay-lac',NULL,'Vòng tay Tennis, lắc bạc Ý và lắc vàng tôn vinh cổ tay phái đẹp.'),(4,'Bông Tai Quý Phái','bong-tai',NULL,'Hoa tai kim cương, ngọc trai biển sâu kiêu sa cho mọi dịp tiệc tùng.'),(5,'Bộ Sưu Tập Hoàng Gia','bo-suu-tap-hoang-gia',NULL,'Tuyệt tác trang sức đá quý Ruby, Sapphire và Emerald giới hạn.');
/*!40000 ALTER TABLE `danhmuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diachinguoidung`
--

DROP TABLE IF EXISTS `diachinguoidung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diachinguoidung` (
  `MaDiaChi` int NOT NULL AUTO_INCREMENT,
  `MaNguoiDung` int NOT NULL,
  `TenNguoiNhan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TinhThanh` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `QuanHuyen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhuongXa` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DiaChiChiTiet` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LaMacDinh` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`MaDiaChi`),
  KEY `FK_DiaChi_NguoiDung` (`MaNguoiDung`),
  CONSTRAINT `FK_DiaChi_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diachinguoidung`
--

LOCK TABLES `diachinguoidung` WRITE;
/*!40000 ALTER TABLE `diachinguoidung` DISABLE KEYS */;
INSERT INTO `diachinguoidung` VALUES (1,3,'Lê Hoàng Yến Nhi','0987654321','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','Tầng 15, Vincom Center, 72 Lê Thánh Tôn',1);
/*!40000 ALTER TABLE `diachinguoidung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donhang`
--

DROP TABLE IF EXISTS `donhang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  CONSTRAINT `FK_DonHang_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`),
  CONSTRAINT `FK_DonHang_Voucher` FOREIGN KEY (`MaVoucher`) REFERENCES `magiamgia` (`MaVoucher`) ON DELETE SET NULL,
  CONSTRAINT `donhang_chk_1` CHECK ((`TongThanhToan` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donhang`
--

LOCK TABLES `donhang` WRITE;
/*!40000 ALTER TABLE `donhang` DISABLE KEYS */;
INSERT INTO `donhang` VALUES (1,'AURA2026101701',3,NULL,'Lê Hoàng Yến Nhi','0987654321','Tầng 15, Vincom Center, 72 Lê Thánh Tôn, Q1, TP.HCM','Giao hàng giờ hành chính',28500000.00,0.00,0.00,28500000.00,'DaXacNhan','BANK_TRANSFER','DaThanhToan','2026-10-17 22:41:11');
/*!40000 ALTER TABLE `donhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giohang`
--

DROP TABLE IF EXISTS `giohang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giohang` (
  `MaGioHang` int NOT NULL AUTO_INCREMENT,
  `MaNguoiDung` int NOT NULL,
  `NgayCapNhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaGioHang`),
  UNIQUE KEY `MaNguoiDung` (`MaNguoiDung`),
  CONSTRAINT `FK_GioHang_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giohang`
--

LOCK TABLES `giohang` WRITE;
/*!40000 ALTER TABLE `giohang` DISABLE KEYS */;
/*!40000 ALTER TABLE `giohang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hinhanhsanpham`
--

DROP TABLE IF EXISTS `hinhanhsanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hinhanhsanpham` (
  `MaHinhAnh` int NOT NULL AUTO_INCREMENT,
  `MaSanPham` int NOT NULL,
  `DuongDanAnh` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ThuTuHienThi` int DEFAULT '0',
  PRIMARY KEY (`MaHinhAnh`),
  KEY `FK_HinhAnh_SanPham` (`MaSanPham`),
  CONSTRAINT `FK_HinhAnh_SanPham` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hinhanhsanpham`
--

LOCK TABLES `hinhanhsanpham` WRITE;
/*!40000 ALTER TABLE `hinhanhsanpham` DISABLE KEYS */;
INSERT INTO `hinhanhsanpham` VALUES (1,1,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',0),(2,1,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',1),(3,2,'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',0),(4,2,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',1),(5,3,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',0),(6,3,'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',1),(7,4,'https://images.unsplash.com/photo-1611591475817-4841ff5733bc?w=800&auto=format&fit=crop&q=80',0),(8,5,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',0),(9,6,'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',0),(10,7,'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',0),(11,8,'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',0),(12,9,'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80',0),(13,10,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',0);
/*!40000 ALTER TABLE `hinhanhsanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichsutuvaiai`
--

DROP TABLE IF EXISTS `lichsutuvaiai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichsutuvaiai` (
  `MaLichSuChat` int NOT NULL AUTO_INCREMENT,
  `MaNguoiDung` int DEFAULT NULL,
  `CauHoiNguoiDung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhanHoiAI` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ContextNguoiDung` json DEFAULT NULL,
  `ThoiGian` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaLichSuChat`),
  KEY `FK_LSAI_NguoiDung` (`MaNguoiDung`),
  CONSTRAINT `FK_LSAI_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsutuvaiai`
--

LOCK TABLES `lichsutuvaiai` WRITE;
/*!40000 ALTER TABLE `lichsutuvaiai` DISABLE KEYS */;
INSERT INTO `lichsutuvaiai` VALUES (1,NULL,'Tư vấn nhẫn cầu hôn','? **GỢI Ý TRANG SỨC CẦU HÔN & NGÀY CƯỚI ĐỈNH CAO:**\nVới khoảnh khắc thiêng liêng một đời, AURA khuyên bạn nên chọn:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, tôn trọn viên kim cương chuẩn GIA lấp lánh như tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự kết hợp hoàn mỹ giữa vẻ mạnh mẽ của quý ông và nét tinh xảo nạm kim cương của nàng dâu.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 22:59:38'),(2,NULL,'Hello','Chào quý khách! Tôi là **AuraStylist - Chuyên gia tư vấn Kim hoàn AI**.\nDựa trên mong muốn của bạn (\'Hello\'), AURA trân trọng gợi ý những tuyệt tác trang sức kim cương & đá quý được tuyển chọn kỹ lưỡng dưới đây. Quý khách có thể cho tôi biết thêm về **ngân sách dự kiến**, **phong cách** (Sang trọng, Cổ điển, Hiện đại) hoặc **dịp tặng** để nhận tư vấn chính xác nhất!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:00:42'),(3,NULL,'Tư vấn nhẫn kim cương đính hôn','? **LỰA CHỌN TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU:**\nKhoảnh khắc cầu hôn là lời hẹn ước vĩnh cửu. AURA gợi ý quý khách 2 tuyệt tác mang tính biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 trấu kinh điển giữ trọn viên kim cương chủ chuẩn kiểm định GIA nước màu F lấp lánh như tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Bản hòa ca giữa chất vàng 18K bền bỉ và dải kim cương tấm nạm tinh tế gắn kết đôi uyên ương.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:08:34'),(4,NULL,'Cách đo size ni tay nhẫn','? **HƯỚNG DẪN ĐO SIZE NI TAY CHUẨN XÁC TẠI NHÀ (AURA SIZE GUIDE):**\n1. **Bước 1:** Dùng một sợi chỉ hoặc dải giấy nhỏ quấn quanh khớp ngón tay bạn định đeo nhẫn.\n2. **Bước 2:** Đánh dấu điểm giao nhau và trải dải giấy ra thước kẻ để đọc chiều dài chu vi (milimét mm):\n   - Chu vi **50 - 51mm** ➔ **Size 10** (Khuyên dùng cho ngón tay nữ nhỏ thanh mảnh)\n   - Chu vi **52 - 53mm** ➔ **Size 11** (Size tiêu chuẩn nữ phổ biến nhất Việt Nam)\n   - Chu vi **54 - 55mm** ➔ **Size 12** (Dành cho tay nữ đầy đặn)\n   - Chu vi **57 - 58mm** ➔ **Size 14** (Thường vừa ngón tay nam thanh nhã)\n   - Chu vi **60 - 62mm** ➔ **Size 17 - 18** (Size chuẩn nam giới)\n? *Mẹo chuyên gia AURA:* Hãy đo vào cuối buổi chiều khi ngón tay giãn nở tự nhiên nhất. AURA hỗ trợ **chỉnh ni tay hoàn toàn miễn phí trọn đời** cho mọi quý khách!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:12:26'),(5,NULL,'Cách đo size ni tay nhẫn','? **HƯỚNG DẪN ĐO SIZE NI TAY CHUẨN XÁC TẠI NHÀ (AURA SIZE GUIDE):**\n1. **Bước 1:** Dùng một sợi chỉ hoặc dải giấy nhỏ quấn quanh khớp ngón tay bạn định đeo nhẫn.\n2. **Bước 2:** Đánh dấu điểm giao nhau và trải dải giấy ra thước kẻ để đọc chiều dài chu vi (milimét mm):\n   - Chu vi **50 - 51mm** ➔ **Size 10** (Khuyên dùng cho ngón tay nữ nhỏ thanh mảnh)\n   - Chu vi **52 - 53mm** ➔ **Size 11** (Size tiêu chuẩn nữ phổ biến nhất Việt Nam)\n   - Chu vi **54 - 55mm** ➔ **Size 12** (Dành cho tay nữ đầy đặn)\n   - Chu vi **57 - 58mm** ➔ **Size 14** (Thường vừa ngón tay nam thanh nhã)\n   - Chu vi **60 - 62mm** ➔ **Size 17 - 18** (Size chuẩn nam giới)\n? *Mẹo chuyên gia AURA:* Hãy đo vào cuối buổi chiều khi ngón tay giãn nở tự nhiên nhất. AURA hỗ trợ **chỉnh ni tay hoàn toàn miễn phí trọn đời** cho mọi quý khách!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:12:37'),(6,NULL,'Có voucher giảm giá nào không','? **ĐẶC QUYỀN ƯU ĐÃI & MÃ GIẢM GIÁ AURA HIỆN TẠI:**\n1. **Mã AURA2026:** Giảm ngay **10%** giá trị đơn hàng (tối đa 500.000 ₫), áp dụng cho toàn bộ bộ sưu tập online.\n2. **Mã LUXURYVIP:** Giảm **15%** (tối đa 2.500.000 ₫) cho đơn hàng từ 15.000.000 ₫.\n3. **Mã GIAM100K:** Giảm ngay 100.000 ₫ cho đơn từ 1.000.000 ₫.\n✨ *Cách sử dụng:* Quý khách chỉ cần nhập mã tại trang Giỏ Hàng hoặc bước Thanh Toán để được trừ trực tiếp vào tổng tiền!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:12:37'),(7,NULL,'Tư vấn nhẫn cầu hôn','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:12:37'),(8,NULL,'Nên chọn vàng trắng hay vàng hồng cho người da ngăm thích nghệ thuật cổ điển','Chào quý khách! Tôi là **AuraStylist - Trợ lý kim hoàn DeepSeek AI**.\nĐối với câu hỏi của quý khách: *\"Nên chọn vàng trắng hay vàng hồng cho người da ngăm thích nghệ thuật cổ điển\"*, AURA xin tư vấn như sau:\n\n? **LỜI KHUYÊN TỪ CHUYÊN GIA KIM HOÀN AURA:**\n- Khi lựa chọn trang sức cao cấp, ba yếu tố cốt lõi quyết định vẻ đẹp trường tồn là: **Độ tinh khiết của kim loại quý** (Vàng 18K/Bạch kim), **Chất lượng giác cắt viên đá chủ** (Ideal Cut) và **Sự hài hòa với vóc dáng, màu da của chủ nhân**.\n- Nếu quý khách cần chiếc nhẫn đeo hàng ngày, **Vàng trắng 18K** và **Kim cương tự nhiên chuẩn GIA** là sự kết hợp hoàn hảo nhất vì độ cứng cao, chống mài mòn và độ sáng bóng vĩnh cửu.\n\n✨ Quý khách có thể tham khảo ngay các mẫu thiết kế tiêu biểu nhất của AURA dưới đây:','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:12:37'),(9,NULL,'Tư vấn nhẫn cầu hôn kim cương','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:15:05'),(10,NULL,'Cách đo size nhẫn tại nhà','? **HƯỚNG DẪN ĐO SIZE NI TAY CHUẨN XÁC TẠI NHÀ (AURA SIZE GUIDE):**\n1. **Bước 1:** Dùng một sợi chỉ hoặc dải giấy nhỏ quấn quanh khớp ngón tay bạn định đeo nhẫn.\n2. **Bước 2:** Đánh dấu điểm giao nhau và trải dải giấy ra thước kẻ để đọc chiều dài chu vi (milimét mm):\n   - Chu vi **50 - 51mm** ➔ **Size 10** (Khuyên dùng cho ngón tay nữ nhỏ thanh mảnh)\n   - Chu vi **52 - 53mm** ➔ **Size 11** (Size tiêu chuẩn nữ phổ biến nhất Việt Nam)\n   - Chu vi **54 - 55mm** ➔ **Size 12** (Dành cho tay nữ đầy đặn)\n   - Chu vi **57 - 58mm** ➔ **Size 14** (Thường vừa ngón tay nam thanh nhã)\n   - Chu vi **60 - 62mm** ➔ **Size 17 - 18** (Size chuẩn nam giới)\n? *Mẹo chuyên gia AURA:* Hãy đo vào cuối buổi chiều khi ngón tay giãn nở tự nhiên nhất. AURA hỗ trợ **chỉnh ni tay hoàn toàn miễn phí trọn đời** cho mọi quý khách!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:15:15'),(11,NULL,'Trang sức dưới 20 triệu','✨ **GỢI Ý TRANG SỨC PHÙ HỢP NGÂN SÁCH DƯỚI 20.000.000 ₫:**\nDưới đây là các tuyệt tác kim hoàn chế tác tinh xảo nằm trong mức tài chính dự kiến của quý khách:','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:15:21'),(12,NULL,'hướng dẫn đo ni tay ngón tay','? **HƯỚNG DẪN ĐO SIZE NI TAY CHUẨN XÁC TẠI NHÀ (AURA SIZE GUIDE):**\n1. **Bước 1:** Dùng một sợi chỉ hoặc dải giấy nhỏ quấn quanh khớp ngón tay bạn định đeo nhẫn.\n2. **Bước 2:** Đánh dấu điểm giao nhau và trải dải giấy ra thước kẻ để đọc chiều dài chu vi (milimét mm):\n   - Chu vi **50 - 51mm** ➔ **Size 10** (Khuyên dùng cho ngón tay nữ nhỏ thanh mảnh)\n   - Chu vi **52 - 53mm** ➔ **Size 11** (Size tiêu chuẩn nữ phổ biến nhất Việt Nam)\n   - Chu vi **54 - 55mm** ➔ **Size 12** (Dành cho tay nữ đầy đặn)\n   - Chu vi **57 - 58mm** ➔ **Size 14** (Thường vừa ngón tay nam thanh nhã)\n   - Chu vi **60 - 62mm** ➔ **Size 17 - 18** (Size chuẩn nam giới)\n? *Mẹo chuyên gia AURA:* Hãy đo vào cuối buổi chiều khi ngón tay giãn nở tự nhiên nhất. AURA hỗ trợ **chỉnh ni tay hoàn toàn miễn phí trọn đời** cho mọi quý khách!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:17:18'),(13,NULL,'mình muốn mua nhẫn cầu hôn bạn gái','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:17:18'),(14,NULL,'kim cương có giấy chứng thư GIA không','Kính chào quý khách! Tôi là **AuraStylist - Trợ lý kim hoàn DeepSeek AI**.\nMô hình **Logistic Regression Intent Classifier** đã phân tích câu hỏi của quý khách (*\"kim cương có giấy chứng thư GIA không\"*) là câu hỏi chuyên sâu mang tính tư vấn cá nhân hóa (không thuộc form sẵn có).\n\n? **GÓC NHÌN & LỜI KHUYÊN TỪ DEEPSEEK AI:**\n- Khi lựa chọn trang sức cao cấp theo yêu cầu đặc biệt, AURA khuyên bạn nên tập trung vào ba tiêu chí: **Độ tinh khiết kim loại quý (Vàng 18K/Bạch kim Pt950)**, **Giác cắt đối xứng hoàn mỹ (Excellent Cut)** và **Ý nghĩa phong thủy hòa hợp với bản mệnh của chủ nhân**.\n- Đối với nhu cầu độc bản của bạn, những tuyệt tác chế tác thủ công nạm kim cương tự nhiên và đá quý của AURA sẽ là sự lựa chọn sang trọng vượt thời gian.\n\n✨ Dưới đây là những mẫu trang sức tiêu biểu được đề xuất dành riêng cho bạn:','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:17:19'),(15,NULL,'phí ship về đà nẵng bao nhiêu','Kính chào quý khách! Tôi là **AuraStylist - Trợ lý kim hoàn DeepSeek AI**.\nMô hình **Logistic Regression Intent Classifier** đã phân tích câu hỏi của quý khách (*\"phí ship về đà nẵng bao nhiêu\"*) là câu hỏi chuyên sâu mang tính tư vấn cá nhân hóa (không thuộc form sẵn có).\n\n? **GÓC NHÌN & LỜI KHUYÊN TỪ DEEPSEEK AI:**\n- Khi lựa chọn trang sức cao cấp theo yêu cầu đặc biệt, AURA khuyên bạn nên tập trung vào ba tiêu chí: **Độ tinh khiết kim loại quý (Vàng 18K/Bạch kim Pt950)**, **Giác cắt đối xứng hoàn mỹ (Excellent Cut)** và **Ý nghĩa phong thủy hòa hợp với bản mệnh của chủ nhân**.\n- Đối với nhu cầu độc bản của bạn, những tuyệt tác chế tác thủ công nạm kim cương tự nhiên và đá quý của AURA sẽ là sự lựa chọn sang trọng vượt thời gian.\n\n✨ Dưới đây là những mẫu trang sức tiêu biểu được đề xuất dành riêng cho bạn:','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:17:19'),(16,NULL,'mã giảm giá hôm nay có gì','? **ĐẶC QUYỀN ƯU ĐÃI & MÃ GIẢM GIÁ AURA HIỆN TẠI:**\n1. **Mã AURA2026:** Giảm ngay **10%** giá trị đơn hàng (tối đa 500.000 ₫), áp dụng cho toàn bộ bộ sưu tập online.\n2. **Mã LUXURYVIP:** Giảm **15%** (tối đa 2.500.000 ₫) cho đơn hàng từ 15.000.000 ₫.\n3. **Mã GIAM100K:** Giảm ngay 100.000 ₫ cho đơn từ 1.000.000 ₫.\n✨ *Cách sử dụng:* Quý khách chỉ cần nhập mã tại trang Giỏ Hàng hoặc bước Thanh Toán để được trừ trực tiếp vào tổng tiền!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:17:19'),(17,NULL,'cho tôi xem mẫu nhẫn nam quý ông','Kính chào quý khách! Tôi là **AuraStylist - Trợ lý kim hoàn DeepSeek AI**.\nMô hình **Logistic Regression Intent Classifier** đã phân tích câu hỏi của quý khách (*\"cho tôi xem mẫu nhẫn nam quý ông\"*) là câu hỏi chuyên sâu mang tính tư vấn cá nhân hóa (không thuộc form sẵn có).\n\n? **GÓC NHÌN & LỜI KHUYÊN TỪ DEEPSEEK AI:**\n- Khi lựa chọn trang sức cao cấp theo yêu cầu đặc biệt, AURA khuyên bạn nên tập trung vào ba tiêu chí: **Độ tinh khiết kim loại quý (Vàng 18K/Bạch kim Pt950)**, **Giác cắt đối xứng hoàn mỹ (Excellent Cut)** và **Ý nghĩa phong thủy hòa hợp với bản mệnh của chủ nhân**.\n- Đối với nhu cầu độc bản của bạn, những tuyệt tác chế tác thủ công nạm kim cương tự nhiên và đá quý của AURA sẽ là sự lựa chọn sang trọng vượt thời gian.\n\n✨ Dưới đây là những mẫu trang sức tiêu biểu được đề xuất dành riêng cho bạn:','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:17:19'),(18,NULL,'Hãy so sánh độ cứng theo thang Mohs giữa kim cương tự nhiên và Sapphire khi làm trang sức truyền đời','Kính chào quý khách! Tôi là **AuraStylist - Trợ lý kim hoàn DeepSeek AI**.\nMô hình **Logistic Regression Intent Classifier** đã phân tích câu hỏi của quý khách (*\"Hãy so sánh độ cứng theo thang Mohs giữa kim cương tự nhiên và Sapphire khi làm trang sức truyền đời\"*) là câu hỏi chuyên sâu mang tính tư vấn cá nhân hóa (không thuộc form sẵn có).\n\n? **GÓC NHÌN & LỜI KHUYÊN TỪ DEEPSEEK AI:**\n- Khi lựa chọn trang sức cao cấp theo yêu cầu đặc biệt, AURA khuyên bạn nên tập trung vào ba tiêu chí: **Độ tinh khiết kim loại quý (Vàng 18K/Bạch kim Pt950)**, **Giác cắt đối xứng hoàn mỹ (Excellent Cut)** và **Ý nghĩa phong thủy hòa hợp với bản mệnh của chủ nhân**.\n- Đối với nhu cầu độc bản của bạn, những tuyệt tác chế tác thủ công nạm kim cương tự nhiên và đá quý của AURA sẽ là sự lựa chọn sang trọng vượt thời gian.\n\n✨ Dưới đây là những mẫu trang sức tiêu biểu được đề xuất dành riêng cho bạn:','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:17:19'),(19,NULL,'hướng dẫn đo ni tay ngón tay','? **HƯỚNG DẪN ĐO SIZE NI TAY CHUẨN XÁC TẠI NHÀ (AURA SIZE GUIDE):**\n1. **Bước 1:** Dùng một sợi chỉ hoặc dải giấy nhỏ quấn quanh khớp ngón tay bạn định đeo nhẫn.\n2. **Bước 2:** Đánh dấu điểm giao nhau và trải dải giấy ra thước kẻ để đọc chiều dài chu vi (milimét mm):\n   - Chu vi **50 - 51mm** ➔ **Size 10** (Khuyên dùng cho ngón tay nữ nhỏ thanh mảnh)\n   - Chu vi **52 - 53mm** ➔ **Size 11** (Size tiêu chuẩn nữ phổ biến nhất Việt Nam)\n   - Chu vi **54 - 55mm** ➔ **Size 12** (Dành cho tay nữ đầy đặn)\n   - Chu vi **57 - 58mm** ➔ **Size 14** (Thường vừa ngón tay nam thanh nhã)\n   - Chu vi **60 - 62mm** ➔ **Size 17 - 18** (Size chuẩn nam giới)\n? *Mẹo chuyên gia AURA:* Hãy đo vào cuối buổi chiều khi ngón tay giãn nở tự nhiên nhất. AURA hỗ trợ **chỉnh ni tay hoàn toàn miễn phí trọn đời** cho mọi quý khách!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:18:32'),(20,NULL,'mình muốn mua nhẫn cầu hôn bạn gái','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:18:32'),(21,NULL,'kim cương có giấy chứng thư GIA không','?️ **CHÍNH SÁCH BẢO HÀNH & KIỂM ĐỊNH KIM HOÀN TẠI AURA:**\n- **Chứng thư kiểm định GIA:** 100% kim cương tự nhiên từ 3.6 ly trở lên đều có giấy kiểm định quốc tế GIA minh bạch (mã số khắc laser trên cạnh kim cương).\n- **Vàng đủ tuổi 100%:** Cam kết đúng hàm lượng vàng 18K (750) và 24K (999.9), đền bù 200% nếu phát hiện sai lệch.\n- **Bảo hành trọn đời:** Miễn phí đánh bóng, làm mới, làm sạch siêu âm và gắn đá tấm trọn đời.\n- **Chính sách thu đổi minh bạch:** Thu đổi từ **70% - 80%** giá trị sản phẩm theo quy chế bảo hành kim hoàn cao cấp.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:18:32'),(22,NULL,'phí ship về đà nẵng bao nhiêu','? **CHÍNH SÁCH GIAO HÀNG & VẬN CHUYỂN BẢO HIỂM AURA:**\n- **Miễn phí vận chuyển 100%:** Áp dụng cho mọi đơn hàng từ **5.000.000 ₫** trở lên trên toàn quốc.\n- **Giao hỏa tốc:** \n  * Nội thành TP.HCM & Hà Nội: Giao chuyên biệt bằng xe bảo mật trong **2 - 4 giờ**.\n  * Các tỉnh thành khác: Giao bảo đảm bảo hiểm 100% qua chuyển phát nhanh trong **24 - 48 giờ**.\n- **Đồng kiểm & Niêm phong:** Quý khách được mở kiểm tra hộp nhung niêm phong, kiểm tra giấy kiểm định GIA trước khi thanh toán.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:18:32'),(23,NULL,'mã giảm giá hôm nay có gì','? **ĐẶC QUYỀN ƯU ĐÃI & MÃ GIẢM GIÁ AURA HIỆN TẠI:**\n1. **Mã AURA2026:** Giảm ngay **10%** giá trị đơn hàng (tối đa 500.000 ₫), áp dụng cho toàn bộ bộ sưu tập online.\n2. **Mã LUXURYVIP:** Giảm **15%** (tối đa 2.500.000 ₫) cho đơn hàng từ 15.000.000 ₫.\n3. **Mã GIAM100K:** Giảm ngay 100.000 ₫ cho đơn từ 1.000.000 ₫.\n✨ *Cách sử dụng:* Quý khách chỉ cần nhập mã tại trang Giỏ Hàng hoặc bước Thanh Toán để được trừ trực tiếp vào tổng tiền!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:18:33'),(24,NULL,'cho tôi xem mẫu nhẫn nam quý ông','? **BỘ SƯU TẬP TRANG SỨC DÀNH RIÊNG CHO PHÁI MẠNH:**\nTrang sức nam tại AURA hướng đến sự uy quyền, mạnh mẽ và lịch lãm:\n- **Nhẫn Nam Kim Cương Signet Black Onyx:** Vàng hồng 18K đúc đặc kết hợp mặt đá Onyx đen bóng huyền bí và viên kim cương chủ góc cạnh sắc nét, tôn vinh đẳng cấp của quý ông thành đạt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:18:33'),(25,NULL,'Hãy so sánh độ cứng theo thang Mohs giữa kim cương tự nhiên và Sapphire khi làm trang sức truyền đời','Kính chào quý khách! Tôi là **AuraStylist - Trợ lý kim hoàn DeepSeek AI**.\nMô hình **Logistic Regression Intent Classifier** đã phân tích câu hỏi của quý khách (*\"Hãy so sánh độ cứng theo thang Mohs giữa kim cương tự nhiên và Sapphire khi làm trang sức truyền đời\"*) là câu hỏi chuyên sâu mang tính tư vấn cá nhân hóa (không thuộc form sẵn có).\n\n? **GÓC NHÌN & LỜI KHUYÊN TỪ DEEPSEEK AI:**\n- Khi lựa chọn trang sức cao cấp theo yêu cầu đặc biệt, AURA khuyên bạn nên tập trung vào ba tiêu chí: **Độ tinh khiết kim loại quý (Vàng 18K/Bạch kim Pt950)**, **Giác cắt đối xứng hoàn mỹ (Excellent Cut)** và **Ý nghĩa phong thủy hòa hợp với bản mệnh của chủ nhân**.\n- Đối với nhu cầu độc bản của bạn, những tuyệt tác chế tác thủ công nạm kim cương tự nhiên và đá quý của AURA sẽ là sự lựa chọn sang trọng vượt thời gian.\n\n✨ Dưới đây là những mẫu trang sức tiêu biểu được đề xuất dành riêng cho bạn:','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:18:33'),(26,NULL,'Tư vấn nhẫn cầu hôn kim cương','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:19:55'),(27,NULL,'Tư vấn nhẫn cầu hôn kim cương','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:34:33'),(28,NULL,'Cách đo size nhẫn tại nhà','? **HƯỚNG DẪN ĐO SIZE NI TAY CHUẨN XÁC TẠI NHÀ (AURA SIZE GUIDE):**\n1. **Bước 1:** Dùng một sợi chỉ hoặc dải giấy nhỏ quấn quanh khớp ngón tay bạn định đeo nhẫn.\n2. **Bước 2:** Đánh dấu điểm giao nhau và trải dải giấy ra thước kẻ để đọc chiều dài chu vi (milimét mm):\n   - Chu vi **50 - 51mm** ➔ **Size 10** (Khuyên dùng cho ngón tay nữ nhỏ thanh mảnh)\n   - Chu vi **52 - 53mm** ➔ **Size 11** (Size tiêu chuẩn nữ phổ biến nhất Việt Nam)\n   - Chu vi **54 - 55mm** ➔ **Size 12** (Dành cho tay nữ đầy đặn)\n   - Chu vi **57 - 58mm** ➔ **Size 14** (Thường vừa ngón tay nam thanh nhã)\n   - Chu vi **60 - 62mm** ➔ **Size 17 - 18** (Size chuẩn nam giới)\n? *Mẹo chuyên gia AURA:* Hãy đo vào cuối buổi chiều khi ngón tay giãn nở tự nhiên nhất. AURA hỗ trợ **chỉnh ni tay hoàn toàn miễn phí trọn đời** cho mọi quý khách!','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:34:52'),(29,NULL,'Trang sức dưới 20 triệu','? **BỘ SƯU TẬP TRANG SỨC DÀNH RIÊNG CHO PHÁI MẠNH:**\nTrang sức nam tại AURA hướng đến sự uy quyền, mạnh mẽ và lịch lãm:\n- **Nhẫn Nam Kim Cương Signet Black Onyx:** Vàng hồng 18K đúc đặc kết hợp mặt đá Onyx đen bóng huyền bí và viên kim cương chủ góc cạnh sắc nét, tôn vinh đẳng cấp của quý ông thành đạt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:34:57'),(30,NULL,'Tư vấn nhẫn cầu hôn kim cương','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:35:14'),(31,NULL,'? Nhẫn cầu hôn','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:35:55'),(32,NULL,'Tư vấn nhẫn cầu hôn kim cương','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:35:55'),(33,NULL,'Tư vấn nhẫn cầu hôn kim cương','? **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**\nKhoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:\n1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.\n2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt.','{\"style\": \"\", \"budget\": \"\", \"occasion\": \"\", \"finger_size\": \"\"}','2026-10-17 23:36:06');
/*!40000 ALTER TABLE `lichsutuvaiai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `magiamgia`
--

DROP TABLE IF EXISTS `magiamgia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `magiamgia`
--

LOCK TABLES `magiamgia` WRITE;
/*!40000 ALTER TABLE `magiamgia` DISABLE KEYS */;
INSERT INTO `magiamgia` VALUES (1,'AURA2026','PERCENT',10.00,500000.00,2000000.00,100,5,'2026-01-01 00:00:00','2026-12-31 23:59:59',1),(2,'LUXURYVIP','PERCENT',15.00,2500000.00,15000000.00,50,2,'2026-01-01 00:00:00','2026-12-31 23:59:59',1),(3,'GIAM100K','FIXED',100000.00,100000.00,1000000.00,200,12,'2026-01-01 00:00:00','2026-12-31 23:59:59',1);
/*!40000 ALTER TABLE `magiamgia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoidung`
--

DROP TABLE IF EXISTS `nguoidung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoidung` (
  `MaNguoiDung` int NOT NULL AUTO_INCREMENT,
  `MaVaiTro` int NOT NULL,
  `TenDangNhap` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MatKhauMaHoa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `NgayCapNhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaNguoiDung`),
  UNIQUE KEY `TenDangNhap` (`TenDangNhap`),
  UNIQUE KEY `Email` (`Email`),
  KEY `FK_NguoiDung_VaiTro` (`MaVaiTro`),
  CONSTRAINT `FK_NguoiDung_VaiTro` FOREIGN KEY (`MaVaiTro`) REFERENCES `vaitro` (`MaVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoidung`
--

LOCK TABLES `nguoidung` WRITE;
/*!40000 ALTER TABLE `nguoidung` DISABLE KEYS */;
INSERT INTO `nguoidung` VALUES (1,1,'admin','scrypt:32768:8:1$q7aqw6nAAP4FxXpN$7dd65efe80a4206531b0a9597ab449d6e1c85392504a8d518f272d77721c14adcab8398e8c6a76ffd9cba9a369900a8da46697a60a58b54004385ff1c5391295','Quản Trị Viên Cao Cấp','admin@aurajewelry.vn','0901234567','2026-10-17 22:41:11','2026-10-17 22:41:11'),(2,2,'nhanvien','scrypt:32768:8:1$eMaUyWiBHwbqYYLj$af7b18cfa40de5748e85154f6db5b6ab2a3ce6cd11caa8de8d5d25cb2de0c0fe501431dfcdc4f6cabf035fcf4cb5822350a9294c8e9740b51d69a2bec0e454b9','Nguyễn Văn Nhân Viên','staff@aurajewelry.vn','0912345678','2026-10-17 22:41:11','2026-10-17 22:41:11'),(3,3,'khachhang','scrypt:32768:8:1$s6TWXCWWOPm8cbCE$d5456a91d4f9bbb94a9ee0dcb6bf9c5b7f6a81a590fd6b08323a63b028073ede9596ef71f857765dbb80696af13b60e445afd6bc5e853ef974491362bf32cc90','Lê Hoàng Yến Nhi','yennhi@gmail.com','0987654321','2026-10-17 22:41:11','2026-10-17 22:41:11'),(4,3,'minhtri','scrypt:32768:8:1$CAAnXhMEyV6xQitX$99f4f9eea4fd3a89a87f9a5954702eea2ae2f4c3b22a49724dd31747d7573cee08ad16d8a16208774424cfe03a6441d5a200fce34166730ae84476a66c6b0a5c','Trần Minh Trí','minhtri@gmail.com','0978999888','2026-10-17 22:41:11','2026-10-17 22:41:11');
/*!40000 ALTER TABLE `nguoidung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  CONSTRAINT `FK_SanPham_DanhMuc` FOREIGN KEY (`MaDanhMuc`) REFERENCES `danhmuc` (`MaDanhMuc`),
  CONSTRAINT `sanpham_chk_1` CHECK ((`GiaCoSo` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
INSERT INTO `sanpham` VALUES (1,'Nhẫn Kim Cương Solitaire Eternal Grace','nhan-kim-cuong-solitaire-eternal-grace',1,'Kim Cương','Sang trọng','Nữ',28500000.00,'Nhẫn đính hôn Solitaire Eternal Grace sở hữu viên kim cương chủ chuẩn kiểm định GIA 4.5 ly nước F, độ sạch VVS1 gắn trên chấu 6 trấu kinh điển bằng vàng trắng 750 (18K). Thiết kế thanh thoát tôn vinh vẻ đẹp vĩnh cửu của tình yêu đôi lứa.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 23:35:59'),(2,'Cặp Nhẫn Cưới Đôi Royal Eternity','cap-nhan-cuoi-doi-royal-eternity',1,'Vàng 18K','Hiện đại','Cặp đôi',18900000.00,'Cặp nhẫn cưới Royal Eternity được chế tác từ vàng 18K nguyên khối, nhẫn nam viền xước mờ lịch lãm, nhẫn nữ nạm dải kim cương tấm lấp lánh mang ý nghĩa gắn kết trọn đời không rời.',1,'DangBan','2026-10-17 22:41:11','2026-10-18 03:54:15'),(3,'Dây Chuyền Mặt Kim Cương Halo Celestial','day-chuyen-mat-kim-cuong-halo-celestial',2,'Bạch Kim','Sang trọng','Nữ',22000000.00,'Dây chuyền chế tác từ bạch kim Platinum 950 cao cấp với mặt tròn Halo nạm viên kim cương chủ cùng vòng hào quang rực rỡ, phản chiếu ánh sáng kiêu sa dưới mọi góc nhìn.',0,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),(4,'Vòng Tay Kim Cương Tennis Diamond Royale','vong-tay-kim-cuong-tennis-diamond-royale',3,'Kim Cương','Sang trọng','Nữ',68000000.00,'Biểu tượng kinh điển của sự xa hoa quý phái: Lắc tay Tennis nạm liền mạch 52 viên kim cương tấm tự nhiên tuyển chọn đồng đều giác cắt Excellent trên nền vàng trắng 18K.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),(5,'Bông Tai Ngọc Trai South Sea Dát Vàng 18K','bong-tai-ngoc-trai-south-sea-dat-vang-18k',4,'Vàng 18K','Cổ điển','Nữ',16500000.00,'Đôi bông tai kết hợp giữa vẻ đẹp thuần khiết của ngọc trai biển South Sea 10-11mm ánh xà cừ óng ả và chấu khóa hoa tulip vàng vàng 18K điểm xuyết đá quý lấp lánh.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),(6,'Nhẫn Nam Kim Cương Signet Black Onyx','nhan-nam-kim-cuong-signet-black-onyx',1,'Vàng 18K','Hiện đại','Nam',34500000.00,'Nhẫn nam dáng Signet quyền lực đúc đặc vàng hồng 18K kết hợp mặt đá Onyx đen bóng huyền bí và viên kim cương chủ 5 ly góc cạnh, khẳng định bản lĩnh của quý ông thành đạt.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 23:34:59'),(7,'Dây Chuyền Đá Sapphire Hoàng Gia Vương Triều','day-chuyen-da-sapphire-hoang-gia-vuong-trieu',2,'Bạch Kim','Cổ điển','Nữ',45000000.00,'Lấy cảm hứng từ trang sức vương thất châu Âu, dây chuyền điểm viên đá Sapphire tự nhiên xanh biển thẳm 3.2 carat được bao bọc bởi dải kim cương kép rực rỡ.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),(8,'Lắc Tay Bạc Ý S925 Tinh Khôi Sparkling Wish','lac-tay-bac-y-s925-tinh-khoi-sparkling-wish',3,'Bạc S925','Tối giản','Nữ',1250000.00,'Lắc tay bạc Ý xi mạ vàng trắng cao cấp, đính các hạt charm bi tròn và đá Swarovski lấp lánh nhẹ nhàng, phù hợp cho trang phục thường ngày hoặc đi làm văn phòng.',0,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),(9,'Bông Tai Kim Cương Drop Grace Chùm Dài','bong-tai-kim-cuong-drop-grace-chum-dai',4,'Kim Cương','Sang trọng','Nữ',38000000.00,'Đôi hoa tai dáng giọt nước thanh mảnh đung đưa theo từng chuyển động, chế tác từ vàng trắng 18K đính 36 viên kim cương tấm tự nhiên tạo hiệu ứng bắt sáng tối đa.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11'),(10,'Nhẫn Nữ Ruby Huyết Bồ Câu Passionate','nhan-nu-ruby-huyet-bo-cau-passionate',5,'Vàng 18K','Cổ điển','Nữ',52000000.00,'Viên đá Ruby đỏ thắm giác cắt Oval rực cháy tựa ngọn lửa tình yêu nồng nàn, kết hợp giác cắt kim cương bao quanh tạo nên một kiệt tác trang sức phong thủy mang lại may mắn và quyền uy.',1,'DangBan','2026-10-17 22:41:11','2026-10-17 22:41:11');
/*!40000 ALTER TABLE `sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sanphamyeuthich`
--

DROP TABLE IF EXISTS `sanphamyeuthich`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sanphamyeuthich` (
  `MaYeuThich` int NOT NULL AUTO_INCREMENT,
  `MaNguoiDung` int NOT NULL,
  `MaSanPham` int NOT NULL,
  `NgayThem` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaYeuThich`),
  UNIQUE KEY `UQ_SPYT` (`MaNguoiDung`,`MaSanPham`),
  KEY `FK_SPYT_SanPham` (`MaSanPham`),
  CONSTRAINT `FK_SPYT_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE CASCADE,
  CONSTRAINT `FK_SPYT_SanPham` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanphamyeuthich`
--

LOCK TABLES `sanphamyeuthich` WRITE;
/*!40000 ALTER TABLE `sanphamyeuthich` DISABLE KEYS */;
/*!40000 ALTER TABLE `sanphamyeuthich` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaitro`
--

DROP TABLE IF EXISTS `vaitro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaitro` (
  `MaVaiTro` int NOT NULL AUTO_INCREMENT,
  `TenVaiTro` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MoTa` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaVaiTro`),
  UNIQUE KEY `TenVaiTro` (`TenVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaitro`
--

LOCK TABLES `vaitro` WRITE;
/*!40000 ALTER TABLE `vaitro` DISABLE KEYS */;
INSERT INTO `vaitro` VALUES (1,'ADMIN','Quản trị viên hệ thống'),(2,'STAFF','Nhân viên bán hàng/kho'),(3,'CUSTOMER','Khách hàng mua sắm');
/*!40000 ALTER TABLE `vaitro` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-20 23:41:18
