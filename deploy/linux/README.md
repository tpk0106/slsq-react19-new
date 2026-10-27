# Ubuntu deployment (direct install - no Docker / Coolify)

For a local test VM first, then the HostPapa Ubuntu VPS. Coolify is not affected
(`deploy/` is excluded by `.dockerignore`; Dockerfiles and `src/config/api.ts` are unchanged).

Full guide: `Claude outputs/SLSQ_Ubuntu_Deployment_Guide.pdf`

Stack: Ubuntu 24.04 · SQL Server 2025 **Express** (free, 127.0.0.1 only) · Node.js 22 (systemd `slsq-api`)
· Nginx (React build + reverse proxy `api.` -> 127.0.0.1:5000) · Certbot · UFW · nightly backups.

## Order

```bash
sudo git clone https://github.com/tpk0106/slsq-react19-new.git /opt/slsq/app
cd /opt/slsq/app/deploy/linux
sudo cp slsq.conf.example slsq.conf && sudo nano slsq.conf      # SCHEME=http for VM test

sudo bash 01-base-setup.sh
sudo bash 02-install-sqlserver.sh
sudo bash 03-restore-data.sh /tmp/migrate/slsq_full.bak /tmp/migrate/uploads.zip
sudo bash 04-deploy-app.sh        # first run creates slsq-backend/.env from template -> edit -> run again
sudo bash 05-enable-ssl.sh        # HostPapa only, after DNS points to the server
sudo bash 06-setup-backups.sh
```

Updates later: `sudo bash 04-deploy-app.sh --pull`

| File | Purpose |
|---|---|
| `slsq.conf.example` | Domains, paths, http/https (copy to `slsq.conf`, git-ignored) |
| `backend.env.production.example` | Template for `slsq-backend/.env` |
| `slsq-api.service` | systemd unit for the Node API |
| `nginx-slsq.conf` | Nginx site: SPA + API reverse proxy, 50 MB uploads |
| `slsq-backup.sh` | DB `.bak` + uploads `.tar.gz`, 14 days, optional rclone off-server copy |
