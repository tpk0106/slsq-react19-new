<#
  Nightly backup on the Windows VPS (SQL Server Express has no SQL Agent).
  Schedule (as Administrator):
    schtasks /Create /TN "SLSQ Nightly Backup" /SC DAILY /ST 02:00 /RL HIGHEST /RU Administrator /RP * /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\apps\slsq\deploy\windows\slsq-backup.ps1"
#>
param(
    [string]$Dest     = "C:\backups",
    [string]$Uploads  = "C:\apps\slsq\slsq-backend\public\uploads",
    [int]$KeepDays    = 14
)
$ErrorActionPreference = "Stop"
$ts = Get-Date -Format "yyyyMMdd_HHmm"
New-Item -ItemType Directory -Force -Path $Dest | Out-Null

# 1) Database (Windows auth - Administrator is SQL sysadmin from setup)
sqlcmd -S localhost -E -b -Q "BACKUP DATABASE [slsq] TO DISK=N'$Dest\slsq_$ts.bak' WITH INIT, CHECKSUM"
if ($LASTEXITCODE -ne 0) { throw "Database backup failed." }

# 2) Uploaded images / PDFs
Compress-Archive -Path $Uploads -DestinationPath "$Dest\uploads_$ts.zip" -CompressionLevel Optimal

# 3) Retention
Get-ChildItem $Dest -File | Where-Object LastWriteTime -lt (Get-Date).AddDays(-$KeepDays) | Remove-Item

"$((Get-Date).ToString('s'))  OK  slsq_$ts.bak + uploads_$ts.zip" | Add-Content "$Dest\backup.log"
