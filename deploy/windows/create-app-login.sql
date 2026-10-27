/* Run on the Windows VPS after the database exists. Replace the password. */
CREATE LOGIN [slsq_app] WITH PASSWORD = N'<long-random-password>', CHECK_POLICY = ON;
GO
USE [slsq];
GO
IF EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'slsq_app')
    ALTER USER [slsq_app] WITH LOGIN = [slsq_app];      -- re-link user restored from backup
ELSE
    CREATE USER [slsq_app] FOR LOGIN [slsq_app];
GO
ALTER ROLE db_datareader ADD MEMBER [slsq_app];
ALTER ROLE db_datawriter ADD MEMBER [slsq_app];
GRANT EXECUTE TO [slsq_app];
GO
