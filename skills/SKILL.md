# SKILL.md — SLSQ Web Application Backend Development Guide

This document serves as the master specification, architecture design, database schema, and execution rules for developing the backend API for the Sri Lanka Society of Queensland (SLSQ) web application using **Node.js**, **TypeScript**, and **Microsoft SQL Server (MSSQL)**.

---

## 1. Project Tech Stack & Ecosystem

| Layer                  | Technology                 | Key Libraries / Modules                                     |
| :--------------------- | :------------------------- | :---------------------------------------------------------- |
| **Runtime & Language** | Node.js + TypeScript       | `tsx` (dev runtime), `tsc` (build)                          |
| **HTTP Framework**     | Express.js                 | `express`, `cors`, `helmet`, `morgan`                       |
| **Database Driver**    | `node-mssql` (`mssql`)     | `mssql`, `@types/mssql` (uses `tedious` engine)             |
| **Authentication**     | JWT + Argon2/Bcrypt        | `jsonwebtoken`, `argon2` (or `bcrypt`), `express-validator` |
| **File Storage**       | Local File System (Multer) | `multer`, `@types/multer`                                   |
| **Environment Config** | dotenv                     | `dotenv`                                                    |

---

## 2. Updated Database Schema (TSQL Script)

The original script has been modified to support **publications**, **updated user authentication (with password hashes and salts)**, **event image relationships**, and **proper foreign keys**[cite: 1].

```sql
USE [slsq]
GO

-- =============================================
-- 1. DROP EXISTING TABLES (IF RE-CREATING)
-- =============================================
IF OBJECT_ID('dbo.EventDetails', 'U') IS NOT NULL DROP TABLE dbo.EventDetails;
IF OBJECT_ID('dbo.Events', 'U') IS NOT NULL DROP TABLE dbo.Events;
IF OBJECT_ID('dbo.Members', 'U') IS NOT NULL DROP TABLE dbo.Members;
IF OBJECT_ID('dbo.Presidents', 'U') IS NOT NULL DROP TABLE dbo.Presidents;
IF OBJECT_ID('dbo.Publications', 'U') IS NOT NULL DROP TABLE dbo.Publications;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

-- =============================================
-- 2. CREATE TABLES
-- =============================================

-- USERS TABLE (Secure Auth Setup)
CREATE TABLE [dbo].[Users](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Firstname] [nvarchar](255) NOT NULL,
    [Lastname] [nvarchar](255) NOT NULL,
    [Username] [nvarchar](50) NOT NULL UNIQUE,
    [PasswordHash] [nvarchar](255) NOT NULL,
    [PasswordSalt] [nvarchar](255) NOT NULL,
    [Role] [nvarchar](20) NOT NULL DEFAULT ('Admin'),
    [CreatedAt] [datetime] NOT NULL DEFAULT (GETDATE()),
    PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- EVENTS TABLE
CREATE TABLE [dbo].[Events](
    [EventId] [int] IDENTITY(1,1) NOT NULL,
    [EventName] [nvarchar](2000) NOT NULL,
    [EventDate] [datetime] NOT NULL DEFAULT (GETDATE()),
    [Description] [nvarchar](MAX) NULL,
    [CreatedAt] [datetime] NOT NULL DEFAULT (GETDATE()),
    PRIMARY KEY CLUSTERED ([EventId] ASC)
);
GO

-- EVENT DETAILS / GALLERY IMAGES TABLE
CREATE TABLE [dbo].[EventDetails](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [EventId] [int] NOT NULL,
    [EventPosterImageUrl] [nvarchar](2000) NOT NULL,
    [Caption] [nvarchar](250) NULL,
    [DisplayOrder] [int] NOT NULL DEFAULT (1),
    [CreatedAt] [datetime] NOT NULL DEFAULT (GETDATE()),
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT FK_EventDetails_Events FOREIGN KEY ([EventId])
        REFERENCES [dbo].[Events] ([EventId]) ON DELETE CASCADE
);
GO

-- PRESIDENTS TABLE
CREATE TABLE [dbo].[Presidents](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [PresidentName] [nvarchar](100) NOT NULL,
    [PeriodFrom] [int] NOT NULL,
    [PeriodTo] [int] NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- MEMBERS / COMMITTEE POSTS TABLE
CREATE TABLE [dbo].[Members](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Post] [nvarchar](100) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [DisplayOrder] [int] NOT NULL DEFAULT (0),
    PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- PUBLICATIONS TABLE (Newsletters / Magazines)
CREATE TABLE [dbo].[Publications](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Title] [nvarchar](255) NOT NULL,
    [Year] [int] NOT NULL,
    [Month] [int] NOT NULL, -- 1 = Jan, 12 = Dec
    [Description] [nvarchar](MAX) NULL,
    [PdfUrl] [nvarchar](2000) NOT NULL,
    [CreatedAt] [datetime] NOT NULL DEFAULT (GETDATE()),
    PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- =============================================
-- 3. SEED DATA
-- =============================================
SET IDENTITY_INSERT [dbo].[Presidents] ON;
INSERT [dbo].[Presidents] ([Id], [PresidentName], [PeriodFrom], [PeriodTo]) VALUES
(1, N'Pat Abey', 1978, 1983),
(2, N'Dr Neil Karunaratne', 1984, 1984),
(3, N'Don Dias Jayasinghe', 1985, 1985),
(4, N'Anton Swan', 1986, 1988);
SET IDENTITY_INSERT [dbo].[Presidents] OFF;
GO

SET IDENTITY_INSERT [dbo].[Events] ON;
INSERT [dbo].[Events] ([EventId], [EventName], [EventDate], [Description]) VALUES
(1, N'The Sinhala New Year 2021', CAST(N'2021-04-13T00:00:00.000' AS DateTime), N'Annual Cultural Celebration');
SET IDENTITY_INSERT [dbo].[Events] OFF;
GO
```

