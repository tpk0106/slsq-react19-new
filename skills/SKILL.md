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

import sql from 'mssql';

const config: sql.config = {
user: process.env.DB_USER || 'sa',
password: process.env.DB_PASSWORD || 'yourPassword',
server: process.env.DB_SERVER || 'localhost',
database: process.env.DB_NAME || 'slsq',
options: {
encrypt: true,
trustServerCertificate: true
}
};

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
