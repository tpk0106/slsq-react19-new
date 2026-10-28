#!/usr/bin/env bash
# Step 1 - Base Ubuntu 24.04 setup:
#   updates, build tools, Node.js 22 LTS, Nginx, firewall (UFW), app user, 2 GB swap, auto security updates.
source "$(dirname "$0")/_common.sh"
need_root
export DEBIAN_FRONTEND=noninteractive

info "Updating Ubuntu"
apt-get update -y
apt-get upgrade -y

info "Installing packages"
apt-get install -y curl wget git unzip rsync file gnupg ca-certificates lsb-release \
  nginx ufw unattended-upgrades openssl \
  build-essential autoconf automake libtool nasm pkg-config libpng-dev zlib1g-dev python3

timedatectl set-timezone "$TIMEZONE" || warn "Could not set timezone"

info "Node.js 22 LTS"
if ! command -v node >/dev/null || [[ "$(node -v)" != v22* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
ok "node $(node -v), npm $(npm -v)"

info "Application user '$APP_USER'"
if ! id "$APP_USER" &>/dev/null; then
  useradd --system --create-home --home-dir /opt/slsq --shell /bin/bash "$APP_USER"
fi
chown "$APP_USER:$APP_USER" /opt/slsq   # home may already exist (repo cloned first as root)
mkdir -p "$WEB_ROOT" "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

info "Swap file (2 GB) - helps builds while SQL Server runs on 4 GB RAM"
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
else
  ok "Swap already present"
fi

info "Firewall: allow SSH, HTTP, HTTPS only"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status verbose

info "Automatic security updates"
dpkg-reconfigure -f noninteractive unattended-upgrades

systemctl enable --now nginx
ok "Base setup complete. Next: sudo bash $SCRIPT_DIR/02-install-sqlserver.sh"
