# Monitoring — Uptime Kuma

Uptime Kuma runs as a sidecar container on port **3001**.

## First launch
Open http://localhost:3001 and create an admin account.

## Monitors to configure

| Name           | Type | Target                          | Interval |
|----------------|------|---------------------------------|----------|
| Frontend       | HTTP | http://localhost:80             | 60s      |
| Backend Health | HTTP | http://localhost/api/health     | 60s      |
| MySQL          | TCP  | db:3306                         | 60s      |

## Useful commands
- Check all services: `docker compose ps`
- See logs: `docker compose logs -f backend`
- Restart a service: `docker compose restart backend`