## 3. Comprehensive Directory & File Storage Specifications

A. Event Photo Gallery Specifications

- Root Storage Directory: public/uploads/events/{YYYYMMDD}/
- Folder Naming Rule: Dates must be extracted from the associated event's EventDate column in YYYYMMDD format.
- Example: An event on June 1, 2025 generates directory public/uploads/events/20250601/.
- File Naming Pattern: img\_ followed by a padded 3-digit number (e.g., img_001.jpg, img_002.jpg, up to img_999.jpg).
- Auto-Increment Logic (Multer Custom Storage Strategy):
  - On upload request, inspect target folder public/uploads/events/{YYYYMMDD}/.
  - Read existing files matching pattern /^img\_(\d{3})\.(jpg|jpeg|png|webp)$/i.
  - Extract all numerical indexes, find max_index. If folder is empty, max_index = 0.
  - Save new image as img\_ + String(max_index + 1).padStart(3, '0') + original extension.
- Front-End & Gallery Operations:
  - System must store relative URL in EventDetails.EventPosterImageUrl (e.g., /uploads/events/20250601/img_001.jpg).
  - Front-end displays image list as responsive thumbnails.
  - Clicking thumbnail opens modal overlay with full resolution image URL.
  - Editing allows user to update event name/date, upload additional images (continuing the auto-increment counter), or delete single/multiple images (removes DB record and runs fs.unlinkSync() on disk).
    B. Publications PDF Storage SpecificationsRoot Storage Directory:
- public/uploads/publications/{YYYYMM}/
  Folder Naming Rule: Extracted from input Year and 2-digit Month (YYYYMM).
- Example: Year 2017, Month 05 (May) generates directory public/uploads/publications/201705/.
  File Naming Pattern: News Letter {MonthName} {YYYY}.pdfExample: News Letter May 2017.pdf
- Upload Processing:
  - User submits Year, Month (1-12), Title, Description, and attached PDF file.
  - Backend converts month number to full month name (e.g., 5 $\rightarrow$ May).
  - Automatically creates folder public/uploads/publications/201705/.
  - Saves file as News Letter May 2017.pdf.
  - Inserts record into Publications table with relative PDF link /uploads/publications/201705/News Letter May 2017.pdf.

## 4. API Endpoints Implementation Specification

- Authentication Module (/api/auth)
  - POST /api/auth/register
    Body: { firstname, lastname, username, password }
    Action: Generates secure salt, hashes password with Argon2/Bcrypt, inserts into Users table.
  - POST /api/auth/login
    Body: { username, password }
    Action: Validates user, verifies hash, returns JWT signed token.

- Events & Gallery Module (/api/events)
  - GET /api/events — Returns list of all events with associated images list.
  - POST /api/events — Creates event entry (accepts eventName, eventDate, description). Returns created EventId.
  - PUT /api/events/:id — Updates EventName or EventDate. If date changes, renames existing upload directory if present.
  - DELETE /api/events/:id — Deletes event record from database and recursively deletes physical upload folder public/uploads/events/{YYYYMMDD}/.
  - POST /api/events/:id/images — Accepts multi-part form data array (files). Performs folder check, auto-increments file names (img_001.jpg), saves files, and creates EventDetails records.
  - DELETE /api/events/images/:imageId — Deletes specific image entry from DB and deletes local file from disk.

- About Us Module (/api/about)
  - GET /api/about/presidents — Retrieves all past presidents ordered by PeriodFrom ASC.
  - POST /api/about/presidents — Inserts new president record { presidentName, periodFrom, periodTo }.
  - PUT /api/about/presidents/:id — Updates past president details.
  - DELETE /api/about/presidents/:id — Removes record.
  - GET /api/about/members — Retrieves all society post holders ordered by DisplayOrder ASC.
  - POST /api/about/members — Adds committee member { post, name, displayOrder }.
  - PUT /api/about/members/:id — Updates post or holder name.
  - DELETE /api/about/members/:id — Deletes post holder record.

