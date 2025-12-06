# Exodia Server

Backend implementation for the Exodia Excel-to-dashboard platform. The service is designed to satisfy the requirements in `PRD.txt`, focusing on fast CRUD automation over uploaded Excel workbooks, GitHub repo generation, and a documented API surface for hackathon demos.

## Architecture Overview

- **Runtime**: Node.js 20 LTS, plain JavaScript modules.
- **Framework**: [Hono](https://hono.dev/) with `@hono/node-server` for lightweight routing and Web Standard APIs.
- **Database**: PostgreSQL (via Docker `pgvector/pgvector:pg18-trixie`). Accessed through a shared `pg` pool.
- **Storage**: Local `/uploads/{userId}/{excelId}.xlsx` hierarchy for source Excel files.
- **Excel CRUD**: Powered by `xlsx` for schema discovery plus sheet read/write helpers.
- **GitHub Automation**: [`octokit`](https://github.com/octokit/octokit.js) authenticated with a system PAT (`GITHUB_PAT`). Creates repos named `exodia-{userId}-{excelId}` and seeds generated files.
- **Auth**: JWT-based sessions with password hashing (bcrypt). Tokens guard all CRUD routes.
- **Docs / DX**: OpenAPI 3.1 spec under `openapi/exodia.yaml` plus Swagger UI served at `/docs`.

## High-Level Flow

1. **Upload**: User uploads an Excel file → stored under `/uploads/{userId}/{excelId}.xlsx` and parsed for schema metadata.
2. **AI Code Generation**: Backend invokes the internal AI/gen service (stubbed initially) that returns React dashboard files + `metadata.json`.
3. **GitHub Repo**: Service creates a GitHub repo with PAT, pushes generated files, and persists repo metadata in Postgres.
4. **Dashboard Viewer**: Frontend fetches raw files from GitHub and renders dynamic components.
5. **CRUD Engine**: REST endpoints (Hono) mutate Excel rows (POST/PUT/DELETE) and return updated sheet snapshots (GET).

## Directory Layout (planned)

```
server/
  package.json
  src/
    app.js              # Hono app + routers
    env.js              # Centralized env validation
    config/
      db.js             # Postgres pool
      storage.js        # Upload paths
    middleware/
      auth.js           # JWT verification
      error.js          # Error formatter
    modules/
      auth/
      excel/
      github/
      repos/
    routes/
      auth.js
      excel.js
      sheets.js
      repos.js
    services/
      authService.js
      excelService.js
      sheetService.js
      repoService.js
    utils/
      logger.js
      crypto.js
  openapi/
    exodia.yaml
  uploads/
```

## Environment Variables

| Variable         | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `PORT`           | HTTP port (default 8000)                                  |
| `DATABASE_URL`   | Postgres connection string                                |
| `JWT_SECRET`     | Secret for signing/verifying JWTs                         |
| `GITHUB_PAT`     | Personal access token with repo scope                     |
| `OPENAI_API_KEY` | Enable OpenAI chat completions for dashboard generation   |
| `OPENAI_MODEL`   | OpenAI model name (default `gpt-5.1`)                     |
| `CLAUDE_API_KEY` | Enable Claude (Anthropic) completions for generation      |
| `CLAUDE_MODEL`   | Claude model name (default `claude-3-5-sonnet-20241022`)  |
| `UPLOAD_DIR`     | Absolute path to Excel storage (default `server/uploads`) |

### Sample `.env`

Create `server/.env` (the file is git-ignored) with at least:

```
PORT=8000
JWT_SECRET=change-me-to-at-least-32-characters
DATABASE_URL=postgres://postgres:postgres@localhost:5432/exodia
GITHUB_PAT=ghp_your_token_here
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-5
CLAUDE_API_KEY=sk-ant-your-claude-key
CLAUDE_MODEL=claude-4.5-sonnet
UPLOAD_DIR=./uploads
```

## Database via Docker

1. From the `server/` directory, start the pgvector container:  
   `docker compose up -d postgres`
2. Ensure `DATABASE_URL` in your `.env` points to `postgres://postgres:postgres@localhost:5432/exodia`.
3. When finished, stop the container with `docker compose down` (add `-v` if you also want to remove the persisted volume).

> **Note:** Postgres 18+ images expect the volume to mount `/var/lib/postgresql` (not `/var/lib/postgresql/data`). If you already ran an older configuration, remove the stale `postgres-data` volume (`docker compose down -v`) before starting again, otherwise the container will warn about leftover data.

The compose file uses the `pgvector/pgvector:pg18-trixie` image and stores data in the `postgres-data` volume by default.

## Run Locally

1. **Install dependencies**

   ```bash
   npm --prefix server install
   ```

2. **Prepare environment**

   - Copy `server/.env.example` → `server/.env` (or create a new file) and populate it.
   - `JWT_SECRET` must be at least 32 characters.
   - `DATABASE_URL` enables Postgres persistence (falls back to in-memory without it).
   - `GITHUB_PAT` needs `repo` scope for publishing dashboards. Without it, `/repos/:excelId/publish` will return an error.
   - Set either `OPENAI_API_KEY` (optionally override `OPENAI_MODEL`) or `CLAUDE_API_KEY` (optionally override `CLAUDE_MODEL`) so the AI generator can produce dashboard files automatically.
   - Override `UPLOAD_DIR` if you don’t want files under `server/uploads`.

3. **Start the API**

   ```bash
   npm --prefix server run dev
   ```

   Use `npm --prefix server start` for a non-watching process. Once running, hit `http://localhost:8000/health` for a heartbeat and `http://localhost:8000/docs` for Swagger UI backed by `openapi/exodia.yaml`.

## API Surface (initial)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/uploads/excel` (multipart form upload)
- `GET /api/v1/sheets/:excelId`
- `GET /api/v1/sheets/:excelId/:sheetName`
- `POST /api/v1/sheets/:excelId/:sheetName/rows`
- `PUT /api/v1/sheets/:excelId/:sheetName/rows/:rowId`
- `DELETE /api/v1/sheets/:excelId/:sheetName/rows/:rowId`
- `POST /api/v1/repos/:excelId/publish` (optional JSON body `{ "prompt": "Describe the dashboard you'd like", "theme": "corporate" }` → Uses OpenAI or Claude to generate dashboard code. Falls back to template if AI fails. Response includes `generator` (openai/claude/template) and `generatorReason` to show what happened.)
- `GET /api/v1/repos`

All mutating routes require `Authorization: Bearer <token>` headers.

## Milestone Tracking

The implementation sequence mirrors the PRD milestones:

1. **Core backend & auth**
2. **Excel ingestion + schema extraction**
3. **AI codegen integration**
4. **GitHub automation + repo persistence**
5. **CRUD engine and sheet APIs**
6. **OpenAPI docs + polish**

This README will stay in sync with actual code to give contributors a quick ramp-up during the hackathon.
