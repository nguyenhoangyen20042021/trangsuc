---
name: dev
description: >-
  Hướng dẫn quy trình phát triển tính năng mới cho project TrangSuc (Fullstack: ReactJS + MUI Frontend & Flask Python Backend).
  Kích hoạt khi người dùng yêu cầu thêm tính năng, sửa lỗi, xây dựng UI mới với Material-UI, hoặc refactor code.
  Bao gồm các bước: phân tích yêu cầu, lập kế hoạch kiến trúc, triển khai React + MUI, tích hợp API Flask, kiểm thử và xác nhận.
---

# Dev Skill – Quy Trình Phát Triển Tính Năng (ReactJS + MUI & Flask)

Đây là tài liệu quy chuẩn kỹ thuật và quy trình chuẩn để phát triển cho project **TrangSuc (LUNA BELLE Elite Jewelry)** – ứng dụng thương mại điện tử trang sức cao cấp với kiến trúc:
- **Frontend**: **ReactJS 18+**, **Material-UI (MUI v5/v6)**, **Vite**, **Emotion**, **React Router DOM**, **Axios**.
- **Backend**: **Flask (Python)**, **SQLite / MySQL**, **DeepSeek AI Service**.

---

## 1. Tổng Quan Kiến Trúc Project

```
trangsuc/
├── .agents/skills/dev/       # Skill tài liệu phát triển chuẩn
├── frontend/                 # Ứng dụng ReactJS + MUI (Vite)
│   ├── src/
│   │   ├── components/       # UI Components tái sử dụng (Navbar, Footer, ProductCard, AIStylist,...)
│   │   ├── layouts/          # Layout chính (MainLayout, AdminLayout)
│   │   ├── pages/            # Các trang giao diện (Home, Products, ProductDetail, Cart, Checkout, Auth,...)
│   │   ├── theme/            # Cấu hình MUI Theme (Palette Rose Gold, Typography Playfair/Jost, Components)
│   │   ├── context/          # State toàn cục (AuthContext, CartContext, ThemeContext)
│   │   ├── services/         # Tầng gọi API Flask (axios client, endpoints)
│   │   ├── hooks/            # Custom hooks logic
│   │   ├── App.jsx           # Routing & Providers
│   │   └── main.jsx          # Entry point
│   ├── vite.config.js        # Cấu hình Vite & Proxy API tới Flask (port 5000)
│   └── package.json          # Dependencies: @mui/material, @mui/icons-material, react-router-dom,...
├── app.py                    # Flask Server, RESTful API endpoints & logic nghiệp vụ
├── ai_service.py             # Dịch vụ tư vấn trang sức thông minh (DeepSeek AI)
├── db.py                     # Quản lý kết nối Database
├── config.py                 # Biến môi trường & cấu hình Flask
├── seed_data.py              # Dữ liệu mẫu (sản phẩm, biến thể, danh mục, voucher)
└── templates/                # Templates Jinja2 truyền thống (legacy reference)
```

---

## 2. Hệ Thống Thiết Kế & Chuẩn Material-UI (Luna Belle Design System)

Thương hiệu **LUNA BELLE** định vị dòng trang sức Moissanite và Vàng 18K cao cấp. Mọi giao diện xây dựng với Material-UI phải tuân thủ chuẩn sau:

### Bảng màu (Theme Palette)
- **Primary (Rose Gold)**: `#B76E79` (Main), `#8B3A48` (Dark), `#D4939A` (Light), `#F2C4C8` (Pale)
- **Secondary (Champagne Gold / Gold Accent)**: `#D4AF37`, `#F3E5AB`
- **Backgrounds**: `#FFFBF9` (Nền trang chủ), `#FFF5F3` (Section nổi bật), `#FFFFFF` (Card nền trắng tinh khiết)
- **Footer Background**: `#6B3A3A` (Đỏ vang hoàng gia sang trọng)
- **Typography Colors**: `#2C1F20` (Text chính sắc nét), `#5A3F42` (Body), `#9E7B7E` (Muted/Ghi chú)

### Typography
- **Headings (h1, h2, h3, h4, h5, h6)**: Phông có chân sang trọng `'Playfair Display', Georgia, serif`.
- **Body & Controls (body1, body2, button, input)**: Phông hiện đại dễ đọc `'Jost', -apple-system, sans-serif`.