- Publications Module (/api/publications)
  - GET /api/publications — Returns all publications ordered by Year DESC, Month DESC.
  - POST /api/publications — Multi-part form handler for { file, title, year, month, description }. Automatically formats directory YYYYMM and filename News Letter {MonthName} {YYYY}.pdf.
  - DELETE /api/publications/:id — Removes publication DB record and deletes physical PDF file from server.

## 5. Architectural Rules & Code Patterns for Development

1. Database Parameterization Strategy:

   ALWAYS use parameterized queries via node-mssql tagged template literals to prevent SQL Injection.
   import sql from 'mssql';

// Safe Query Execution
const event = await sql.query`  SELECT * FROM Events WHERE EventId = ${eventId}`;

2. Connection Pooling Pattern (db.ts):
   Do NOT open/close database connections inside controller loops. Use a globally managed connection pool.

   ex :
   import sql from 'mssql';

const config: sql.config = {
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
server: process.env.DB_SERVER || 'localhost',
database: process.env.DB_NAME || 'slsq',
options: { encrypt: true, trustServerCertificate: true }
};

export const poolPromise = new sql.ConnectionPool(config)
.connect()
.then(pool => {
console.log('Connected to MSSQL Database');
return pool;
})
.catch(err => {
console.error('Database Connection Failed! ', err);
process.exit(1);
});

3 Auto-Incrementing File Naming Helper (fileUtils.ts):

ex:
import fs from 'fs';
import path from 'path';

export function getNextImageFilename(directoryPath: string, extension: string): string {
if (!fs.existsSync(directoryPath)) {
fs.mkdirSync(directoryPath, { recursive: true });
}

const files = fs.readdirSync(directoryPath);
let maxNum = 0;
const regex = /^img\_(\d{3})\./i;

files.forEach(file => {
const match = file.match(regex);
if (match) {
const num = parseInt(match[1], 10);
if (num > maxNum) maxNum = num;
}
});

const nextNum = String(maxNum + 1).padStart(3, '0');
return `img_${nextNum}${extension}`;
}

## 6. Migration Script: Front-End Data Import Utility

To migrate your initial hardcoded front-end array (ImageSets) into the SQL Server database automatically, run the following Node.js TypeScript seed script once:

``node `import sql from 'mssql';

const config: sql.config = {
user: process.env.DB_USER || 'sa',
password: process.env.DB_PASSWORD || 'yourPassword',
server: process.env.DB_SERVER || 'localhost',
database: process.env.DB_NAME || 'slsq',
options: {
encrypt: true,
trustServerCertificate: true
}
};```

const ImageSets = [
{ caption: "Sinhala And Tamil New Year 2021" },
{ caption: "Members And Friends Lunch 2020" },
{ caption: "Dance School Opening Ceremony 2020" },
{ caption: "Founders Day Celebrations 2019" },
{ caption: "Sri Lankan New Year Cultural Concert 2018" },
{ caption: "SLSQ Invited to Bhutan King’s 41st Birthday Celebrations" },
{ caption: "Book Launch -Dr Nimal Sedera 2017" },
{ caption: "National Dance Troupe 2017" },
{ caption: "Sri Lankan New Year Cultural Concert 2017" },
{ caption: "Sri Lankan New Year Cultural Concert 2016" },
{ caption: "Talk by Tina Faulk" },
{ caption: "Clean Water Appeal" },
{ caption: "Members and Friends Get-Together" },
{ caption: "Sri Lankan New Year Cultural Concert 2015" },
{ caption: "Sri Lankan New Year Cultural Concert 2014" }
];

## images

