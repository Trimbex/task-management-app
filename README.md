# Task Management App

A small full-stack task manager.

- `backend/` - Express.js API (Tasks, Activity Log, Reports). Data lives in local JSON files.
- `frontend/` - Next.js (App Router, TypeScript) app with a Task Dashboard, Activity Feed and Reports page.

## Run

```bash
# API on http://localhost:3000
cd backend && npm install && npm start

# Web app on http://localhost:3001
cd frontend && cp .env.example .env.local && npm install && npm run dev -- -p 3001
```

Endpoints are documented in `frontend/docs/backend-endpoints.md`. Code review notes are in `REVIEW.md`.
