USE [slsq]
GO

-- =============================================
-- PHOTO GALLERY TABLES
-- =============================================

-- GALLERIES TABLE (Master - event/album info)
IF OBJECT_ID('dbo.GalleryImages', 'U') IS NOT NULL DROP TABLE dbo.GalleryImages;
IF OBJECT_ID('dbo.Galleries', 'U') IS NOT NULL DROP TABLE dbo.Galleries;
GO

CREATE TABLE [dbo].[Galleries](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Title] [nvarchar](500) NOT NULL,
    [GalleryDate] [datetime] NOT NULL DEFAULT (GETDATE()),
    [Description] [nvarchar](MAX) NULL,
    [CreatedAt] [datetime] NOT NULL DEFAULT (GETDATE()),
    PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- GALLERY IMAGES TABLE (Detail - individual photos)
CREATE TABLE [dbo].[GalleryImages](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [GalleryId] [int] NOT NULL,
    [ImageUrl] [nvarchar](2000) NOT NULL,
    [Caption] [nvarchar](250) NULL,
    [DisplayOrder] [int] NOT NULL DEFAULT (1),
    [CreatedAt] [datetime] NOT NULL DEFAULT (GETDATE()),
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_GalleryImages_Galleries FOREIGN KEY ([GalleryId])
        REFERENCES [dbo].[Galleries] ([Id]) ON DELETE CASCADE
);
GO
