---
name: dev
description: >-
  Comprehensive development workflow for the Trang Suc luxury jewelry web project.
  Use this skill whenever running dev servers (Flask backend on port 5000, Vite React frontend on port 5173),
  managing MySQL database (wed_trang_suc), running tests or linter (Oxlint, Puppeteer, API health check),
  diagnosing runtime issues, or developing new features following the project architecture and coding standards.
---

# Trang Suc Development Skill

This skill guides the agent and developer through running, developing, testing, and maintaining the **Trang Suc (Aura Luxury Jewelry)** full-stack application.

---

## 1. Quick Environment Diagnosis

Before making changes or launching servers, run the dev health check script:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/dev/scripts/check_health.ps1
```

Script reference: [check_health.ps1](./scripts/check_health.ps1)

This checks:
- Python virtual environment (`venv/Scripts/python.exe`)
- Frontend `node_modules`
- MySQL server connection on `127.0.0.1:3306`
- Backend Flask status on port 5000
- Frontend Vite status on port 5173

---

## 2. Running Development Servers

The application requires both Backend (Flask) and Frontend (Vite) running simultaneously.

### 2.1 Backend (Flask - Port 5000)
Run in root directory:
```powershell
.\venv\Scripts\python.exe app.py
```
- Listens on `http://127.0.0.1:5000`
- REST APIs are registered under `/api/*`
- Static uploads are served at `/static/uploads/*`
- Database: MySQL `wed_trang_suc` configured in `config.py`

### 2.2 Frontend (React + Vite - Port 5173)
Run in `frontend/` directory:
```powershell
cd frontend
npm run dev
```
- Listens on `http://localhost:5173`
- Requests to `/api/*` and `/static/*` are automatically proxied to Flask port 5000 by Vite.

---

## 3. Automated Testing & Verification

Run the automated test runner:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/dev/scripts/run_tests.ps1
```

To include Puppeteer headless UI screenshots and console error checking:
```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/dev/scripts/run_tests.ps1 -IncludeUI
```

Script reference: [run_tests.ps1](./scripts/run_tests.ps1)

### Manual Test Commands:
- **Linting Frontend**:
  ```powershell
  cd frontend; npm run lint
  ```
- **API Sanity Check**:
  ```powershell
  curl http://127.0.0.1:5000/api/products
  curl http://127.0.0.1:5000/api/categories
  ```
- **Headless Browser Test**:
  ```powershell
  cd frontend; node test_ui_puppeteer.js
  ```

---

## 4. Development & Coding Workflows

### 4.1 Adding a New API Endpoint
1. Open `api_routes.py`.
2. Define the route under `@api_bp.route('/your-endpoint', methods=['GET', 'POST', ...])`.
3. Use parameterized queries via `db.query_all`, `db.query_one`, or `db.execute`.
4. Wrap results with `clean_row()` or `clean_rows()` to handle `Decimal` and `datetime` serialization.
5. In React (`frontend/src/services/`), add corresponding API client methods using Axios.

### 4.2 Adding a New Frontend Page / Component
1. Create component under `frontend/src/pages/` or `frontend/src/components/`.
2. Utilize MUI components with theme colors (`#C5A880`, gold, luxury tones) from `frontend/src/theme/`.
3. Register new routes in `frontend/src/App.jsx`.
4. Validate with `npm run lint`.

### 4.3 Database Schema Updates
- Inspect current schema in `wed_trang_suc.sql`.
- If modifying tables, write clear migration SQL statements and execute them against the `wed_trang_suc` database.
- Keep `seed_data.py` up to date if new default values are introduced.

---

## 5. Detailed Architecture & Reference Guides

For in-depth documentation, consult the following references:
- **[System Architecture & Tech Stack](./references/architecture.md)**: Full component breakdown, proxy mappings, and directory structure.
- **[REST API Reference](./references/api_endpoints.md)**: All endpoints, query parameters, request bodies, and JSON responses.
- **[Coding Standards & Best Practices](./references/coding_standards.md)**: SQL safety, decimal serialization, MUI theming guidelines, and error response conventions.

---

## 6. Troubleshooting Common Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `Can't connect to MySQL server on 'localhost'` | MySQL service stopped | Start MySQL via XAMPP or Windows Service (`net start MySQL`) |
| `TypeError: Object of type Decimal is not JSON serializable` | Returning raw PyMySQL dict | Pass data through `clean_row(row)` or `clean_rows(rows)` in `api_routes.py` |
| `CORS Error in Browser` | Direct calls to 5000 bypassing Vite proxy | Use relative path `/api/...` so Vite forwards requests to port 5000 |
| `Port 5000 / 5173 already in use` | Zombie background process | Run `Get-NetTCPConnection -LocalPort 5000` and kill using `Stop-Process -Id <PID>` |
