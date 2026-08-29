import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'slsq',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

export const poolPromise: Promise<sql.ConnectionPool> = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Connected to MSSQL Database');
    return pool;
  })
  .catch((err) => {
    console.error('Database Connection Failed! ', err);
    process.exit(1);
  });

export default sql;
