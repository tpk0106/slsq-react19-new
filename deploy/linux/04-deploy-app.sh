#!/usr/bin/env bash
# Step 4 - Build and (re)deploy the backend API + React frontend. Safe to re-run for every update.
#   sudo bash 04-deploy-app.sh           build + deploy what is in $APP_DIR
#   sudo bash 04-deploy-app.sh --pull    git pull first (normal update)
source "$(dirname "$0")/_common.sh"
need_root

asapp() { sudo -u "$APP_USER" -H bash -c "cd '$APP_DIR' && $*"; }

[[ -d "$APP_DIR/.git" ]] || die "Repository not found at $APP_DIR (see guide: clone step)."
chown -R "$APP_USER:$APP_USER" "$APP_DIR"
# The app user's home (e.g. /opt/slsq) must be writable for the npm cache (~/.npm)
APP_HOME="$(getent passwd "$APP_USER" | cut -d: -f6)"
[[ -n "$APP_HOME" ]] && chown "$APP_USER:$APP_USER" "$APP_HOME"

if [[ "${1:-}" == "--pull" ]]; then
  info "git pull"
  asapp "git pull --ff-only"
fi

ENV_FILE="$APP_DIR/slsq-backend/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  cp "$SCRIPT_DIR/backend.env.production.example" "$ENV_FILE"
  chown "$APP_USER:$APP_USER" "$ENV_FILE"; chmod 600 "$ENV_FILE"
  die "Created $ENV_FILE from the template. Edit it (DB_PASSWORD, JWT_SECRET, CORS_ORIGINS) then re-run this script."
fi
chmod 600 "$ENV_FILE"
grep -q '<' "$ENV_FILE" && die "$ENV_FILE still contains <placeholders>. Edit it first."

info "Backend: install + build"
asapp "cd slsq-backend && npm ci && npm run build"
mkdir -p "$APP_DIR/slsq-backend/public/uploads/"{events,publications,gallery}
chown -R "$APP_USER:$APP_USER" "$APP_DIR/slsq-backend/public"

info "Frontend: build with API = $API_URL"
asapp "export REACT_APP_API_URL='$API_URL' GENERATE_SOURCEMAP=false NODE_OPTIONS=--max-old-space-size=2048 && npm ci && npm run build"
rsync -a --delete "$APP_DIR/build/" "$WEB_ROOT/"
chown -R root:root "$WEB_ROOT"; chmod -R a+rX "$WEB_ROOT"
ok "Frontend copied to $WEB_ROOT"

info "API service (systemd: slsq-api)"
sed -e "s#__APP_USER__#$APP_USER#g" -e "s#__APP_DIR__#$APP_DIR#g" \
  "$SCRIPT_DIR/slsq-api.service" > /etc/systemd/system/slsq-api.service
systemctl daemon-reload
systemctl enable slsq-api >/dev/null
systemctl restart slsq-api

SITE=/etc/nginx/sites-available/slsq
if [[ ! -f "$SITE" ]]; then
  info "Nginx site (first install)"
  sed -e "s#__DOMAIN__#$DOMAIN#g" -e "s#__API_DOMAIN__#$API_DOMAIN#g" -e "s#__WEB_ROOT__#$WEB_ROOT#g" \
    "$SCRIPT_DIR/nginx-slsq.conf" > "$SITE"
  ln -sf "$SITE" /etc/nginx/sites-enabled/slsq
  rm -f /etc/nginx/sites-enabled/default
else
  ok "Nginx site exists - left unchanged (keeps certbot SSL settings)"
fi
nginx -t
systemctl reload nginx

info "Health checks"
sleep 4
if curl -fsS http://127.0.0.1:5000/api/health; then echo; ok "API is running"; else
  warn "API health check failed. See: journalctl -u slsq-api -n 50"; fi
if curl -fsS -H "Host: $DOMAIN" http://127.0.0.1/ | grep -qi '<div id="root"'; then ok "Website is served by Nginx"; else
  warn "Website check failed. See: /var/log/nginx/error.log"; fi
ok "Deploy complete."
