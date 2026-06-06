# TodoList DevOps

> A three-tier ToDoList application containerized and deployed with a full DevOps lifecycle.
> Stack: Nginx (frontend) — Node.js + Sequelize (backend) — MySQL 8 (database)

## Architecture

```
[Browser] → [Nginx :80] → [Node.js API :3000] → [MySQL :3306]
                                    ↑
                          [Uptime Kuma :3001]
```

In production:

```
[Browser] → [Caddy :80/:443] → [frontend] → [backend] → [MySQL]
```

| Service    | Role                                      | Port |
|------------|-------------------------------------------|------|
| frontend   | React SPA served by Nginx, reverse proxy  | 80   |
| backend    | Express + Sequelize REST API              | 3000 |
| db         | MySQL 8 persistent storage                | 3306 |
| monitoring | Uptime Kuma uptime dashboard              | 3001 |
| caddy      | Production reverse proxy (prod only)      | 80/443 |

## Prerequisites

- Docker >= 24 with Compose plugin v2
- Git

## Quickstart (local dev)

```bash
git clone <repo> && cd <repo>
cp .env.example .env
# Edit .env with real values
docker compose up -d
```

Access:

- App: http://localhost
- API health: http://localhost/api/health
- Monitoring: http://localhost:3001

## Secrets

Never commit `.env`. Copy `.env.example` and fill in values.

For CI/CD, add these GitHub repository secrets:

- `RAILWAY_TOKEN` — Railway API token (Account Settings → Tokens)
- `RAILWAY_PROJECT_ID` — Railway project ID (Project Settings)

## CI/CD Pipeline

- **lint-and-test**: ESLint + Jest on every push
- **build-and-push**: Docker images pushed to ghcr.io (tagged by SHA + latest)
- **deploy**: Railway deploy on main branch only

## Dev vs Prod

| Concern        | Dev                        | Prod                              |
|----------------|----------------------------|-----------------------------------|
| Images         | Built from source          | Pulled from ghcr.io by SHA        |
| Reverse proxy  | Nginx inside frontend      | Caddy (HTTPS + routing)           |
| Restarts       | unless-stopped             | always                            |
| HTTPS          | No                         | Yes via Caddy + Let's Encrypt     |

## Live Deployment — Railway

The app is deployed on Railway (free plan).

| Service  | URL |
|----------|-----|
| Frontend | https://todolist-frontend.up.railway.app |
| Backend  | https://todolist-backend.up.railway.app  |
| Health   | https://todolist-backend.up.railway.app/health |

### How to deploy manually
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`

### How CI/CD deploys
On every push to main:
1. lint-and-test passes
2. Images pushed to ghcr.io
3. Railway CLI deploys backend and frontend automatically

### Railway environment variables to set in dashboard
Set these in Railway dashboard for the backend service:
- DATABASE_URL → provided automatically by Railway MySQL plugin
- PORT → provided automatically by Railway
- NODE_ENV → production

## Scripts

```bash
sudo bash scripts/bootstrap.sh                          # provision a fresh Ubuntu host
IMAGE_TAG=abc123 GITHUB_REPOSITORY=you/repo bash scripts/deploy.sh
bash scripts/backup-db.sh                              # backup MySQL, keep last 7
bash scripts/rollback.sh abc123                        # rollback to a specific tag
```

## Known Limitations

- No HTTPS in local dev
- Uptime Kuma monitors must be configured manually on first launch
- Database schema managed only via init.sql (no migration tool)
- Single-node deployment, no horizontal scaling
- Frontend currently calls `http://localhost:8000` directly; use `/api/` paths or `REACT_APP_BACKEND_URL` for full proxy integration
