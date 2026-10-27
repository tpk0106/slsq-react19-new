#!/usr/bin/env bash
# Step 6 - Schedule the nightly backup (02:00) and run it once now.
# Optional off-server copy: install rclone, run 'rclone config' (e.g. Google Drive / OneDrive / Cloudflare R2),
# then set RCLONE_REMOTE=<remote>:<folder> in /etc/slsq/backup.env
source "$(dirname "$0")/_common.sh"
need_root
[[ -f /etc/slsq/backup.env ]] || die "/etc/slsq/backup.env missing - run 03-restore-data.sh first."

command -v rclone >/dev/null || apt-get install -y rclone

cat > /etc/cron.d/slsq-backup <<CRON
# SLSQ nightly backup
0 2 * * * root /bin/bash $SCRIPT_DIR/slsq-backup.sh >> /var/log/slsq-backup.log 2>&1
CRON
chmod 644 /etc/cron.d/slsq-backup
ok "Cron installed: daily 02:00 -> /var/log/slsq-backup.log"

info "Running a backup now"
bash "$SCRIPT_DIR/slsq-backup.sh"
ls -lh "$BACKUP_DIR"
