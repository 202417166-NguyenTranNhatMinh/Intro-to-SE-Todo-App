# To-do App with AI

A web to-do app with a Personal Mode and a Group Mode (Host / Worker), with AI-assisted comment summaries and progress reports for group Hosts.

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
| `services/` | Business logic: Host/Worker permission checks, business rules and permission checks | Touch `req`/`res` or write SQL |
| `repo/` | All SQL queries (the only layer that talks to the database) | Make business decisions |

Other files:
- `app.ts`: creates the Express app and registers middlewares and routes
- `server.ts`: starts the server (listens on the port)

`backend/db/migrations/`: numbered SQL files that define the database schema.

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
Copy-Item .env.example .env
```

Open `.env` and configure your PostgreSQL password, frontend URL, Google OAuth credentials and a long random JWT secret. Register the callback URL shown in `.env.example` in your Google OAuth configuration:

```
PORT=4000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/todo_ai
```

Never commit `.env`.

Apply database migrations, then start the backend:

```bash
npm run db:migrate
```


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
| `npm run db:migrate` | Apply pending SQL migrations to the database in `DATABASE_URL` |
| `npm test` | Run backend tests |
| `npm run typecheck` | Check types without building |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build from `dist/` |

## Team workflow

- Never push directly to `main`. Create a branch (`feature/auth`, `fix/task-order`), open a pull request, and get at least one review.
- Pull `main` often to avoid big merge conflicts.
- Commit `package.json` and `package-lock.json`. Never commit `node_modules/`, `dist/` or `.env`.
- Database changes will go through numbered migration files in `backend/db/migrations/`. Never edit a migration that has already been merged; add a new one instead.
- If you add a new environment variable, add it to `.env.example` too (with a dummy value) so everyone knows it exists.


## Database migrations

From `backend/`, run `npm run db:migrate` after setting `DATABASE_URL` in `.env`. The runner reads numbered `.sql` files in `backend/db/migrations/` in filename order. It records each applied filename and SHA-256 checksum in `schema_migrations`; rerunning skips applied files and stops if an applied file has changed. Each migration runs in a transaction, and a PostgreSQL advisory lock prevents concurrent runners. Add a new numbered file for each schema change; do not edit applied migrations. SQL files must be compatible with running in a transaction.

For an existing local database where SQL was applied manually, first compare the actual schema against each migration file. Only after verifying that a file was fully applied, record it without executing its SQL, for example:

```bash
npm run db:migrate -- --baseline 001_create_users.sql 002_create_tasks.sql
npm run db:migrate
```

List only files already fully applied; baselining does not inspect or change the existing schema. If a migration was only partially applied, reconcile the schema manually before baselining. Back up data before making schema changes.

## API contracts and errors

Backend request and response types are in `backend/src/contracts/`. The current API specification is [`docs/openapi.yaml`](docs/openapi.yaml), which can be opened in an OpenAPI viewer. It describes the endpoints implemented today, not the planned features in the business rules.

JSON success and error responses use `{ "status": 200, "message": "Success", "data": ... }`; `status` matches the HTTP status. Errors use the same shape with an appropriate status and normally `data: null`. Unexpected errors return a generic 500 message. Google OAuth endpoints redirect, and successful task deletion and logout return HTTP 204 without a body. The task API remains authenticated and scoped to the current user.

This response envelope changes the previous task and health JSON response format; clients must read the payload from `data` (the frontend auth client has been updated).