export const SinhalaNewYear2021 = [
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-005.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-011.jpg',
},
{
src: 'assets/images/members-and-friends/0B2A4513.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0001_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0002_result-2048x1365.jpg',
},
{ src: 'assets/images/members-and-friends/DSC_0003_result.jpg' },
{
src: 'assets/images/members-and-friends/DSC_0004_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0004-a_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0011_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0012_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0013_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0023_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0025_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0026_result-2048x1365.jpg',
},
{
src: 'assets/images/members-and-friends/DSC_0029_result-2048x1365.jpg',
},
{ src: 'assets/images/members-and-friends/DSC_0029-A_result.jpg' },
{ src: 'assets/images/members-and-friends/DSC_0042.jpg' },
{ src: 'assets/images/members-and-friends/DSC_0046.jpg' },
{ src: 'assets/images/members-and-friends/DSC_0047.jpg' },
{ src: 'assets/images/members-and-friends/DSC_0050.jpg' },
{ src: 'assets/images/members-and-friends/IMG_0404.jpg' },
{ src: 'assets/images/members-and-friends/NY-2015-1.jpeg' },
{ src: 'assets/images/members-and-friends/NY-2015-2.jpeg' },
{ src: 'assets/images/members-and-friends/NY-2015-3.jpeg' },
{ src: 'assets/images/members-and-friends/NY-2015-4.jpeg' },
{ src: 'assets/images/members-and-friends/NY-2015-5.jpeg' },
{ src: 'assets/images/members-and-friends/NY-2015-6.jpeg' },
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-005.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-011.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-013.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-016.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-018.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-019.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-026.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-034.jpg',
},
{
src: 'assets/images/members-and-friends/SLSQ-Dance-13-Sept-2014-060.jpg',
},
{ src: 'assets/images/members-and-friends/Untitled-4.jpg' },
{ src: 'assets/images/members-and-friends/0B2A4358.jpg' },
{ src: 'assets/images/members-and-friends/0B2A4367.jpg' },
{ src: 'assets/images/members-and-friends/0B2A4373.jpg' },
{ src: 'assets/images/members-and-friends/0B2A4375.jpg' },
];

export const MemebersAndFriendsLunch = [
{ src: 'assets/images/members-and-friends/Untitled-4.jpg' },
{ src: 'assets/images/members-and-friends/0B2A4358.jpg' },
{ src: 'assets/images/members-and-friends/0B2A4367.jpg' },
{ src: 'assets/images/members-and-friends/0B2A4373.jpg' },
{ src: 'assets/images/members-and-friends/0B2A4375.jpg' },
];

export const DanceSchoolOpeningCeremony2020 = [
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0030-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0031-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0032-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0033-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0034-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0035-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0036-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0037-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0038-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0039-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0040-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0041-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0042-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0043-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0044-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0045-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0046-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0048-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0049-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0050-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0052-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0056-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0057-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0058-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0059-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0061-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0062-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0063-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1894.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1895.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1896.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1897.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1898.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/IMG-8010-2048x1536.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0006-1-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0007-1-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0010-1-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0011-1-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0013_x.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0013-1-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0016-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0017-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0018-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0019-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0020-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0021-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0023-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0025-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0027-2048x1365.jpg',
},
{
src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0029-2048x1365.jpg',
},
];

export const MembersAndFriendsLunch2020 = [
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0221-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0223-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0225-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0226-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0227-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0228-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0231-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0232-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0233-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0234-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0235-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0236-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0237-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0238-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0239-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0240-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0241-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0243-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0244-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0246-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0247-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0248-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0249-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0251-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0252-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0253-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0254-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0255-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0258-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0259-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0262-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0263-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0264-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0265-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0266-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0267-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0269-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0271-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0272-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0273-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0275-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0277-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0279-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0280-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0282-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0284-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0286-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0287-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0289-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/Members-and-Friend-Lunch-Photo-From-Mobile.png',
},
{ src: 'assets/images/members-and-friends-lunch-2020/1-scaled.jpg' },
{ src: 'assets/images/members-and-friends-lunch-2020/2-scaled.jpg' },
{ src: 'assets/images/members-and-friends-lunch-2020/3-scaled.jpg' },
{ src: 'assets/images/members-and-friends-lunch-2020/4-scaled.jpg' },
{
src: 'assets/images/members-and-friends-lunch-2020/124958056_2748788878726584_4167815494442552408_o.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/125054525_2748789185393220_8572915565859023904_o.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/125082630_2748789052059900_1265068747301884052_o.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/125192661_2748789015393237_6507754489557875058_o.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/125496912_2748789002059905_3601963825338897900_o.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/125523880_2748788898726582_3659294354030466294_o.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/125812289_2748789222059883_5253911402059017604_o.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/125830883_2748788925393246_7155857423514518254_o.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0214-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0215-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0216-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0217-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0218-scaled.jpg',
},
{
src: 'assets/images/members-and-friends-lunch-2020/IMG_0220-scaled.jpg',
},
];
export const FoundersDayCelebrations2019 = [
{ src: 'assets/images/founders-day-celebrations-2019/15a_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/15b_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/16_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/1a_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/1b_o.jpg' },
{
src: 'assets/images/founders-day-celebrations-2019/1bb_o-1536x2048.jpg',
},
{
src: 'assets/images/founders-day-celebrations-2019/1c_o-2048x963.jpg',
},
{ src: 'assets/images/founders-day-celebrations-2019/2_o.jpg' },
{
src: 'assets/images/founders-day-celebrations-2019/3_o-2048x930.jpg',
},
{ src: 'assets/images/founders-day-celebrations-2019/4_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/4a_o.jpg' },
{
src: 'assets/images/founders-day-celebrations-2019/5_o-2048x968.jpg',
},
{
src: 'assets/images/founders-day-celebrations-2019/7_o-2048x777.jpg',
},
{ src: 'assets/images/founders-day-celebrations-2019/8_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/9_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/10_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/11_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/12_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/13_o.jpg' },
{ src: 'assets/images/founders-day-celebrations-2019/14_o.jpg' },
];

