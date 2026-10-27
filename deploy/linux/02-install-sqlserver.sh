#!/usr/bin/env bash
# Step 2 - Install SQL Server 2025 *Express* (free) + sqlcmd tools.
#   - listens on 127.0.0.1 only (never exposed to the internet)
#   - memory limited to 2 GB so Node + Nginx have room on a 4 GB server
source "$(dirname "$0")/_common.sh"
need_root
export DEBIAN_FRONTEND=noninteractive
UBU="$(lsb_release -rs)"     # e.g. 24.04

info "Microsoft package repositories (Ubuntu $UBU)"
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor --yes -o /usr/share/keyrings/microsoft-prod.gpg
curl -fsSL "https://packages.microsoft.com/config/ubuntu/$UBU/mssql-server-2025.list" \
  -o /etc/apt/sources.list.d/mssql-server-2025.list \
  || die "SQL Server 2025 repo not found for Ubuntu $UBU. Check Microsoft Learn: 'Install SQL Server on Ubuntu'."
curl -fsSL "https://packages.microsoft.com/config/ubuntu/$UBU/prod.list" \
  -o /etc/apt/sources.list.d/mssql-release.list
apt-get update -y

info "Installing SQL Server"
apt-get install -y mssql-server

if [[ ! -f /var/opt/mssql/mssql.conf ]] || ! systemctl is-active --quiet mssql-server; then
  echo
  echo "Choose the SQL 'sa' (admin) password: at least 8 chars with upper, lower, digit and symbol."
  echo "Avoid single quotes ('). Store it in a password manager - the website does NOT use it."
  read -rsp "sa password: " SA_PW; echo
  read -rsp "Repeat:      " SA_PW2; echo
  [[ "$SA_PW" == "$SA_PW2" ]] || die "Passwords do not match."
  info "Configuring SQL Server as Express edition"
  MSSQL_PID=Express ACCEPT_EULA=Y MSSQL_SA_PASSWORD="$SA_PW" /opt/mssql/bin/mssql-conf -n setup accept-eula
else
  ok "SQL Server already configured"
  read -rsp "Enter existing sa password (to verify): " SA_PW; echo
fi

info "Listen on 127.0.0.1 only, limit memory to 2048 MB"
/opt/mssql/bin/mssql-conf set network.ipaddress 127.0.0.1
/opt/mssql/bin/mssql-conf set memory.memorylimitmb 2048
systemctl restart mssql-server
systemctl enable mssql-server

info "Installing sqlcmd (mssql-tools18)"
ACCEPT_EULA=Y apt-get install -y mssql-tools18 unixodbc-dev
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' > /etc/profile.d/mssql-tools.sh
install -o mssql -g mssql -d /var/opt/mssql/backup

sleep 5
info "Checking connection"
"$SQLCMD" -S 127.0.0.1 -U sa -P "$SA_PW" -C -b -W \
  -Q "SET NOCOUNT ON; SELECT CAST(SERVERPROPERTY('ProductVersion') AS varchar(20)) AS Version, CAST(SERVERPROPERTY('Edition') AS varchar(60)) AS Edition;"
ok "SQL Server ready. Next: sudo bash $SCRIPT_DIR/03-restore-data.sh <slsq_full.bak | slsq_full_schema_and_data.sql> [uploads.zip]"
