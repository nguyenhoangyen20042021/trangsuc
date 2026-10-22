---
name: dev
description: >-
  Hướng dẫn quy trình phát triển tính năng mới cho project TrangSuc (Flask/Python).
  Kích hoạt khi người dùng yêu cầu thêm tính năng, sửa lỗi, hoặc refactor code.
  Bao gồm các bước: phân tích yêu cầu, lập kế hoạch, triển khai, kiểm thử và xác nhận.
---

# Dev Skill – Quy Trình Phát Triển Tính Năng

Đây là hướng dẫn chuẩn để phát triển tính năng mới cho project **TrangSuc** – ứng dụng web bán trang sức xây dựng bằng **Flask + SQLite**.

---

## Tổng Quan Kiến Trúc Project

| File/Thư mục       | Vai trò                                          |
|--------------------|--------------------------------------------------|
| `app.py`           | Routes Flask chính, business logic               |
| `ai_service.py`    | Tích hợp AI (DeepSeek), tư vấn sản phẩm         |
| `db.py`            | Kết nối và khởi tạo SQLite database              |
| `config.py`        | Cấu hình ứng dụng (secret key, DB path, v.v.)   |
| `seed_data.py`     | Dữ liệu mẫu để seed vào database                |
| `templates/`       | HTML templates (Jinja2)                          |
| `static/`          | CSS, JS, ảnh tĩnh                               |
| `wed_trang_suc.sql`| Schema SQL database                              |

---

## Quy Trình 5 Bước

### Bước 1: Phân Tích Yêu Cầu

1. Đọc yêu cầu của người dùng, xác định rõ:
   - **Tính năng cần thêm** là gì?
   - **File nào** bị ảnh hưởng?
   - **Có cần thay đổi DB schema không?**
2. Đọc các file liên quan để hiểu code hiện tại trước khi chỉnh sửa.
3. Nếu yêu cầu mơ hồ, hỏi thêm người dùng trước khi code.

### Bước 2: Lập Kế Hoạch

1. Liệt kê các thay đổi cần thực hiện theo thứ tự:
   - DB schema (nếu cần)
   - Model/logic trong `app.py` hoặc `ai_service.py`
   - Routes và API endpoints
   - Templates HTML
   - Static files (CSS/JS)
2. Ước tính độ phức tạp và thông báo cho người dùng.

### Bước 3: Triển Khai

Thực hiện thay đổi theo thứ tự ưu tiên:

1. **Database trước** – Nếu cần thêm bảng/cột mới:
   - Cập nhật `wed_trang_suc.sql`
   - Cập nhật `db.py` (hàm `init_db` hoặc migration)
   - Cập nhật `seed_data.py` nếu cần dữ liệu mẫu

2. **Backend** – Trong `app.py`:
   - Thêm route mới với decorator `@app.route(...)`
   - Implement logic, truy vấn DB
   - Trả về JSON (API) hoặc `render_template` (web page)

3. **AI Service** – Trong `ai_service.py` nếu tính năng liên quan AI:
   - Thêm hàm mới hoặc mở rộng hàm hiện tại
   - Đảm bảo xử lý lỗi và fallback

4. **Frontend** – Templates và static files:
   - Tạo/sửa template trong `templates/`
   - Cập nhật CSS/JS trong `static/`

### Bước 4: Kiểm Thử

Sau khi triển khai, kiểm thử theo checklist:

```powershell
# Chạy server để kiểm thử thủ công
cd e:\TrangSuc
python app.py
```

**Checklist kiểm thử:**
- [ ] Tính năng mới hoạt động đúng như yêu cầu
- [ ] Không có lỗi Python (SyntaxError, ImportError, v.v.)
- [ ] Các tính năng cũ không bị ảnh hưởng (regression)
- [ ] Giao diện hiển thị đúng trên trình duyệt
- [ ] Xử lý edge cases (dữ liệu rỗng, input không hợp lệ)

Nếu có file test sẵn:
```powershell
cd e:\TrangSuc
python -m pytest test_logistic.py -v
```

### Bước 5: Xác Nhận và Tổng Kết

1. Tóm tắt những gì đã thay đổi cho người dùng.
2. Liệt kê các file đã chỉnh sửa với đường dẫn clickable.
3. Hướng dẫn cách test/sử dụng tính năng mới.
4. Đề xuất các cải tiến tiếp theo nếu có.

---

## Quy Tắc Quan Trọng

- **Đọc code hiện tại trước** – Không bao giờ viết lại nếu có thể mở rộng.
- **Giữ nguyên style** – Theo đúng coding convention của file hiện tại.
- **Bảo toàn comment** – Không xóa comment/docstring không liên quan.
- **Xử lý lỗi** – Luôn dùng try/except cho DB queries và API calls.
- **Không hardcode** – Dùng `config.py` cho các giá trị cấu hình.

---

## Tham Khảo Nhanh

- Flask docs: https://flask.palletsprojects.com/
- SQLite với Python: https://docs.python.org/3/library/sqlite3.html
- Jinja2 templates: https://jinja.palletsprojects.com/
