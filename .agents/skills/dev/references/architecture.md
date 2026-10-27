# System Architecture & Tech Stack

This document outlines the high-level architecture of the **Trang Sức (Aura Luxury Jewelry)** e-commerce web application.

---

## 1. High-Level Architecture

```
                    +-----------------------------+
                    |  Browser Client / End User  |
                    +--------------+--------------+
                                   |
                  HTTP Requests    | Port 5173
                                   v
             +-----------------------------------------+
             |         Vite Dev Server (Frontend)      |
             |       React 19 + MUI + React Router     |
             +---------------------+-------------------+
                                   |
                 Proxy: /api, /static -> Port 5000
                                   v
             +-----------------------------------------+
             |         Flask Backend (app.py)          |
             |  - Blueprint: api_bp (/api)             |
             |  - Server-side routes & Jinja admin     |
             |  - File Uploads: static/uploads/        |
             +------------------+----------------------+
                                |
               +----------------+----------------+
               |                                 |
               v                                 v
+-------------------------------+ +-------------------------------+
|      MySQL Database           | |    DeepSeek AI API            |
|  - Host: localhost:3306       | |  - Model: deepseek-chat       |
|  - DB: wed_trang_suc          | |  - Endpoint: api.deepseek.com |
|  - Driver: PyMySQL DictCursor | |  - AI Tư vấn trang sức       |
+-------------------------------+ +-------------------------------+
```

---

## 2. Component Specifications

### 2.1 Backend (Python / Flask)
- **Entry point**: `app.py` runs on `http://127.0.0.1:5000` (clean REST server & SPA static distributor, 0 legacy Jinja code)
- **Virtual environment**: `venv/Scripts/python.exe`
- **Config**: `config.py` (`Config` class with MySQL & DeepSeek settings)
- **Database Access**: `db.py` providing `get_db()`, `query_all()`, `query_one()`, and `execute()`
- **Modular API Architecture**: `api/` package with specialized domain modules:
  - `api/products/`: Products CRUD, gallery, variant management
  - `api/categories/`: Hierarchical categories with live product count
  - `api/orders/`: Order placement, items snapshot, status lifecycle
  - `api/vouchers/`: Discount codes, order discount calculation engine
  - `api/users/`: User accounts, session authentication, role checks
  - `api/ai/`: Logistic Regression Intent Classifier + DeepSeek LLM consultation
  - `api/uploads/`: Product and banner image uploading
- **Asset Storage**: `static/uploads/products/` for uploaded media

### 2.2 Frontend (React / Vite)
- **Root directory**: `frontend/`
- **Framework**: React 19 + Vite 8
- **UI Component Library**: Material UI (`@mui/material`, `@mui/icons-material`, `@emotion/react`)
- **Routing**: `react-router-dom` v7
- **HTTP Client**: `axios` with base configurations in `frontend/src/services/`
- **Vite Proxy**: Configured in `frontend/vite.config.js` to automatically redirect requests matching `/api` and `/static` to `http://127.0.0.1:5000`

### 2.3 Database (MySQL)
- **Database Name**: `wed_trang_suc`
- **Charset**: `utf8mb4`
- **Key Tables**:
  - `danhmuc`: Jewelry categories
  - `sanpham`: Products table
  - `hinhanhsanpham`: Multi-image support per product
  - `bienthesanpham`: Variants, sizes, gemstones, stock
  - `nguoidung`: Users and administrative accounts
  - `donhang` & `chitietdonhang`: Orders, order statuses, and line items
  - `magiamgia`: Coupons / discount codes
  - `danhgia`: Product reviews and ratings

---

## 3. Directory Structure

```text
trangsuc/
├── .agents/
│   └── skills/
│       └── dev/                      # Trang Suc dev workflow skill
├── api/                              # Modular API domain packages
│   ├── __init__.py                   # Master API Blueprint registration (/api)
│   ├── utils.py                      # JSON serializers and currency helpers
│   ├── common/                       # Shared pricing, cart sync & auth decorators
│   ├── products/                     # Product catalog & variants
│   ├── categories/                   # Hierarchical jewelry categories
│   ├── orders/                       # Order creation and fulfillment
│   ├── vouchers/                     # Coupons & cart discount calculator
│   ├── users/                        # Auth & user management
│   ├── ai/                           # Intent Classifier & DeepSeek LLM
│   └── uploads/                      # Media and image upload handler
├── app.py                            # Lean Flask app entry point (no Jinja legacy)
├── api_routes.py                     # Backward-compatibility facade
├── ai_service.py                     # Backward-compatibility facade
├── config.py                         # App configuration & environment variables
├── db.py                             # PyMySQL connection pool & helpers
├── wed_trang_suc.sql                 # MySQL database schema & initial seed
├── seed_data.py                      # Database seeder script
├── static/                           # Uploaded product images
├── venv/                             # Python virtual environment
└── frontend/                         # React 19 + Vite frontend application
```
