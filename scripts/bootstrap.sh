#!/usr/bin/env bash
set -euo pipefail
# Bootstrap a fresh Ubuntu 22.04 host for the ToDoList stack
# Usage: sudo bash bootstrap.sh
# Env: REPO_URL=https://github.com/YOU/REPO (optional, defaults to prompt)

echo "==> [1/7] Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

echo "==> [2/7] Installing Docker CE and Compose plugin..."
apt-get install -y -qq ca-certificates curl gnupg lsb-release
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "==> [3/7] Enabling Docker service..."
systemctl enable docker
systemctl start docker

echo "==> [4/7] Creating deploy user..."
if ! id "deploy" &>/dev/null; then
  useradd -m -s /bin/bash deploy
  usermod -aG docker deploy
  echo "deploy ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/deploy
  chmod 0440 /etc/sudoers.d/deploy
fi

echo "==> [5/7] Cloning repository..."
REPO_URL="${REPO_URL:-}"
if [ -z "$REPO_URL" ]; then
  read -rp "Enter the repository URL: " REPO_URL
fi
if [ ! -d "/home/deploy/todolist-devops" ]; then
  git clone "$REPO_URL" /home/deploy/todolist-devops
  chown -R deploy:deploy /home/deploy/todolist-devops
fi

echo "==> [6/7] Setting up .env file..."
if [ ! -f "/home/deploy/todolist-devops/.env" ]; then
  cp /home/deploy/todolist-devops/.env.example /home/deploy/todolist-devops/.env
  echo "WARNING: .env copied from .env.example — edit it with real secrets before starting!"
fi

echo "==> [7/7] Done."
echo "=========================================="
echo "Next steps:"
echo "  1. Fill in /home/deploy/todolist-devops/.env"
echo "  2. sudo -u deploy bash -c 'cd ~/todolist-devops && docker compose up -d'"
echo "=========================================="
