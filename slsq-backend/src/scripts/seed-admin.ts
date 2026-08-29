/**
 * Seed Script: Create or reset the admin user password.
 *
 * Usage:
 *   cd slsq-backend
 *   npx tsx src/scripts/seed-admin.ts
 *
 * - If the admin user does NOT exist: creates it with the password below.
 * - If the admin user ALREADY exists: updates the password to the new value below.
 */

import sql from "mssql";
import argon2 from "argon2";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "yourPassword",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "slsq",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// ===== CHANGE THIS PASSWORD =====
const ADMIN_FIRSTNAME = "ADMINISTRATOR";
const ADMIN_LASTNAME = "SLSQ";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin@s1L9s7Q8##"; // this is the password you'll use to log into your app as the admin user
// ================================

async function seedAdmin() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to MSSQL Database.");

    // Generate salt and hash password
    const salt = crypto.randomBytes(32).toString("hex");
    const passwordHash = await argon2.hash(ADMIN_PASSWORD, {
      salt: Buffer.from(salt, "hex"),
    });

    // Check if user already exists
    const existing = await pool
      .request()
      .input("username", ADMIN_USERNAME)
      .query("SELECT Id FROM Users WHERE Username = @username");

    if (existing.recordset.length > 0) {
      // Update existing admin's password
      await pool
        .request()
        .input("passwordHash", passwordHash)
        .input("passwordSalt", salt)
        .input("username", ADMIN_USERNAME)
        .query(
          "UPDATE Users SET PasswordHash = @passwordHash, PasswordSalt = @passwordSalt WHERE Username = @username",
        );

      console.log(`Admin password updated successfully!`);
      console.log(`  Id:       ${existing.recordset[0].Id}`);
      console.log(`  Username: ${ADMIN_USERNAME}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
    } else {
      // Create new admin user
      const result = await pool
        .request()
        .input("firstname", ADMIN_FIRSTNAME)
        .input("lastname", ADMIN_LASTNAME)
        .input("username", ADMIN_USERNAME)
        .input("passwordHash", passwordHash)
        .input("passwordSalt", salt)
        .input("role", "Admin").query(`
          INSERT INTO Users (Firstname, Lastname, Username, PasswordHash, PasswordSalt, Role)
          VALUES (@firstname, @lastname, @username, @passwordHash, @passwordSalt, @role);
          SELECT SCOPE_IDENTITY() AS Id;
        `);

      console.log(`Admin user created successfully!`);
      console.log(`  Id:       ${result.recordset[0].Id}`);
      console.log(`  Username: ${ADMIN_USERNAME}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
    }

    await sql.close();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seedAdmin();
