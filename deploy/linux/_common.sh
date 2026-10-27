#!/usr/bin/env bash
# Shared helpers for deploy/linux scripts. Not run directly.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF="$SCRIPT_DIR/slsq.conf"
if [[ ! -f "$CONF" ]]; then
  echo "Missing $CONF"
  echo "Run:  cp $SCRIPT_DIR/slsq.conf.example $CONF   then edit it."
  exit 1
fi
# shellcheck source=/dev/null
source "$CONF"
API_URL="${SCHEME}://${API_DOMAIN}"
SQLCMD=/opt/mssql-tools18/bin/sqlcmd

info() { echo -e "\n\e[1;36m==> $*\e[0m"; }
ok()   { echo -e "\e[1;32m[OK]\e[0m $*"; }
warn() { echo -e "\e[1;33m[!]\e[0m $*"; }
die()  { echo -e "\e[1;31m[X]\e[0m $*"; exit 1; }
need_root() { [[ $EUID -eq 0 ]] || die "Run with sudo:  sudo bash $0 $*"; }
