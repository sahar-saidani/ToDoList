#!/usr/bin/env bash
set -euo pipefail
# Backup MySQL database from the running container
# Usage: bash backup-db.sh
# Keeps last 7 backups

BACKUP_DIR="./backups"
CONTAINER_NAME="$(docker compose ps -q db 2>/dev/null || echo 'todolist-devops-db-1')"
DB_NAME="${MYSQL_DATABASE:-todolist}"
DB_USER="${MYSQL_USER:-todolist_user}"
DB_PASSWORD="${MYSQL_PASSWORD:-}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/todolist_${TIMESTAMP}.sql"
MAX_BACKUPS=7

echo "==> Creating backup directory..."
mkdir -p "$BACKUP_DIR"

echo "==> Dumping MySQL database..."
docker exec "$CONTAINER_NAME" \
  mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"

echo "==> Backup saved: $BACKUP_FILE"

echo "==> Removing backups older than last ${MAX_BACKUPS}..."
ls -tp "${BACKUP_DIR}"/todolist_*.sql 2>/dev/null | \
  tail -n +$((MAX_BACKUPS + 1)) | \
  xargs -r rm --

echo "Backup complete at $(date '+%Y-%m-%d %H:%M:%S')"
