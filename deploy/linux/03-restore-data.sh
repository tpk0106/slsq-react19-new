#!/usr/bin/env bash
# Step 3 - Restore the existing SLSQ data:
#   - database from slsq_full.bak (preferred) OR slsq_full_schema_and_data.sql (from export-database.ps1)
#   - creates login slsq_app (website) and slsq_backup (nightly backups, backup rights only)
#   - optional: uploads.zip -> slsq-backend/public/uploads
# Usage: sudo bash 03-restore-data.sh /tmp/migrate/slsq_full.bak /tmp/migrate/uploads.zip
source "$(dirname "$0")/_common.sh"
need_root
SRC="${1:-}"
UPLOADS_ZIP="${2:-}"
[[ -f "$SRC" ]] || die "Usage: sudo bash $0 <file.bak|file.sql> [uploads.zip]"

read -rsp "SQL 'sa' password: " SA_PW; echo
q() { "$SQLCMD" -S 127.0.0.1 -U sa -P "$SA_PW" -C -b "$@"; }
q -Q "SELECT 1" >/dev/null || die "Cannot connect as sa."

EXISTS="$(q -h -1 -W -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.databases WHERE name = N'$DB_NAME'")"
if [[ "$EXISTS" != "0" ]]; then
  read -rp "Database [$DB_NAME] already exists and will be REPLACED. Type yes to continue: " ANS
  [[ "$ANS" == "yes" ]] || die "Cancelled."
  systemctl stop slsq-api 2>/dev/null || true
fi

case "$SRC" in
  *.bak|*.BAK)
    info "Restoring from backup $SRC"
    BAK="/var/opt/mssql/backup/restore_$(date +%s).bak"
    cp "$SRC" "$BAK"
    chown mssql:mssql "$BAK"
    MOVES=""
    while IFS='|' read -r LNAME _PNAME FTYPE _REST; do
      [[ -z "$LNAME" ]] && continue
      case "$FTYPE" in
        D) MOVES+=", MOVE N'$LNAME' TO N'/var/opt/mssql/data/${DB_NAME}_${LNAME}.mdf'" ;;
        L) MOVES+=", MOVE N'$LNAME' TO N'/var/opt/mssql/data/${DB_NAME}_${LNAME}.ldf'" ;;
      esac
    done < <(q -h -1 -W -s '|' -Q "SET NOCOUNT ON; RESTORE FILELISTONLY FROM DISK = N'$BAK'")
    [[ -n "$MOVES" ]] || die "Could not read file list from backup."
    q -Q "RESTORE DATABASE [$DB_NAME] FROM DISK = N'$BAK' WITH REPLACE, RECOVERY, STATS = 20 $MOVES"
    rm -f "$BAK"
    ;;
  *.sql|*.SQL)
    info "Importing script $SRC (this can take a while)"
    TMP="$(mktemp --suffix=.sql)"
    if file -b "$SRC" | grep -qi 'UTF-16'; then
      iconv -f UTF-16 -t UTF-8 "$SRC" > "$TMP"        # export-database.ps1 writes UTF-16
    else
      cp "$SRC" "$TMP"
    fi
    q -Q "IF DB_ID(N'$DB_NAME') IS NOT NULL BEGIN ALTER DATABASE [$DB_NAME] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [$DB_NAME]; END; CREATE DATABASE [$DB_NAME];"
    LOG=/var/log/slsq-sql-import.log
    "$SQLCMD" -S 127.0.0.1 -U sa -P "$SA_PW" -C -d "$DB_NAME" -i "$TMP" -x -f 65001 -o "$LOG" || true
    rm -f "$TMP"
    if grep -q "^Msg " "$LOG"; then warn "Import reported errors - check $LOG"; else ok "Import finished without errors"; fi
    ;;
  *) die "Unknown file type: $SRC (expected .bak or .sql)" ;;
esac