export const SrilankanNewYearCulturalConcert2018 = [
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6413-768x1030.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6350-1024x683.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6359-1024x683.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6366-1024x384.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6377-1024x665.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6383-1024x664.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6390-1024x738.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6393-1024x683.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6397-1024x811.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6400-1024x683.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6401-1024x683.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6404-768x1100.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2018/LIMG_6408.jpg' },
];

export const SLSQInvitedToBhutanKings41stBirthdayCelebrations = [
{
src: 'assets/images/slsq-invited-to-bhutan-kings-41st-birthday-celebrations/IMG-20210221-WA0015-768x512-1.jpg',
description:
'Karma Tenzin, President, BBAI and Namal, President, Sri Lanka Society of Queensland during the cake cutting ceremony of the 41st Birth Anniversary Celebrations of His Majesty the King, 2021',
},
{
src: 'assets/images/slsq-invited-to-bhutan-kings-41st-birthday-celebrations/Brisbane-Bhutan-SLSQ-Event.jpg',
},
{
src: 'assets/images/slsq-invited-to-bhutan-kings-41st-birthday-celebrations/IMG-20210221-WA0005.jpg',
},
];

export const TalkByTinaFaulk = [
{ src: 'assets/images/talk-by-tina-faulk/DSC_0046.jpg' },
{ src: 'assets/images/talk-by-tina-faulk/DSC_0047.jpg' },
{ src: 'assets/images/talk-by-tina-faulk/DSC_0050.jpg' },
{ src: 'assets/images/talk-by-tina-faulk/DSC_0042.jpg' },
];

export const CleanWaterAppeal = [
{ src: 'assets/images/clean-water-appeal/Untitled-2-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-3-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-4-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-5-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-6-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-7-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-8-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-9-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-10-150x150.jpg' },
{ src: 'assets/images/clean-water-appeal/Untitled-1-150x150.jpg' },
];

export const SriLankanNewYearCulturalConcert2014 = [
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-28-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-29-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-30-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-31-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-32-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-33-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-34-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/IND_0662-150x150.jpg',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-11-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-12-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-13-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-14-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-15-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-16-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-17-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-18-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-19-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-20-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-21-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-22-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-23-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-24-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-25-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-26-2-150x150.png',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2014/New-Year-27-2-150x150.png',
},
];

export const BookLaunch = [
{ src: 'assets/images/book-launch/untitled-89-2-768x561.jpg' },
{ src: 'assets/images/book-launch/untitled-90-3.jpg' },
{ src: 'assets/images/book-launch/untitled-92-4-768x538.jpg' },
{ src: 'assets/images/book-launch/untitled-95-6-768x558.jpg' },
{ src: 'assets/images/book-launch/untitled-96-7-624x487.jpg' },
{ src: 'assets/images/book-launch/untitled-98-9-624x509.jpg' },
{ src: 'assets/images/book-launch/untitled-100-11.jpg' },
{ src: 'assets/images/book-launch/untitled-101-12.jpg' },
{ src: 'assets/images/book-launch/untitled-109-20-624x660.jpg' },
{ src: 'assets/images/book-launch/untitled-120-31.jpg' },
{ src: 'assets/images/book-launch/untitled-121-32-624x623.jpg' },
{ src: 'assets/images/book-launch/untitled-131-38-624x722.jpg' },
{ src: 'assets/images/book-launch/untitled-134-40-768x543.jpg' },
{ src: 'assets/images/book-launch/untitled-138-41-768x460.jpg' },
{ src: 'assets/images/book-launch/untitled-144-45.jpg' },
{ src: 'assets/images/book-launch/untitled-161-49-624x881.jpg' },
{ src: 'assets/images/book-launch/untitled-165-52.jpg' },
{ src: 'assets/images/book-launch/untitled-173-58-624x575.jpg' },
{ src: 'assets/images/book-launch/untitled-175-59.jpg' },
{ src: 'assets/images/book-launch/untitled-176-60.jpg' },
{ src: 'assets/images/book-launch/untitled-180-61-624x593.jpg' },
{ src: 'assets/images/book-launch/untitled-189-63-768x474.jpg' },
{ src: 'assets/images/book-launch/untitled-193-66.jpg' },
{ src: 'assets/images/book-launch/untitled-201-67-768x572.jpg' },
{ src: 'assets/images/book-launch/untitled-205-71-624x732.jpg' },
];

