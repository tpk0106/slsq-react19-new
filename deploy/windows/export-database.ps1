<#
.SYNOPSIS
  Exports the SLSQ database for migration to the Windows VPS. Run on the DEV PC (Windows PowerShell 5.1 or PowerShell 7).

  Produces in -OutDir:
    slsq_full_schema_and_data.sql   full script: tables, keys, indexes, views, procs + all data (Unicode)
    slsq_rowcounts_source.csv       row count per table (compare after import on the VPS)
    uploads.zip                     slsq-backend\public\uploads (images / PDFs)
  Optional (-Backup): asks SQL Server to write slsq_full.bak on the SERVER's disk.

  Connection values default to slsq-backend\.env (DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD).
  Nothing in the Coolify deployment is changed - this script only reads.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File deploy\windows\export-database.ps1
.EXAMPLE
  .\export-database.ps1 -Server 192.168.20.6 -User sa -Backup
#>
param(
    [string]$Server,
    [string]$Database,
    [string]$User,
    [string]$Password,
    [switch]$WindowsAuth,
    [string]$OutDir = "C:\srilankans-QLD\migrate",
    [switch]$Backup,
    # Path ON THE SQL SERVER. Linux/Docker default shown; for Windows SQL use e.g. C:\migrate\slsq_full.bak
    [string]$ServerBackupPath = "/var/opt/mssql/data/slsq_full.bak",
    [switch]$SkipUploads
)
$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path

# --- defaults from slsq-backend\.env ---------------------------------------
$envFile = Join-Path $repoRoot "slsq-backend\.env"
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^\s*([A-Z_]+)\s*=\s*(.*)$') {
            $k = $Matches[1]; $v = $Matches[2].Trim().Trim('"')
            switch ($k) {
                "DB_SERVER"   { if (-not $Server)   { $Server = $v } }
                "DB_NAME"     { if (-not $Database) { $Database = $v } }
                "DB_USER"     { if (-not $User)     { $User = $v } }
                "DB_PASSWORD" { if (-not $Password) { $Password = $v } }
            }
        }
    }
}
if (-not $Server)   { $Server = "localhost" }
if (-not $Database) { $Database = "slsq" }
if (-not $WindowsAuth -and -not $Password) {
    $sec = Read-Host "Password for SQL login '$User'" -AsSecureString
    $Password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
}
Write-Host "Source: $Server / $Database  (auth: $(if ($WindowsAuth) {'Windows'} else {"SQL login $User"}))" -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# --- SqlServer PowerShell module (SMO) --------------------------------------
if (-not (Get-Module -ListAvailable -Name SqlServer)) {
    Write-Host "Installing SqlServer PowerShell module (current user)..." -ForegroundColor Yellow
    Install-Module SqlServer -Scope CurrentUser -Force -AllowClobber
}
Import-Module SqlServer

$conn = New-Object Microsoft.SqlServer.Management.Common.ServerConnection
$conn.ServerInstance = $Server
try { $conn.TrustServerCertificate = $true } catch { }   # older SqlServer module versions lack this property
if ($WindowsAuth) { $conn.LoginSecure = $true }
else { $conn.LoginSecure = $false; $conn.Login = $User; $conn.Password = $Password }

$srv = New-Object Microsoft.SqlServer.Management.Smo.Server($conn)
$db  = $srv.Databases[$Database]
if (-not $db) { throw "Database '$Database' not found on $Server." }
Write-Host "Connected: SQL Server $($srv.VersionString) ($($srv.Edition))" -ForegroundColor Green

# --- 1) Full schema + data script -------------------------------------------
$sqlFile = Join-Path $OutDir "slsq_full_schema_and_data.sql"
if (Test-Path $sqlFile) { Remove-Item $sqlFile }

