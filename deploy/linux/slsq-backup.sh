#!/usr/bin/env bash
# Nightly backup: database (.bak) + uploaded files (.tar.gz), 14-day retention,
# optional off-server copy with rclone. Installed into cron by 06-setup-backups.sh.
source "$(dirname "$0")/_common.sh"
need_root
# shellcheck source=/dev/null
source /etc/slsq/backup.env
TS="$(date +%Y%m%d_%H%M)"
SQLBAK="/var/opt/mssql/backup/${DB_NAME}_${TS}.bak"
mkdir -p "$BACKUP_DIR"

"$SQLCMD" -S 127.0.0.1 -U "$SQL_BACKUP_USER" -P "$SQL_BACKUP_PASSWORD" -C -b \
  -Q "BACKUP DATABASE [$DB_NAME] TO DISK = N'$SQLBAK' WITH INIT, CHECKSUM"
mv "$SQLBAK" "$BACKUP_DIR/"
tar -czf "$BACKUP_DIR/uploads_${TS}.tar.gz" -C "$APP_DIR/slsq-backend/public" uploads

find "$BACKUP_DIR" -type f \( -name '*.bak' -o -name '*.tar.gz' \) -mtime +14 -delete

if [[ -n "${RCLONE_REMOTE:-}" ]] && command -v rclone >/dev/null; then
  rclone copy "$BACKUP_DIR" "$RCLONE_REMOTE" --max-age 25h
  rclone delete "$RCLONE_REMOTE" --min-age 30d || true
  echo "$(date -Is) OK ${DB_NAME}_${TS}.bak + uploads (copied to $RCLONE_REMOTE)"
else
  echo "$(date -Is) OK ${DB_NAME}_${TS}.bak + uploads (LOCAL ONLY - set RCLONE_REMOTE for off-server copy)"
fi
