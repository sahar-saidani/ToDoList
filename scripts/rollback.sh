#!/usr/bin/env bash
set -euo pipefail
# Roll back to a previous image tag
# Usage: bash rollback.sh <IMAGE_TAG>

if [ $# -lt 1 ] || [ -z "${1:-}" ]; then
  echo "Usage: bash rollback.sh <IMAGE_TAG>"
  echo "Example: bash rollback.sh a3f9c12"
  exit 1
fi

IMAGE_TAG="$1"
COMPOSE_FILE="docker-compose.prod.yml"

echo "==> Rolling back to tag: ${IMAGE_TAG}..."
IMAGE_TAG="$IMAGE_TAG" docker compose -f "$COMPOSE_FILE" pull
IMAGE_TAG="$IMAGE_TAG" docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "Rollback complete at $(date '+%Y-%m-%d %H:%M:%S')"
echo "Running tag: ${IMAGE_TAG}"