export const NationalDanceTroupe2017 = [
{
src: 'assets/images/national-dance-troupe-2017/0B2A4358-624x489.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4367-1-624x778.jpg',
},
{ src: 'assets/images/national-dance-troupe-2017/0B2A4375.jpg' },
{ src: 'assets/images/national-dance-troupe-2017/0B2A4375-1.jpg' },
{
src: 'assets/images/national-dance-troupe-2017/0B2A4513-1-624x561.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4513-624x561.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4522-768x644.jpg',
},
{ src: 'assets/images/national-dance-troupe-2017/0B2A4541.jpg' },
{ src: 'assets/images/national-dance-troupe-2017/0B2A4560.jpg' },
{
src: 'assets/images/national-dance-troupe-2017/0B2A4571-1024x704.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4595-624x630.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4621-624x640.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4633-1024x654.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4681-1024x614.jpg',
},
{ src: 'assets/images/national-dance-troupe-2017/0B2A4741.jpg' },
{
src: 'assets/images/national-dance-troupe-2017/0B2A4764-1024x490.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4775-624x604.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/Group_1-2-of-1-624x416.jpg',
},
{
src: 'assets/images/national-dance-troupe-2017/0B2A4358-1-624x489.jpg',
},
];

export const MembersAndFriendsGetTogether = [
{
src: 'assets/images/members-and-friends-get-together/IMG_0374-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/IMG_0375-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/IMG_0380-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/IMG_0381-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/IMG_0385-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/IMG_0399-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/IMG_0404-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-005-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-011-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-013-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-016-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-018-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-019-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-026-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-034-150x150.jpg',
},
{
src: 'assets/images/members-and-friends-get-together/SLSQ-Dance-13-Sept-2014-060-150x150.jpg',
},
];

export const SrilankanNewYearCulturalConcert2015 = [
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2015/NY-2015-2.jpeg',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2015/NY-2015-3.jpeg',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2015/NY-2015-4.jpeg',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2015/NY-2015-5.jpeg',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2015/NY-2015-6.jpeg',
},
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2015/NY-2015-1.jpeg',
},
];

export const SrilankanNewYearCulturalConcert2016 = [
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-74-768x539.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-75.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-56-768x534.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-57-768x527.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-58-768x296.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-59-768x289.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-60-768x211.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-61-768x337.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-62-1-768x321.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-62-768x321.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-63-768x744.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-64-624x857.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-65-624x857.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-66-768x740.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-67-768x742.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-68-768x540.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-69-768x742.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-70-768x540.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-71-768x538.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-72-768x538.jpeg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2016/NY-2016-73-768x539.jpeg' },
];

export const SrilankanNewYearCulturalConcert2017 = [
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/baratha2-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Buffet1-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/buffet3-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/committee1-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/drumming2-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/drumming3-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/drumming-item1-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/drumming-item2-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/folk-dance1-768x513.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/folk-dance4-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Gara-Yakum1-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Gara-Yakum2-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/island-home2-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/pooja2-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Pooja4-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Pooja5-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Pooja-dance-1-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Rabana-768x516.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Ran-wan-dance1-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/Ran-wan-dance2-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/01_8076479-768x512.jpg' },
{
src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/02_Invitees-greeting1-768x512.jpg',
},
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/03_Invitees-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/04_Invitees-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/05_lighting-lamp-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/06_lighting-lamp-768x513.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/07_lighting-lamp-624x936.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/08_boiling-milk-624x936.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/09_rabana1-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/10_speech-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/11_speech-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/12_Speech-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/13_Speech-624x624.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/audience1-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/audience2-768x512.jpg' },
{ src: 'assets/images/sri-lankan-new-year-cultural-concert-2017/baratha1-768x512.jpg' },
];

export const DancingSchoolOpeningCeremony2020 = [
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0033-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0034-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0035-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0036-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0037-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0038-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0039-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0040-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0041-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0042-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0043-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0044-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0045-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0046-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0048-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0049-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0050-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0052-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0056-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0057-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0058-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0059-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0061-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0062-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0063-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1894.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1895.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1896.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1897.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/IMG-1898.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/IMG-8010-2048x1536.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0006-1-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0007-1-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0010-1-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0011-1-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0013_x.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0013-1-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0016-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0017-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0018-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0019-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0020-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0021-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0023-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0025-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0027-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0029-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0030-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0031-2048x1365.jpg' },
{ src: 'assets/images/dance-school-opening-ceremony-2020/DSC_0032-2048x1365.jpg' },
];

