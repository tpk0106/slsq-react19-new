# Windows VPS deployment files (HostPapa)

These files are **only** for the Windows VPS (IIS + Node.js service + SQL Server Express).
The **Coolify / Ubuntu** deployment is unchanged: `Dockerfile`, `slsq-backend/Dockerfile`,
`src/config/api.ts` and Coolify environment variables are not affected.
This folder is excluded from the frontend Docker build via `.dockerignore`.

Full step-by-step guide: `Claude outputs/SLSQ_Windows_VPS_Deployment_Guide.pdf`

| File | Used where | Purpose |
|---|---|---|
| `export-database.ps1` | Dev PC | Full schema + data `.sql`, row counts, optional `.bak`, `uploads.zip` |
| `restore-database.sql` | VPS (SSMS) | Memory limit, restore `.bak` or import `.sql`, verify row counts |
| `create-app-login.sql` | VPS (SSMS) | Least-privilege `slsq_app` login |
| `backend.env.production.example` | VPS | Template for `slsq-backend\.env` |
| `install-api-service.ps1` | VPS | Installs Node API as Windows service `SLSQ-API` (NSSM) |
| `web.frontend.config` | VPS | IIS SPA rewrite + HTTPS; copied to `build\web.config` by `npm run build:vps` |
| `web.api.config` | VPS | IIS reverse proxy `api.srilankansqld.org` -> `localhost:5000` |
| `slsq-backup.ps1` | VPS | Nightly DB + uploads backup, 14-day retention |

## Builds

```bat
:: Coolify (unchanged) - Docker build, API = REACT_APP_API_URL or fallback in src/config/api.ts
npm run build

:: Windows VPS - run on the Windows dev PC (cmd/PowerShell)
npm run build:vps
```

`build:vps` sets `REACT_APP_API_URL=https://api.srilankansqld.org`, disables source maps,
builds, and copies `web.frontend.config` to `build\web.config`. Copy the contents of `build\`
to `C:\inetpub\slsq` on the VPS.

## Export the database now (dev PC)

```powershell
powershell -ExecutionPolicy Bypass -File deploy\windows\export-database.ps1
# options: -Server 192.168.20.6 -User sa -Backup   |   -WindowsAuth   |   -OutDir D:\migrate
```

Reads connection details from `slsq-backend\.env`. Output goes to `C:\srilankans-QLD\migrate`
(outside the repo - never commit database exports).
