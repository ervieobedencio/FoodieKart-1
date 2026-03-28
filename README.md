# FoodieKart

Overview: monorepo with a Laravel backend (`backend/`) and a Vite + React frontend (`frontend/`).

## Prerequisites
- PHP 8.1+ and Composer
- Node.js 16+ and npm
- (Optional) SQLite, MySQL, or PostgreSQL for database

## Backend (Laravel)
1. Open PowerShell and change to the backend folder:

```powershell
cd backend
```

2. Install PHP dependencies and environment:

```powershell
composer install
copy .env.example .env
php artisan key:generate
```

3. Configure the database in `.env`.
   - For a quick local setup you can use SQLite:

```powershell
# create the sqlite file
New-Item -Path database\database.sqlite -ItemType File -Force
# then set in .env: DB_CONNECTION=sqlite and DB_DATABASE=database\database.sqlite
```

4. Run migrations and seeders:

```powershell
php artisan migrate --seed
```

5. Start the backend server:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

The backend will be available at http://127.0.0.1:8000 by default.

## Frontend (Vite + React)
1. In a new terminal, change to the frontend folder:

```powershell
cd frontend
```

2. Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

Vite will print the local dev URL (commonly http://localhost:5173).

## Running Tests
- Backend PHPUnit: from `backend` run `php artisan test`.
- Frontend: run any test scripts defined in `frontend/package.json` (e.g. `npm test`).

## Notes
- If you change ports or hostnames, update the frontend API base URL accordingly (see `frontend/src/api` if present).
- For production builds use `npm run build` in `frontend` and deploy the `dist` output alongside a production-ready server for the backend.

---
Project-specific READMEs:

- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
