# TechDesk Frontend - React SPA

Modern, responsive React 19 + Vite application with Tailwind CSS styling.

## Setup

npm install && npm run dev

App runs on http://localhost:5173

## Key Technologies

- React 19 with Vite
- Tailwind CSS with dark mode
- Zustand for state management
- React Router for navigation
- Axios for API calls

## Folder Structure

- pages/ - Full-page components
- components/ - Reusable UI components
- store/ - Zustand stores
- services/ - API client
- utils/ - Utility functions
- styles/ - Global CSS

## Development Scripts

npm run dev    - Start dev server
npm run build  - Production build
npm run lint   - ESLint auto-fix

## Authentication

JWT-based with automatic token refresh.
Tokens stored in Zustand store (persisted to localStorage).

## Deployment

npm run build && Deploy dist/ folder to Vercel or similar.
