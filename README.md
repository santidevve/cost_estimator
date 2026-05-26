# Fast Food Cost Estimator (PWA)

This project is a mobile-first Progressive Web App (PWA) designed to help fast-food small business owners estimate recipe costs, profit margins, operational overhead (fixed costs), and monthly net profit projections.

The system is built with a **React + Vite** frontend client and a **Node.js + Express** API backend, backed by a **Neon Serverless Postgres** database in the cloud.

---

## Prerequisites

- **Node.js** (v18 or higher)
- **NPM** (v9 or higher)
- **PostgreSQL** (v13 or higher, or a Neon Postgres cloud account)

---

## Database Configuration

1. Log in to your cloud database provider (e.g., [Neon.tech](https://neon.tech/)) or local PostgreSQL database.
2. Create an empty database:
   ```sql
   CREATE DATABASE cost_estimator_db;
   ```
3. There is no need to manually create tables or run schemas. The backend server automatically detects and applies migrations to construct the database schema on startup.

---

## Backend Configuration & Execution

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file based on `.env.example`. Enter your database connection details:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_token
   
   # Connection string for Neon Postgres
   DATABASE_URL=postgresql://neondb_owner:password@ep-host.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will start running at `http://localhost:5000` and initialize all database tables.

---

## Frontend Configuration & Execution

1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Vite will serve the client application at `http://localhost:5173`.

---

## How to Test on Your Android Phone (Local Network)

Since this is a Progressive Web App (PWA), you can install it directly onto your Android device's home screen:

1. Ensure both your computer and Android phone are connected to the **same Wi-Fi network**.
2. When starting the frontend development server (`npm run dev`), the terminal will output the local network URL:
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.45:5173/
   ```
3. Open **Google Chrome** on your Android phone and type in the **Network** address (e.g., `http://192.168.x.x:5173/`).
4. To install the app on your home screen:
   - Tap the three vertical dots icon in Chrome's top-right corner.
   - Select **"Install app"** or **"Add to Home screen"**.
   - Tap install. A hamburger icon (🍔) will appear on your phone's desktop, opening the cost estimator in fullscreen standalone mode.
