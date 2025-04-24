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

*Logged automatically by Cascade AI assistant.*