const PastEventsData = [
{
url: "../assets/events/sankathana-6th-september-2025-large.webp",
alt: "Event",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-2021-page-001-1583x2048.jpg",
alt: "Event",
eventDate: "18/11/2025",
},
{
url: "../assets/events/25082019-791x1024.jpg",
alt: "Event",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Book-Launch-2018-2.png",
alt: "Book Launch 2018",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Dance-Troupe-Flyer-English-002.jpg",
alt: "Dance Troupe Flyer English",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Dance-Troupe-Flyer-Sinhala-002.jpg",
alt: "Dance Troupe Flyer Sinhala",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Dancing-Classes-Flyer-Final.jpg",
alt: "Dancing Classes Flyer Final",
eventDate: "18/11/2025",
},
{
url: "../assets/events/event_oct16_904x695.png",
alt: "Event Oct 16",
eventDate: "18/11/2025",
},
{ url: "../assets/events/Flyer.png", alt: "Flyer", eventDate: "18/11/2025" },
{
url: "../assets/events/Flyer_Portrait_2.jpg",
alt: "Flyer Portrait",
eventDate: "18/11/2025",
},
{
url: "../assets/events/fun_day.jpg",
alt: "Fun Day",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-17-Flyer-1.png",
alt: "Flyer",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-2019.jpg",
alt: "",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-Flyer-2015.jpg",
alt: "Flyer 2015",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-Flyer-2016.jpg",
alt: "Flyer 2016",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-Flyer-2018_2.jpg",
alt: "Flyer 2018",
eventDate: "18/11/2025",
},
{
url: "../assets/events/September4event.jpg",
alt: "September 4 Event",
eventDate: "18/11/2025",
},
{
url: "../assets/events/September-Poster.jpg",
alt: "September Poster",
eventDate: "18/11/2025",
},
{
url: "../assets/events/SLSQ-Members-Friends-Lunch-2020.png",
alt: "SLSQ Members Friends Lunch 2020",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Tinas-Book1.png",
alt: "Tinas Book",
eventDate: "18/11/2025",
},
];

export { PastEventsData };

const PastEventsData = [
{
url: "../assets/events/sankathana-6th-september-2025-large.webp",
alt: "Event",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-2021-page-001-1583x2048.jpg",
alt: "Event",
eventDate: "18/11/2025",
},
{
url: "../assets/events/25082019-791x1024.jpg",
alt: "Event",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Book-Launch-2018-2.png",
alt: "Book Launch 2018",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Dance-Troupe-Flyer-English-002.jpg",
alt: "Dance Troupe Flyer English",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Dance-Troupe-Flyer-Sinhala-002.jpg",
alt: "Dance Troupe Flyer Sinhala",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Dancing-Classes-Flyer-Final.jpg",
alt: "Dancing Classes Flyer Final",
eventDate: "18/11/2025",
},
{
url: "../assets/events/event_oct16_904x695.png",
alt: "Event Oct 16",
eventDate: "18/11/2025",
},
{ url: "../assets/events/Flyer.png", alt: "Flyer", eventDate: "18/11/2025" },
{
url: "../assets/events/Flyer_Portrait_2.jpg",
alt: "Flyer Portrait",
eventDate: "18/11/2025",
},
{
url: "../assets/events/fun_day.jpg",
alt: "Fun Day",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-17-Flyer-1.png",
alt: "Flyer",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-2019.jpg",
alt: "",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-Flyer-2015.jpg",
alt: "Flyer 2015",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-Flyer-2016.jpg",
alt: "Flyer 2016",
eventDate: "18/11/2025",
},
{
url: "../assets/events/New-Year-Flyer-2018_2.jpg",
alt: "Flyer 2018",
eventDate: "18/11/2025",
},
{
url: "../assets/events/September4event.jpg",
alt: "September 4 Event",
eventDate: "18/11/2025",
},
{
url: "../assets/events/September-Poster.jpg",
alt: "September Poster",
eventDate: "18/11/2025",
},
{
url: "../assets/events/SLSQ-Members-Friends-Lunch-2020.png",
alt: "SLSQ Members Friends Lunch 2020",
eventDate: "18/11/2025",
},
{
url: "../assets/events/Tinas-Book1.png",
alt: "Tinas Book",
eventDate: "18/11/2025",
},
];

export { PastEventsData };

export const pastPresidents = [
{
period: "1978 – 1983",
name: "Pat Abey",
},
{
period: "1984",
name: "Dr Neil Karunaratne",
},

{
period: "1985",
name: "Don Dias Jayasinghe",
},

{
period: "1986 – 1988",
name: "Anton Swan",
},

{
period: "1989",
name: "Dr Graydon Van Houten",
},

{
period: "1990 – 1991",
name: "Rukmani Jayasinghe ",
},

{
period: "1992",
name: "Pat Abey",
},

{
period: "1993",
name: "Ken Harvie",
},
{
period: "1994 – 1996",
name: "Dr Lakhsman Jayasinghe ",
},
{
period: "1997",
name: "Ivan Wijetunge",
},

{
period: "1998 – 1999",
name: "Dr Lakhsman Jayasinghe ",
},

{
period: "2000",
name: "Pat Abey",
},

{
period: "2001 – 2002",
name: "Ernie Perera",
},

{
period: "2003 – 2004",
name: "Dr Lakhsman Jayasinghe",
},

{
period: "2005 – 2006",
name: "Nimal De Silva",
},

{
period: "2007 – 2008",
name: "Hiran Cooray",
},

{
period: "2009 – 2010",
name: "Pushpa Jayasekera",
},

{
period: "2011 – 2012",
name: "Kanaji Wijesekera",
},

{
period: "2013 – 2016",
name: "Hermin Goonatilleke",
},

{
period: "2017 – 2019",
name: "Gothami Meepe",
},

{
period: "2020 – To date",
name: "Namal Wijeratne",
},
];

