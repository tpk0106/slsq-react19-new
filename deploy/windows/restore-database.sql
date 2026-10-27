/* ============================================================
   Run on the Windows VPS in SSMS (connected as Administrator).
   Choose ONE option: A (restore .bak) or B (run the .sql script).
   ============================================================ */

-- Limit SQL Server memory on the 4 GB VPS
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'max server memory (MB)', 1536; RECONFIGURE;
GO

/* ---------- Option A: restore slsq_full.bak ----------
-- 1) See the logical file names in the backup:
RESTORE FILELISTONLY FROM DISK = N'C:\migrate\slsq_full.bak';

-- 2) Restore (edit logical names + DATA path; SQL 2025 Express = MSSQL17.SQLEXPRESS):
RESTORE DATABASE [slsq] FROM DISK = N'C:\migrate\slsq_full.bak'
WITH MOVE N'slsq'     TO N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\slsq.mdf',
     MOVE N'slsq_log' TO N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\slsq_log.ldf',
     RECOVERY, STATS = 10;
*/

/* ---------- Option B: create empty DB, then run the script ----------
CREATE DATABASE [slsq];
GO
-- Then in a command prompt (not SSMS - the file can be large):
--   sqlcmd -S localhost -E -d slsq -i C:\migrate\slsq_full_schema_and_data.sql -x -o C:\migrate\import.log
*/

/* ---------- Verify: compare with slsq_rowcounts_source.csv ---------- */
USE [slsq];
SELECT s.name AS [schema], t.name AS [table], SUM(p.rows) AS [rows]
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.partitions p ON p.object_id = t.object_id AND p.index_id IN (0,1)
GROUP BY s.name, t.name ORDER BY s.name, t.name;
