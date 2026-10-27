# REST API Endpoints Reference

All API routes are served by Flask and proxied via Vite from `/api/*` to `http://127.0.0.1:5000/api/*`.

---

## 1. Product Endpoints

### `GET /api/products`
Retrieves the list of products with category details and image lists.
- **Query Parameters**:
  - `category` (optional, string): Filter by category slug or ID
  - `search` (optional, string): Filter by product name or code
  - `sort` (optional, string): `price_asc`, `price_desc`, `newest`
- **Response**: Array of product objects
  ```json
  [
    {
      "MaSanPham": 1,
      "TenSanPham": "Nhẫn Kim Cương Solitaire 18K",
      "Slug": "nhan-kim-cuong-solitaire-18k",
      "GiaGoc": 25000000,
      "GiaKhuyenMai": 22500000,
      "SoLuong": 10,
      "HinhAnh": "/static/uploads/products/nhan_solitaire.jpg",
      "TenDanhMuc": "Nhẫn Cưới & Cầu Hôn",
      "images": ["/static/uploads/products/nhan_solitaire.jpg"]
    }
  ]
  ```

### `GET /api/products/<id_or_slug>`
Fetches detailed product information by ID or slug, including all gallery images and related products.

### `POST /api/products`
Creates a new product (Admin / Management).
- **Body** (JSON or FormData): `TenSanPham`, `MaDanhMuc`, `GiaGoc`, `GiaKhuyenMai`, `SoLuong`, `MoTa`, `ChatLieu`, `HinhAnh`, `images` array.

### `PUT /api/products/<int:product_id>`
Updates an existing product.

### `DELETE /api/products/<int:product_id>`
Deletes or deactivates a product.

---

## 2. Category Endpoints

### `GET /api/categories`
Fetches all categories.
- **Response**:
  ```json
  [
    {
      "MaDanhMuc": 1,
      "TenDanhMuc": "Nhẫn",
      "Slug": "nhan",
      "MoTa": "Nhẫn vàng, bạc, đính kim cương phong cách sang trọng"
    }
  ]
  ```

### `POST /api/categories`
Creates a new category.

### `PUT /api/categories/<int:cat_id>`
Updates an existing category.

### `DELETE /api/categories/<int:cat_id>`
Deletes a category.

---

## 3. Order Endpoints

### `GET /api/orders`
Retrieves orders (Admin / user history).
- **Response**: Array of order objects with customer info and total amounts.

### `POST /api/orders`
Places a new order.
- **Payload**:
  ```json
  {
    "HoTen": "Nguyễn Văn A",
    "SoDienThoai": "0912345678",
    "Email": "vana@example.com",
    "DiaChiGiaoHang": "123 Lê Lợi, Q.1, TP.HCM",
    "PhuongThucThanhToan": "COD",
    "GhiChu": "Giao giờ hành chính",
    "MaGiamGia": "KIMCUONG10",
    "items": [
      {
        "MaSanPham": 1,
        "SoLuong": 1,
        "DonGia": 22500000
      }
    ]
  }
  ```

### `PUT /api/orders/<string:order_id>/status`
Updates status of an order (`ChoXacNhan`, `DangXuLy`, `DangGiao`, `HoanThanh`, `DaHuy`).

---

## 4. Vouchers & Promotions

### `GET /api/vouchers`
Returns active voucher list.

### `POST /api/vouchers`
Creates a voucher code with discount type (`percentage` or `fixed`), min order, and expiry date.

### `DELETE /api/vouchers/<int:vid>`
Removes a voucher.

---

## 5. AI Jewelry Consultant

### `POST /api/ai-consultant`
Generates personalized jewelry consultation via DeepSeek AI.
- **Payload**:
  ```json
  {
    "gender": "Nữ",
    "occasion": "Lễ đính hôn",
    "budget": "20-30 triệu",
    "style": "Cổ điển, thanh lịch",
    "material": "Vàng trắng 18K",
    "additional_note": "Da sáng, thích kim cương tự nhiên"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "advice": "Gợi ý chọn Nhẫn Solitaire đính kim cương 4.5 ly...",
    "recommended_category": "nhan-cau-hon"
  }
  ```

---

## 6. File Upload Endpoint

### `POST /api/upload`
Uploads a product image or asset.
- **Content-Type**: `multipart/form-data` (field: `image` or `file`)
- **Response**:
  ```json
  {
    "success": true,
    "url": "/static/uploads/products/upload_1740000000_a1b2c3.jpg"
  }
  ```