export const PUBLICATIONS = [
{
year: 2021,
months: [{ date: 'March', file: 'SLSQ-Newsletter_March.pdf' }],
},
{
year: 2020,
months: [
{ date: 'December', file: 'SLSQ-Newsletter_December.pdf' },
{ date: 'August', file: 'SLSQ-Newsletter_August.pdf' },
{ date: 'June', file: 'SLSQ-Newsletter_June.pdf' },
{ date: 'March', file: 'SLSQ-Newsletter-March-2020.pdf' },
],
},
{
year: '2019',
months: [
{ date: 'February', file: 'SLSQ-Newsletter-February-2019.pdf' },
{ date: 'September', file: 'SLSQ-Newsletter-September-2019.pdf' },
{ date: 'December', file: 'SLSQ-Newsletter-Decemer-2019.pdf' },
],
},
{
year: '2018',
months: [
{ date: 'January', file: 'SLSQ-January-18-Newsletter.pdf' },
{ date: 'June', file: 'SLSQ-Newsletter_June_2018.pdf' },
],
},
{
year: '2017',
months: [
{ date: 'February', file: 'SLSQ-Newsletter_1-February-2017.pdf' },
{ date: 'June', file: 'Newsletter-SLSQ_June-2017-.pdf' },
{ date: 'September', file: 'Newsletter-SLSQ_September2017-5.pdf' },
{ date: 'November', file: 'SLSQ-Newsletter_Nov_2017-1.pdf' },
],
},
{
year: '2016',
months: [
{ date: 'March', file: 'News-Letter-March-2016.pdf' },
{ date: 'June', file: 'News-Letter-June-2016.pdf' },
{ date: 'December', file: 'Newsletter-SLSQ-December-2016.pdf' },
],
},
{
year: '2015',
months: [],
},
{
year: '2014',
months: [
{ date: 'February', file: 'Sri-Lanka-Society-News-Letter-2014-February.pdf' },
{ date: 'May', file: 'Sri-Lanka-Society-News-Letter-2014-May.pdf' },
{ date: 'November', file: 'Sri-Lanka-Society-News-Letter-2014-November.pdf' },
{ date: 'December', file: 'Sri-Lanka-Society-News-Letter-2014-December.pdf' },
],
},
{
year: '2013',
months: [
{ date: 'February', file: 'february_2013_newsletter.pdf' },
{ date: 'August', file: 'Sri-Lanka-Society-News-Letter-2013-August.pdf' },
{ date: 'October', file: 'Sri-Lanka-Society-News-Letter-2013-October.pdf' },
{ date: 'December', file: 'Sri-Lanka-Society-News-Letter-2013-December.pdf' },
],
},
{
year: '2012',
months: [{ date: 'April', file: 'NewsLetter-April2012.pdf' }],
},
{
year: '2011',
months: [{ date: 'June', file: 'newsletter.vol31.june_.july_.2011.pdf' }],
},
{
year: '2008',
months: [
{ date: 'April', file: 'newsletter.vol31.march_.april_.2008.pdf' },
{ date: 'July', file: 'Newsletter5July08.pdf' },
],
},
{
year: '2007',
months: [{ date: 'April', file: 'News_Letter_April_2007.pdf' }],
},
{
year: 'SLSQConstitution',
months: [{ date: 'January', file: 'Sri-Lanka-Constitution.pdf' }],
},
];

async function seedLegacyEvents() {
try {
await sql.connect(config);
console.log('Connected to MSSQL Database.');

    for (const item of ImageSets) {
      // Create event entry in Events table
      const result = await sql.query`
        INSERT INTO Events (EventName, EventDate, Description)
        VALUES (${item.caption}, GETDATE(), ${'Migrated legacy event gallery'});
        SELECT SCOPE_IDENTITY() AS EventId;
      `;

      const newEventId = result.recordset[0].EventId;
      console.log(`Migrated: "${item.caption}" -> EventId: ${newEventId}`);
    }

    console.log('Migration completed successfully.');

} catch (err) {
console.error('Migration failed:', err);
} finally {
await sql.close();
}
}

seedLegacyEvents();
