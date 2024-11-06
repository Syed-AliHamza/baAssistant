

import sql, { ConnectionPool, config as SQLConfig } from 'mssql';

// Interface for the database configuration
const config: SQLConfig = {
  user: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  options: {
    encrypt: true, // Use this if you're connecting to Azure SQL
    trustServerCertificate: true, // Change to 'true' for local dev / self-signed certs
  },
};

let pool: ConnectionPool | null = null;

export async function getDBConnection(): Promise<ConnectionPool> {
  try {
    if (!pool) {
      pool = await sql.connect(config);
    }
    return pool;
  } catch (err) {
    console.error('Database connection failed: ', err);
    throw err;
  }
}

export async function closeDBConnection(): Promise<void> {
  try {
    if (pool) {
      // await pool.close();
      pool = null;
    }
  } catch (err) {
    console.error('Failed to close the database connection: ', err);
  }
}
