// Base URL for the backend API.
// In dev, leave VITE_API_URL unset — Vite's proxy (vite.config.js) forwards
// /api requests to http://localhost:5000 automatically.
// In production (separate frontend/backend deploys), set VITE_API_URL to the
// live backend URL, e.g. https://your-backend.onrender.com — see .env.production.
export const API_BASE = import.meta.env.VITE_API_URL || '';
