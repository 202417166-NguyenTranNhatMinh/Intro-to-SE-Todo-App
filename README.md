# To-do App with AI

A web to-do app with a Personal Mode and a Group Mode (Host / Worker), plus LLM-assisted task sorting.

**Stack:** React (Vite) · Node.js + Express (TypeScript) · PostgreSQL

## Repository layout

```
todo-ai/
├── backend/     # Express API (TypeScript)
├── frontend/    # React app (Vite)
└── README.md
```

## Backend structure

All backend code lives in `backend/src`. A request flows through the layers in this order:

**route → (middleware) → controller → service → repo → database**

| Folder | Responsibility | Should NOT |
|---|---|---|
| `config/` | Environment variables (`env.ts`) and the Postgres connection pool (`db.ts`) | Contain business logic |
| `routes/` | Map URL + HTTP method to a controller and attach middlewares | Contain logic |
| `middlewares/` | Code that runs before controllers: JWT auth, input validation, error handler | Contain business rules |
| `controllers/` | Read the request (`req`), call a service, send the response (`res`) | Write SQL or check permissions |
| `services/` | Business logic: Host/Worker permission checks, AI sort flow, recurring tasks, email rate limits | Touch `req`/`res` or write SQL |
| `repo/` | All SQL queries (the only layer that talks to the database) | Make business decisions |

Other files:
- `app.ts`: creates the Express app and registers middlewares and routes
- `server.ts`: starts the server (listens on the port)

`backend/db/migrations/` (planned): numbered SQL files that define the database schema.

> Folders are created as features need them, so some may not exist yet.

## Getting started 

### 1. Install the tools

- Node.js 20+ (check with `node -v`)
- Git
- PostgreSQL 15+ (remember the password of the `postgres` user and keep port `5432`)

### 2. Clone the repo

```bash
git clone https://github.com/202417166-NguyenTranNhatMinh/Intro-to-SE-Todo-App.git
```

### 3. Create your local database

Open pgAdmin (Query Tool) or `psql` and run:

```sql
CREATE DATABASE todo_ai;
```

Each member uses their own local database. The shared part is the schema (migration files in git), not the data.

### 4. Set up the backend

```bash
cd backend
npm install
```

Create your `.env`:

```bash
# Windows PowerShell
ni .env.example 
ni .env
```

Open `.env` and replace `your_password` with your own Postgres password:

```
PORT=4000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/todo_ai
```

Never commit `.env`.

Start the backend:

```bash
npm run dev
```

You should see `Backend running on http://localhost:4000`.

### 5. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Requests to `/api` are proxied to the backend on port 4000 (see `frontend/vite.config.ts`), so the backend must be running.

## Backend scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run the server with auto-restart (tsx watch) |
| `npm run typecheck` | Check types without building |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build from `dist/` |

## Team workflow

- Never push directly to `main`. Create a branch (`feature/auth`, `fix/task-order`), open a pull request, and get at least one review.
- Pull `main` often to avoid big merge conflicts.
- Commit `package.json` and `package-lock.json`. Never commit `node_modules/`, `dist/` or `.env`.
- Database changes will go through numbered migration files in `backend/db/migrations/`. Never edit a migration that has already been merged; add a new one instead.
- If you add a new environment variable, add it to `.env.example` too (with a dummy value) so everyone knows it exists.

