# TodoList DevOps

[![Docker](https://img.shields.io/badge/Docker-24%2B-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](.github/workflows/ci.yml)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway&logoColor=white)](https://railway.app)

> A three-tier ToDoList application containerized and deployed with a full DevOps lifecycle.  
> **Stack:** Nginx (frontend) · Node.js + Sequelize (backend) · MySQL 8 (database)

---

## Project Description

**TodoList DevOps** is a production-style full-stack application used as a vehicle for demonstrating a complete DevOps deployment lifecycle. The application itself is a blog/notes management interface (CRUD), while the surrounding infrastructure showcases containerization, CI/CD, image registry workflows, monitoring, and cloud deployment.

The project is designed to be portfolio-ready: it runs locally with a single `docker compose` command, passes automated lint and test gates in CI, publishes images to GitHub Container Registry (GHCR), and deploys to Railway on every push to `main`.

---

## Features

| Area | Capability |
|------|------------|
| **Application** | Create, read, update, and delete blog entries via a React SPA |
| **API** | RESTful Express backend with Sequelize ORM and MySQL persistence |
| **Containerization** | Multi-stage Dockerfiles with health checks and non-root backend runtime |
| **Local orchestration** | Docker Compose stack: frontend, backend, MySQL, Uptime Kuma |
| **CI/CD** | GitHub Actions pipeline: lint, test, build, push, deploy |
| **Registry** | Images tagged by Git SHA and `latest` on GHCR |
| **Cloud deploy** | Railway deployment with managed MySQL (`DATABASE_URL`) |
| **Ops scripts** | Bootstrap, deploy, backup, and rollback shell scripts |
| **Monitoring** | Uptime Kuma sidecar for HTTP/TCP uptime checks |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, Bootstrap 5, Axios |
| Web server | Nginx (Alpine) — static assets + reverse proxy |
| Backend | Node.js 20, Express 4, Sequelize 6 |
| Database | MySQL 8.0 |
| Container runtime | Docker 24+, Docker Compose v2 |
| CI/CD | GitHub Actions, GHCR, Railway |
| Production proxy | Caddy 2 (prod compose) |
| Monitoring | Uptime Kuma |
| Quality gates | ESLint, Jest, Supertest |

---

## Architecture

### System overview

```mermaid
flowchart LR
    Developer --> GitHub
    GitHub --> GitHubActions["GitHub Actions"]
    GitHubActions --> GHCR["GHCR"]
    GHCR --> Railway
    Railway --> Frontend
    Frontend --> Backend
    Backend --> MySQL
    UptimeKuma["Uptime Kuma"] --> Frontend
    UptimeKuma --> Backend
    UptimeKuma --> MySQL
```

### Local development

```
[Browser] → [Nginx :80] → [Node.js API :3000] → [MySQL :3306]
                                    ↑
                          [Uptime Kuma :3001]
```

### Production (docker-compose.prod.yml)

```
[Browser] → [Caddy :80/:443] → [frontend] → [backend] → [MySQL]
```

### Component reference

| Service | Role | Port |
|---------|------|------|
| **frontend** | React SPA served by Nginx; reverse-proxies `/api/*` to the backend | 80 |
| **backend** | Express + Sequelize REST API; exposes `/health` and `/blogs` routes | 3000 |
| **db** | MySQL 8 persistent storage; initialized via `db/init.sql` | 3306 |
| **monitoring** | Uptime Kuma uptime dashboard | 3001 |
| **caddy** | Production reverse proxy with HTTPS routing (prod only) | 80 / 443 |

---

## Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── backend/
│   ├── __tests__/              # Jest tests (health endpoint)
│   ├── controllers/            # Route handlers
│   ├── database/               # Sequelize connection
│   ├── models/                 # Sequelize models
│   ├── routes/                 # Express routers
│   ├── Dockerfile              # Multi-stage, non-root
│   └── railway.json            # Railway service config
├── frontend/
│   ├── src/                    # React application
│   ├── Dockerfile              # Multi-stage React → Nginx
│   └── railway.json            # Railway service config
├── db/
│   └── init.sql                # MySQL schema bootstrap
├── nginx/
│   ├── default.conf            # Dev reverse proxy
│   └── Caddyfile               # Prod reverse proxy
├── scripts/
│   ├── bootstrap.sh            # Provision Ubuntu host
│   ├── deploy.sh               # Production deploy
│   ├── backup-db.sh            # MySQL backup
│   ├── rollback.sh             # Image rollback
│   └── railway-setup.md        # Railway setup guide
├── monitoring/
│   └── README.md               # Uptime Kuma configuration
├── docker-compose.yml          # Local development stack
├── docker-compose.prod.yml     # Production stack
├── railway.json                # Railway project config
├── .env.example                # Environment template
└── README.md
```

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Docker | >= 24 |
| Docker Compose plugin | v2 (`docker compose`) |
| Git | Latest stable |
| Node.js (local dev only) | 20.x recommended |

---

## Quickstart

### 1. Clone

```bash
git clone <repo>
cd <repo>
```

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env` and replace placeholder passwords with strong values.

### 3. Start

```bash
docker compose up -d --build
```

### 4. Verify

```bash
docker compose ps
```

All services should show `running` or `healthy`.

### Local URLs

| Service | URL |
|---------|-----|
| Application | http://localhost |
| API health | http://localhost/api/health |
| Monitoring | http://localhost:3001 |

---

## Installation

### Docker (recommended)

The entire stack runs with Docker Compose. No local Node.js or MySQL installation is required.

```bash
cp .env.example .env
docker compose up -d --build
```

### Manual (without Docker)

<details>
<summary>Click to expand manual setup steps</summary>

**Backend**

```bash
cd backend
npm ci
npm start
```

**Frontend**

```bash
cd frontend
npm ci
npm start
```

**Database**

Run MySQL 8 locally and create the `todolist` database. Schema is defined in `db/init.sql`.

</details>

---

## Environment Variables

> **Warning:** Never commit `.env` to version control. Copy `.env.example` and fill in real values.

### Docker Compose (local)

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `changeme_root_strong` |
| `MYSQL_DATABASE` | Database name | `todolist` |
| `MYSQL_USER` | Application database user | `todolist_user` |
| `MYSQL_PASSWORD` | Application database password | `changeme_strong` |
| `DB_HOST` | Database hostname (Docker service name) | `db` |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Sequelize database name | `todolist` |
| `DB_USER` | Sequelize database user | `todolist_user` |
| `DB_PASSWORD` | Sequelize database password | `changeme_strong` |
| `GITHUB_REPOSITORY` | GHCR image namespace | `your_github_username/your_repo_name` |
| `IMAGE_TAG` | Docker image tag for prod deploys | `latest` |

### Railway (production — set in Railway dashboard)

| Variable | Description | Source |
|----------|-------------|--------|
| `DATABASE_URL` | MySQL connection string | Auto-provided by Railway MySQL plugin |
| `PORT` | HTTP listen port | Auto-provided by Railway |
| `NODE_ENV` | Runtime environment | Set to `production` |
| `REACT_APP_API_URL` | Frontend API base URL | Your Railway backend URL (see `scripts/railway-setup.md`) |

### Railway / CI (commented in `.env.example`)

| Variable | Description | Where to set |
|----------|-------------|--------------|
| `DATABASE_URL` | `mysql://user:password@host:port/dbname` | Railway dashboard only |
| `RAILWAY_TOKEN` | Railway API token | GitHub Actions secret |
| `RAILWAY_PROJECT_ID` | Railway project identifier | GitHub Actions secret |

---

## Running with Docker

### Start the stack

```bash
docker compose up -d
```

### View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Stop the stack

```bash
docker compose down
```

### Rebuild after changes

```bash
docker compose up -d --build
```

### Production compose (self-hosted)

```bash
IMAGE_TAG=<sha> GITHUB_REPOSITORY=<owner/repo> docker compose -f docker-compose.prod.yml up -d
```

---

## Local Development

### Backend

```bash
cd backend
npm ci
npm run lint
npm test
npm start
```

Default port: **8000** (when `PORT` is not set).

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /blogs` | List all blogs |
| `POST /blogs` | Create a blog |
| `GET /blogs/:id` | Get one blog |
| `PUT /blogs/:id` | Update a blog |
| `DELETE /blogs/:id` | Delete a blog |

### Frontend

```bash
cd frontend
npm ci
npm start
```

Default port: **3000** (React dev server).

> **Tip:** The frontend currently calls `http://localhost:8000` directly. When testing through Docker/Nginx, use `/api/` paths or set `REACT_APP_BACKEND_URL` at build time.

---

## Health Checks

Health checks ensure services are ready before dependents start and allow orchestrators to restart unhealthy containers.

### Backend — `GET /health`

```bash
# Local (direct)
curl http://localhost:8000/health

# Docker (via Nginx proxy)
curl http://localhost/api/health
```

**Expected response:**

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```

**Why it exists:** Confirms the Express process is alive and responding. Used by the backend Dockerfile `HEALTHCHECK`, Docker Compose `depends_on` conditions, and Uptime Kuma.

### Frontend — `GET /`

```bash
curl -I http://localhost
```

**Why it exists:** Verifies Nginx is serving the React build. Used by the frontend Dockerfile `HEALTHCHECK`.

### MySQL — `mysqladmin ping`

Configured in `docker-compose.yml` for the `db` service.

```bash
docker compose exec db mysqladmin ping -h 127.0.0.1 -u root -p
```

**Why it exists:** Ensures the database accepts connections before the backend starts.

---

## Monitoring

[Uptime Kuma](https://github.com/louislam/uptime-kuma) runs as a sidecar container on port **3001**.

### First launch

1. Open http://localhost:3001
2. Create an admin account

### Recommended monitors

| Name | Type | Target | Interval | Purpose |
|------|------|--------|----------|---------|
| Frontend | HTTP | `http://localhost:80` | 60s | Detect Nginx / SPA outages |
| Backend Health | HTTP | `http://localhost/api/health` | 60s | Detect API failures |
| MySQL | TCP | `db:3306` | 60s | Detect database connectivity issues |

### Useful commands

```bash
docker compose ps
docker compose logs -f backend
docker compose restart backend
```

> **Note:** Monitors must be configured manually after the first Uptime Kuma launch. See [`monitoring/README.md`](monitoring/README.md) for details.

---

## CI/CD Pipeline

Workflow file: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

### Triggers

| Event | Branches | Jobs executed |
|-------|----------|---------------|
| `push` | All (`**`) | lint-and-test, build-and-push, deploy (main only) |
| `pull_request` | `main` | lint-and-test |

### Pipeline stages

```mermaid
flowchart LR
    A[Push / PR] --> B[Lint & Test]
    B --> C[Build & Push]
    C --> D[Deploy to Railway]
```

---

### Stage 1 — Lint & Test

| | |
|---|---|
| **Job** | `lint-and-test` |
| **Trigger** | Every push and PR to `main` |
| **Input** | Source code from `backend/` |
| **Steps** | `npm ci` → `npm run lint` → `npm test` |
| **Output** | Pass/fail gate for downstream jobs |
| **On failure** | Pipeline stops; no images built or deployed |

**Purpose:** Enforce code quality (ESLint) and verify the `/health` endpoint via Jest + Supertest with mocked Sequelize.

---

### Stage 2 — Build & Push Images

| | |
|---|---|
| **Job** | `build-and-push` |
| **Trigger** | After `lint-and-test` succeeds |
| **Input** | Dockerfiles in `backend/` and `frontend/` |
| **Output** | Images pushed to `ghcr.io/<owner>/todolist/backend` and `ghcr.io/<owner>/todolist/frontend` |
| **Tags** | `<git-sha>` and `latest` |
| **Cache** | GitHub Actions cache (scope: `backend`, `frontend`) |
| **On failure** | Deploy job is skipped |

**Purpose:** Produce immutable, versioned container images for every successful build.

---

### Stage 3 — Deploy to Railway

| | |
|---|---|
| **Job** | `deploy` |
| **Trigger** | Push to `main` only, after `build-and-push` |
| **Input** | `RAILWAY_TOKEN`, `RAILWAY_PROJECT_ID` secrets |
| **Action** | Triggers Railway deployment via GraphQL API |
| **Output** | New deployment on Railway |
| **On failure** | Workflow reports failure; previous Railway deployment remains active |

**Purpose:** Automatically ship the latest passing build to the cloud on every merge to `main`.

---

### GitHub Secrets

| Secret | Description | How to obtain |
|--------|-------------|---------------|
| `RAILWAY_TOKEN` | Railway API authentication token | Railway → Account Settings → Tokens |
| `RAILWAY_PROJECT_ID` | Target Railway project ID | Railway → Project → Settings |

> See [`scripts/railway-setup.md`](scripts/railway-setup.md) for the complete Railway + GitHub secrets setup guide.

---

## Deployment

### Railway (cloud — primary)

#### Automated (CI/CD)

On every push to `main`:

1. `lint-and-test` passes
2. Images are pushed to GHCR
3. Railway deployment is triggered via API

#### Manual

```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

#### Railway backend variables

Set in the Railway dashboard for the **backend** service:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Reference from Railway MySQL plugin |
| `PORT` | Auto-provided by Railway |
| `NODE_ENV` | `production` |

#### Railway frontend variables

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | Your Railway backend URL |

> Full setup: [`scripts/railway-setup.md`](scripts/railway-setup.md)

---

### Self-hosted production (docker-compose.prod.yml)

```bash
IMAGE_TAG=<sha> GITHUB_REPOSITORY=<owner/repo> bash scripts/deploy.sh
```

Rollback to a previous version:

```bash
bash scripts/rollback.sh <IMAGE_TAG>
```

---

## Bash Scripts

All scripts use `#!/usr/bin/env bash` and `set -euo pipefail` for safe execution.

---

### `scripts/bootstrap.sh`

| | |
|---|---|
| **Purpose** | Provision a fresh Ubuntu 22.04 host with Docker CE, a `deploy` user, and a cloned repository |
| **When to use** | First-time server setup |
| **Requires** | Root or sudo |

```bash
sudo bash scripts/bootstrap.sh
```

**Expected behavior:** Installs Docker, creates the `deploy` user, clones the repo to `/home/deploy/todolist-devops`, and copies `.env.example` to `.env`.

---

### `scripts/deploy.sh`

| | |
|---|---|
| **Purpose** | Pull latest GHCR images and redeploy the production Docker Compose stack |
| **When to use** | Self-hosted production deployments |
| **Requires** | `IMAGE_TAG` and `GITHUB_REPOSITORY` environment variables |

```bash
IMAGE_TAG=abc123 GITHUB_REPOSITORY=you/repo bash scripts/deploy.sh
```

**Expected behavior:** Pulls images, runs `docker compose -f docker-compose.prod.yml up -d`, prunes unused images.

---

### `scripts/backup-db.sh`

| | |
|---|---|
| **Purpose** | Dump the MySQL database from the running container |
| **When to use** | Before risky changes or on a schedule |
| **Retention** | Keeps the last 7 backups in `./backups/` |

```bash
bash scripts/backup-db.sh
```

**Expected behavior:** Creates `backups/todolist_<timestamp>.sql` and removes older files beyond the retention limit.

---

### `scripts/rollback.sh`

| | |
|---|---|
| **Purpose** | Roll back to a specific image tag |
| **When to use** | After a bad deployment |

```bash
bash scripts/rollback.sh abc123
```

**Expected behavior:** Pulls and starts services with the specified `IMAGE_TAG` via `docker-compose.prod.yml`.

---

## Dev vs Production

| Concern | Dev (`docker-compose.yml`) | Prod (`docker-compose.prod.yml`) | Railway |
|---------|---------------------------|----------------------------------|---------|
| Images | Built from local source | Pulled from GHCR by SHA | Built from GitHub repo / GHCR |
| Reverse proxy | Nginx inside frontend container | Caddy (HTTPS + routing) | Railway public URLs |
| Database | MySQL container | MySQL container | Railway MySQL plugin |
| Restarts | `unless-stopped` | `always` | Managed by Railway |
| HTTPS | No | Yes (Caddy + Let's Encrypt) | Yes (Railway) |
| Monitoring | Uptime Kuma on `:3001` | Uptime Kuma on `:3001` | Manual setup |
| Deploy trigger | Manual `docker compose up` | `scripts/deploy.sh` or CI | CI on push to `main` |

---

## Security Notes

> **Warning:** Never commit `.env`, credentials, or Railway tokens to the repository.

- All secrets are supplied via `.env` (local) or platform dashboards (Railway, GitHub Secrets).
- The backend Docker image runs as a non-root user (`appuser`).
- Database passwords must be strong and unique per environment.
- `DATABASE_URL` on Railway is injected by the managed MySQL plugin — do not hardcode it.
- GHCR authentication in CI uses the built-in `GITHUB_TOKEN` with `packages: write` permission.
- Review Railway and GitHub token permissions regularly and rotate on schedule.

---

## Known Limitations

**No HTTPS in local development.**  
Local traffic is plain HTTP. Production HTTPS is handled by Caddy (self-hosted) or Railway (cloud).

**Manual monitoring setup.**  
Uptime Kuma does not auto-configure monitors. After first launch, you must create the three recommended monitors manually.

**Schema managed via `init.sql` only.**  
There is no migration tool (e.g., Flyway, Sequelize CLI migrations). Schema changes require updating `db/init.sql` and handling existing data manually.

**Single-node deployment.**  
The stack runs on a single host with no horizontal scaling or orchestration (no Kubernetes/Swarm).

**Frontend API URL hardcoding.**  
The React app calls `http://localhost:8000` directly. Full Nginx proxy integration requires `/api/` paths or `REACT_APP_BACKEND_URL` at build time.

**Railway free plan constraints.**  
500 hours/month execution time on the free tier. Suitable for demos and portfolios, not high-traffic production.

---

## Future Improvements

### Roadmap

- [ ] Terraform provisioning for cloud infrastructure
- [ ] Zero-downtime deployments (rolling updates)
- [ ] Prometheus metrics collection
- [ ] Grafana dashboards
- [ ] Automated Uptime Kuma monitor provisioning
- [ ] Staging environment (preview deployments on PRs)
- [ ] Sequelize CLI migrations
- [ ] Frontend environment-based API URL configuration
- [ ] Secrets management (Vault / SOPS)

---

## License

This project is currently **unlicensed**. Add a `LICENSE` file before public distribution.

```
SPDX-License-Identifier: UNLICENSED
```

---

<p align="center">
  <sub>Built as a DevOps portfolio project — containerized, tested, and deployed end to end.</sub>
</p>
