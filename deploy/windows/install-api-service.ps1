<#
  Run on the Windows VPS (PowerShell as Administrator) AFTER:
   - repo cloned to C:\apps\slsq, "npm ci" + "npm run build" done in slsq-backend
   - slsq-backend\.env created from backend.env.production.example
   - nssm.exe copied to C:\tools
  Installs the Node.js API as an auto-start Windows service "SLSQ-API" on port 5000.
#>
param(
    [string]$AppDir = "C:\apps\slsq\slsq-backend",
    [string]$Nssm   = "C:\tools\nssm.exe",
    [string]$LogDir = "C:\apps\logs",
    [string]$Name   = "SLSQ-API"
)
$ErrorActionPreference = "Stop"
$node = (Get-Command node).Source
if (-not (Test-Path "$AppDir\dist\server.js")) { throw "dist\server.js not found - run 'npm run build' in $AppDir first." }
if (-not (Test-Path "$AppDir\.env"))           { throw ".env not found in $AppDir." }
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

& $Nssm install $Name $node "dist\server.js"
& $Nssm set $Name AppDirectory $AppDir
& $Nssm set $Name AppStdout "$LogDir\api-out.log"
& $Nssm set $Name AppStderr "$LogDir\api-err.log"
& $Nssm set $Name AppRotateFiles 1
& $Nssm set $Name AppRotateBytes 10485760
& $Nssm set $Name Start SERVICE_AUTO_START
& $Nssm set $Name DependOnService 'MSSQL$SQLEXPRESS'
& $Nssm set $Name AppExit Default Restart
& $Nssm start $Name

Start-Sleep -Seconds 3
try {
    $r = Invoke-RestMethod http://localhost:5000/api/health
    Write-Host "API healthy: $($r.status) $($r.timestamp)" -ForegroundColor Green
} catch {
    Write-Host "Health check failed - see $LogDir\api-err.log" -ForegroundColor Red
}