info "Website login: slsq_app (least privilege)"
echo "Choose the slsq_app password (put the same value in slsq-backend/.env as DB_PASSWORD). Avoid single quotes."
read -rsp "slsq_app password: " APP_PW; echo
read -rsp "Repeat:            " APP_PW2; echo
[[ "$APP_PW" == "$APP_PW2" ]] || die "Passwords do not match - re-run this script."
q -d master -Q "IF SUSER_ID(N'slsq_app') IS NULL CREATE LOGIN [slsq_app] WITH PASSWORD = N'$APP_PW', CHECK_POLICY = ON ELSE ALTER LOGIN [slsq_app] WITH PASSWORD = N'$APP_PW';"
q -d "$DB_NAME" -Q "IF DATABASE_PRINCIPAL_ID(N'slsq_app') IS NULL CREATE USER [slsq_app] FOR LOGIN [slsq_app] ELSE ALTER USER [slsq_app] WITH LOGIN = [slsq_app];
ALTER ROLE db_datareader ADD MEMBER [slsq_app]; ALTER ROLE db_datawriter ADD MEMBER [slsq_app]; GRANT EXECUTE TO [slsq_app];"

info "Backup login: slsq_backup (backup rights only, random password)"
BK_PW="Bk$(openssl rand -hex 16)!"
q -d master -Q "IF SUSER_ID(N'slsq_backup') IS NULL CREATE LOGIN [slsq_backup] WITH PASSWORD = N'$BK_PW' ELSE ALTER LOGIN [slsq_backup] WITH PASSWORD = N'$BK_PW';"
q -d "$DB_NAME" -Q "IF DATABASE_PRINCIPAL_ID(N'slsq_backup') IS NULL CREATE USER [slsq_backup] FOR LOGIN [slsq_backup] ELSE ALTER USER [slsq_backup] WITH LOGIN = [slsq_backup];
ALTER ROLE db_backupoperator ADD MEMBER [slsq_backup];"
install -d -m 700 /etc/slsq
umask 077
{
  echo "SQL_BACKUP_USER=slsq_backup"
  echo "SQL_BACKUP_PASSWORD='$BK_PW'"
  echo "# Optional off-server copy (see guide): e.g. RCLONE_REMOTE=gdrive:slsq-backups"
  echo "RCLONE_REMOTE="
} > /etc/slsq/backup.env
ok "Backup credentials saved to /etc/slsq/backup.env (root only)"

if [[ -n "$UPLOADS_ZIP" ]]; then
  info "Restoring uploaded files from $UPLOADS_ZIP"
  DEST="$APP_DIR/slsq-backend/public"
  mkdir -p "$DEST"
  # unzip exits 1 on warnings (e.g. Windows backslash paths) - that is fine
  unzip -o -q "$UPLOADS_ZIP" -d "$DEST" || [[ $? -eq 1 ]]
  [[ -d "$DEST/uploads" ]] || warn "Expected folder $DEST/uploads not found - check the zip layout"
  chown -R "$APP_USER:$APP_USER" "$DEST"
  # Windows zips can carry restrictive permissions - normalise them
  find "$DEST/uploads" -type d -exec chmod 755 {} +
  find "$DEST/uploads" -type f -exec chmod 644 {} +
  ok "Uploads: $(du -sh "$DEST/uploads" 2>/dev/null | cut -f1)"
fi

info "Row counts (compare with slsq_rowcounts_source.csv)"
q -d "$DB_NAME" -W -s ' | ' -Q "SET NOCOUNT ON;
SELECT s.name AS [schema], t.name AS [table], SUM(p.rows) AS [rows]
FROM sys.tables t JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.partitions p ON p.object_id = t.object_id AND p.index_id IN (0,1)
GROUP BY s.name, t.name ORDER BY s.name, t.name;"
ok "Data restored. Next: create slsq-backend/.env, then sudo bash $SCRIPT_DIR/04-deploy-app.sh"
