# Coding Standards & Best Practices

This guide establishes conventions and architectural rules for the **Trang Sức** project to maintain code quality, security, and developer velocity.

---

## 1. Backend Standards (Python / Flask)

### 1.1 SQL Injection Prevention
- **Always** use parameterized queries with `%s` and PyMySQL tuples.
- **Never** format strings into raw SQL (e.g. avoid `f"SELECT * FROM ... WHERE id = {user_input}"`).

```python
# CORRECT:
row = query_one("SELECT * FROM sanpham WHERE MaSanPham = %s", (product_id,))

# FORBIDDEN:
row = query_one(f"SELECT * FROM sanpham WHERE MaSanPham = '{product_id}'")
```

### 1.2 Serialization of Decimal and Datetime
- MySQL `DECIMAL` types become Python `decimal.Decimal` which cannot be natively serialized by `jsonify`.
- Always use `clean_row(row)` or `clean_rows(rows)` in `api_routes.py` to ensure numeric values become floats and dates become formatted strings.

### 1.3 Safe File Uploads
- Check file extensions against `ALLOWED_IMAGE_EXTENSIONS`.
- Generate randomized safe file names (`upload_<timestamp>_<uuid>.<ext>`) to avoid file collision and path traversal attacks.

### 1.4 Error Handling & JSON Responses
- API routes must return consistent JSON structures:
  - Success: `{"success": true, "data": ...}` or JSON array/object.
  - Failure: `{"success": false, "message": "Mô tả lỗi"}`, HTTP status 400/404/500.

---

## 2. Frontend Standards (React / Vite / MUI)

### 2.1 Theme & Aesthetics
- All UI components should utilize the custom MUI theme defined in `frontend/src/theme/`.
- Color scheme represents luxury jewelry:
  - Gold / Champange primary accents (`#C5A880`, `#D4AF37`)
  - Sleek dark or pearl white backgrounds
  - Modern typography: Elegant serif for luxury headings (e.g., Cormorant Garamond / Playfair Display) and clean sans-serif for body (Inter / Outfit).

### 2.2 API Communication
- Centralize API calls under `frontend/src/services/` using `axios`.
- Rely on Vite's proxy (`/api/...`) rather than hardcoding `http://localhost:5000` in React code. This ensures seamless dev-to-production transitions.

### 2.3 Component Design & State
- Functional components with hooks (`useState`, `useEffect`, `useContext`, `useMemo`).
- Keep components focused and modular (e.g., separate presentation from data fetching).
- Use `oxlint` for fast linting: `npm run lint`.

---

## 3. Database Conventions (MySQL)

- Table names are lowercase or PascalCase according to existing schema (`sanpham`, `danhmuc`, `hinhanhsanpham`, `donhang`, `MaGiamGia`).
- Primary keys: `Ma[TenBang]` (e.g., `MaSanPham`, `MaDanhMuc`, `MaDonHang`).
- Foreign keys: Cascade delete where appropriate (e.g., removing a product deletes its gallery entries in `hinhanhsanpham`).
- Character set: `utf8mb4` with collation `utf8mb4_unicode_ci` to properly support Vietnamese diacritics and emojis.
