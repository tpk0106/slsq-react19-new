USE [slsq]
GO

-- =============================================
-- ADD EventType COLUMN TO Events TABLE
-- Supports: 'Event' (default), 'NoticeBoard'
-- =============================================

IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Events' AND COLUMN_NAME = 'EventType'
)
BEGIN
    ALTER TABLE [dbo].[Events]
    ADD [EventType] [nvarchar](20) NOT NULL DEFAULT ('Event');
    PRINT 'Column EventType added to Events table.';
END
ELSE
BEGIN
    PRINT 'Column EventType already exists on Events table.';
END
GO