$scripter = New-Object Microsoft.SqlServer.Management.Smo.Scripter($srv)
$o = $scripter.Options
$o.ScriptSchema          = $true
$o.ScriptData            = $true
$o.WithDependencies      = $true      # correct order for foreign keys
$o.DriAll                = $true      # PK, FK, unique, check, defaults
$o.Indexes               = $true
$o.Triggers              = $true
$o.ExtendedProperties    = $true
$o.Permissions           = $false
$o.IncludeDatabaseContext = $false    # no USE [db] - run against the target DB
$o.IncludeHeaders        = $true
$o.ScriptBatchTerminator = $true
$o.NoCollation           = $false
$o.ToFileOnly            = $true
$o.AppendToFile          = $true
$o.Encoding              = [System.Text.Encoding]::Unicode   # keeps Sinhala / Tamil text
$o.FileName              = $sqlFile

$urns = New-Object System.Collections.Generic.List[Microsoft.SqlServer.Management.Sdk.Sfc.Urn]
foreach ($t in $db.Tables)               { if (-not $t.IsSystemObject) { $urns.Add($t.Urn) } }
foreach ($v in $db.Views)                { if (-not $v.IsSystemObject) { $urns.Add($v.Urn) } }
foreach ($p in $db.StoredProcedures)     { if (-not $p.IsSystemObject) { $urns.Add($p.Urn) } }
foreach ($f in $db.UserDefinedFunctions) { if (-not $f.IsSystemObject) { $urns.Add($f.Urn) } }
foreach ($u in $db.UserDefinedTableTypes) { $urns.Add($u.Urn) }

Write-Host "Scripting $($urns.Count) objects with data -> $sqlFile ..." -ForegroundColor Cyan
$scripter.EnumScript($urns.ToArray()) | Out-Null
Write-Host ("Done: {0:N1} MB" -f ((Get-Item $sqlFile).Length / 1MB)) -ForegroundColor Green

# --- 2) Row counts for verification -----------------------------------------
$countQuery = @"
SELECT s.name AS [schema], t.name AS [table], SUM(p.rows) AS [rows]
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.partitions p ON p.object_id = t.object_id AND p.index_id IN (0,1)
GROUP BY s.name, t.name ORDER BY s.name, t.name;
"@
$countFile = Join-Path $OutDir "slsq_rowcounts_source.csv"
$db.ExecuteWithResults($countQuery).Tables[0] | Export-Csv $countFile -NoTypeInformation
Write-Host "Row counts -> $countFile" -ForegroundColor Green

# --- 3) Optional .bak on the SQL Server's own disk ---------------------------
if ($Backup) {
    Write-Host "Backing up to $ServerBackupPath (on the SQL Server machine)..." -ForegroundColor Cyan
    $db.ExecuteNonQuery("BACKUP DATABASE [$Database] TO DISK = N'$ServerBackupPath' WITH COPY_ONLY, INIT, CHECKSUM")
    Write-Host "Backup written on the server: $ServerBackupPath" -ForegroundColor Green
    if ($ServerBackupPath.StartsWith("/")) {
        Write-Host "SQL is on Linux/Docker - copy it off the Coolify server, e.g.:" -ForegroundColor Yellow
        Write-Host "  docker cp <sql-container>:$ServerBackupPath ./slsq_full.bak"
    }
}

# --- 4) Uploaded files --------------------------------------------------------
if (-not $SkipUploads) {
    $uploads = Join-Path $repoRoot "slsq-backend\public\uploads"
    if (Test-Path $uploads) {
        $zip = Join-Path $OutDir "uploads.zip"
        if (Test-Path $zip) { Remove-Item $zip }
        Write-Host "Zipping $uploads ..." -ForegroundColor Cyan
        Compress-Archive -Path $uploads -DestinationPath $zip -CompressionLevel Optimal
        Write-Host ("uploads.zip: {0:N0} MB" -f ((Get-Item $zip).Length / 1MB)) -ForegroundColor Green
        Write-Host "NOTE: if the live site (Coolify) has newer uploads, use that copy instead:" -ForegroundColor Yellow
        Write-Host "  docker cp <api-container>:/app/public/uploads ./uploads"
    } else { Write-Host "Uploads folder not found: $uploads" -ForegroundColor Yellow }
}

Write-Host "`nExport complete -> $OutDir" -ForegroundColor Green
