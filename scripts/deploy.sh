#!/usr/bin/env bash
set -euo pipefail
# Deploy latest production images
# Usage: IMAGE_TAG=<sha> GITHUB_REPOSITORY=<owner/repo> bash deploy.sh

COMPOSE_FILE="docker-compose.prod.yml"
IMAGE_TAG="${IMAGE_TAG:-latest}"
GITHUB_REPOSITORY="${GITHUB_REPOSITORY:-}"

if [ -z "$GITHUB_REPOSITORY" ]; then
  echo "ERROR: GITHUB_REPOSITORY is required. Example: myuser/todolist-devops" >&2
  exit 1
fi

echo "==> Pulling images (tag: ${IMAGE_TAG})..."
IMAGE_TAG="$IMAGE_TAG" docker compose -f "$COMPOSE_FILE" pull

echo "==> Starting services..."
IMAGE_TAG="$IMAGE_TAG" docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "==> Pruning old images..."
docker image prune -f

echo "Deployed successfully at $(date '+%Y-%m-%d %H:%M:%S')"