### Nguyên tắc code MUI (MUI Best Practices)
1. **Sử dụng `sx` prop hoặc custom theme overrides**: Tuyệt đối không hardcode inline style thô sơ; tận dụng theme tokens:
   ```jsx
   <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3, boxShadow: '0 4px 20px rgba(183,110,121,0.12)' }}>
   ```
2. **Layout chuẩn**: Dùng `<Grid container spacing={...}>`, `<Stack direction="row" spacing={...}>` và `<Container maxWidth="lg">`.
3. **Typography có ngữ nghĩa**: Luôn dùng `<Typography variant="h4" component="h1">` để chuẩn SEO và thẩm mỹ.
4. **Icons**: Sử dụng `@mui/icons-material` (ví dụ `Diamond`, `ShoppingBag`, `Favorite`, `SmartToy`, `Search`, `AccountCircle`).
5. **Interactive feedback**: Sử dụng MUI `<Snackbar>`, `<Alert>`, `<CircularProgress>`, `<Skeleton>` khi tải dữ liệu.

---

## 3. Quy Trình 5 Bước Phát Triển Tính Năng

### Bước 1: Phân Tích Yêu Cầu & Thiết Kế Giao Diện
1. Xác định:
   - Tính năng dành cho Khách hàng (Client) hay Quản trị viên (Admin)?
   - Cần component MUI nào (Table, Dialog, Drawer, Card, Stepper, Slider)?
   - Dữ liệu API backend cần cung cấp (Schema DB, Payload request/response JSON)?
2. Kiểm tra các component và theme sẵn có trong `frontend/src/` để tái sử dụng.

### Bước 2: Thiết Kế API & Lập Kế Hoạch
1. Định nghĩa RESTful API endpoint trong `app.py`:
   - `GET /api/...` (Lấy dữ liệu)
   - `POST /api/...` (Tạo mới)
   - `PUT /api/...` (Cập nhật)
   - `DELETE /api/...` (Xóa)
2. Thêm hàm gọi API trong `frontend/src/services/api.js`.

### Bước 3: Triển Khai Code

#### 1. Backend (Flask) – `app.py`:
- Viết route trả về `jsonify(...)` kèm mã HTTP chuẩn (200, 201, 400, 401, 404, 500).
- Validate input, xử lý session/token xác thực, query database an toàn với param substitution.

#### 2. Frontend (React + MUI) – `frontend/src/`:
- **Components/Pages**: Viết React functional component, khai báo PropTypes hoặc TypeScript (nếu có).
- **State Management**: Sử dụng `useState`, `useEffect`, hoặc Context (`CartContext`, `AuthContext`).
- **MUI Styling**: Áp dụng theme tokens, gradients (`linear-gradient(135deg, #C9956C 0%, #B76E79 40%, #9B4D62 100%)`), hover transitions mượt mà (`transition: 'all 0.3s ease'`).
- **Responsive**: Hỗ trợ đầy đủ màn hình Mobile (xs), Tablet (sm, md), Desktop (lg, xl) thông qua MUI responsive props `sx={{ display: { xs: 'none', md: 'flex' } }}`.

### Bước 4: Kiểm Thử Đa Tầng

1. **Kiểm thử Backend Flask**:
   ```powershell
   python app.py
   ```
   Đảm bảo API trả về JSON chuẩn, không dính lỗi 500 hoặc CORS.

2. **Kiểm thử Frontend React + MUI**:
   ```powershell
   cd frontend
   npm run dev
   ```
   - Truy cập `http://localhost:5173`.
   - Kiểm tra Console trình duyệt không có cảnh báo (Warning/Error) từ React hoặc MUI.
   - Thử nghiệm các thao tác người dùng: click, thêm giỏ hàng, chuyển trang, tương tác AI, bộ lọc sản phẩm.
   - Kiểm tra hiển thị responsive trên giao diện Mobile và Desktop.

### Bước 5: Xác Nhận & Bàn Giao
1. Tóm tắt các file đã chỉnh sửa/tạo mới với đường dẫn `file:///`.
2. Hướng dẫn chi tiết cách chạy và kiểm tra.
3. Đề xuất các cải tiến về trải nghiệm UI/UX tiếp theo.

---

## 4. Tham Khảo Nhanh

- **MUI Core Documentation**: https://mui.com/material-ui/getting-started/
- **MUI Icons**: https://mui.com/material-ui/material-icons/
- **Vite Guide**: https://vitejs.dev/guide/
- **React Router v6**: https://reactrouter.com/
- **Flask RESTful**: https://flask.palletsprojects.com/
