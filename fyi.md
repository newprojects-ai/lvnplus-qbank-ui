# FYI / Change Log

## 2025-04-21 20:38 BST

**Environment Variable & API Base URL Refactor**

- Created a `.env` file at the project root with:
  ```
  VITE_API_BASE_URL=http://localhost:3000/api
  ```
  This allows the API base URL to be configured per environment without code changes.
- Updated `src/api/apiClient.ts` to use:
  ```typescript
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
  ```
  This reads the API base URL from the environment variable, falling back to `/api` if not set.
- Motivation: This follows best practices for configuration management in Vite/React projects, making the app more portable and easier to configure for different environments (dev, prod, test).

---

**How:**
- Used Vite's built-in support for exposing `VITE_`-prefixed variables to the frontend.
- No business logic was changed—only configuration handling.

**Why:**
- Keeps sensitive and environment-specific config out of source code.
- Makes it easy to switch API endpoints without code edits.
- Prepares the app for deployment to different environments.

---

**Action Required:**
- If you change the `.env` file, restart the Vite dev server for changes to take effect.

---

## 2025-04-24 11:21 BST

**Vite Proxy Configuration for API**

- Created `vite.config.ts` at the project root with the following content:
  ```typescript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  });
  ```
- This forwards all `/api` requests from the frontend dev server to the backend at `http://localhost:3000`, resolving CORS issues during development.
- Motivation: Ensures seamless API communication between frontend and backend in local development without CORS errors.

**How:**
- Used Vite's built-in proxy configuration in `vite.config.ts`.

**Why:**
- Avoids the need to enable CORS on the backend for local development.
- Simplifies local development setup for frontend-backend integration.

**Action Required:**
- Restart the Vite dev server (`npm run dev`) for the proxy settings to take effect.

---

## 2025-04-24 12:01 BST

**Update: Use Relative API Base URL for Vite Proxy**

- Changed `.env` configuration:
  - From: `VITE_API_BASE_URL=http://localhost:3000/api`
  - To:   `VITE_API_BASE_URL=/api`
- Motivation: Ensures that all API requests from the frontend use the Vite dev server proxy, which forwards `/api` calls to the backend and avoids CORS errors.

**How:**
- Edited `.env` to use a relative path for `VITE_API_BASE_URL`.
- No code changes required, only configuration update.

**Why:**
- Vite's proxy only intercepts relative URLs. Absolute URLs bypass the proxy and cause CORS errors.
- This change ensures a smooth local development experience.

**Action Required:**
- Restart the Vite dev server (`npm run dev`) for the new `.env` setting to take effect.

---

## 2025-04-24 12:04 BST

**Update: Vite Proxy Port Change**

- Changed `vite.config.ts` proxy configuration:
  - From: `/api` → `http://localhost:3000`
  - To:   `/api` → `http://localhost:3001`
- Motivation: Backend server is running on port 3001, not 3000. This ensures API requests are correctly proxied to the backend.

**How:**
- Edited `vite.config.ts` to update the proxy target port.

**Why:**
- Ensures the frontend communicates with the correct backend port during local development.

**Action Required:**
- Restart the Vite dev server (`npm run dev`) for the new proxy port to take effect.

---

## 2025-04-24 12:09 BST

**Stackblitz Import Fix: Added .stackblitz.json**

- Created `.stackblitz.json` at the project root with the following content:
  ```json
  {
    "startCommand": "npm run dev",
    "installCommand": "npm install",
    "projectType": "vite",
    "appFiles": [
      "index.html",
      "src/main.tsx",
      "src/App.tsx"
    ]
  }
  ```
- Motivation: Stackblitz expects a `.stackblitz.json` file to define how to start and install the project, as well as which files are considered main app entry points. This avoids the `Cannot destructure property 'appFiles' of 'project' as it is null.` error during import.

**How:**
- Added `.stackblitz.json` with required fields for Stackblitz compatibility.

**Why:**
- Ensures seamless import and auto-bootstrapping of the project in Stackblitz.

**Action Required:**
- Push this file to your repository before re-importing into Stackblitz.

---

*Logged automatically by Cascade AI assistant.*
