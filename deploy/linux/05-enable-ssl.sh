#!/usr/bin/env bash
# Step 5 (HostPapa production only) - free Let's Encrypt SSL for all 3 hostnames + auto-renew.
# Requires: DNS A records for DOMAIN, www.DOMAIN and API_DOMAIN already pointing to this server.
# Not possible on a local VM (Let's Encrypt must reach the server from the internet).
source "$(dirname "$0")/_common.sh"
need_root
export DEBIAN_FRONTEND=noninteractive

info "Checking DNS"
MYIP="$(curl -fsS https://api.ipify.org || true)"
for h in "$DOMAIN" "www.$DOMAIN" "$API_DOMAIN"; do
  R="$(getent ahostsv4 "$h" | awk 'NR==1{print $1}')"
  echo "  $h -> ${R:-not resolved} (server: ${MYIP:-unknown})"
done
read -rp "Do all three point to this server? (yes/no) " A
[[ "$A" == "yes" ]] || die "Fix DNS first, then re-run."

apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" -d "$API_DOMAIN" \
  --redirect -m "$ADMIN_EMAIL" --agree-tos -n
systemctl list-timers | grep -i certbot || true
certbot renew --dry-run

ok "SSL enabled. Now:"
echo "  1) In $CONF set SCHEME=https"
echo "  2) In $APP_DIR/slsq-backend/.env set CORS_ORIGINS=https://$DOMAIN,https://www.$DOMAIN"
echo "  3) sudo bash $SCRIPT_DIR/04-deploy-app.sh   (rebuilds the frontend with https API URL)"
