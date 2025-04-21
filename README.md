# UI Components Only

This folder contains a standalone copy of the UI components and pages from the LVNPlus QBank monorepo.

## Structure
- `components/` – All UI components
- `pages/` – All UI pages
- `package.json` – Basic project metadata and dependencies (copied from the main UI app)

## Usage
You can use this folder to:
- Develop or test UI components in isolation
- Share UI components with other projects
- Quickly prototype UI changes without the rest of the monorepo

## How to Run
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start your dev server (if you add an entry point):
   ```sh
   npm run dev
   ```

## Notes
- If your components/pages depend on utilities or types from elsewhere in the monorepo, you may need to copy those as well.
- For a fully runnable app, add an `index.tsx` or `App.tsx` entry point and update `package.json` scripts as needed.
