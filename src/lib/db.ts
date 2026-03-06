// src/lib/db.ts
// SQL Server connection pool singleton - never import in client components
import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,          // Required for Azure SQL
    trustServerCertificate: false,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Singleton pool — reused across all API routes in the same server process
let pool: sql.ConnectionPool | null = null;

export async function getDb(): Promise<sql.ConnectionPool> {
  if (!pool || !pool.connected) {
    pool = await new sql.ConnectionPool(config).connect();
    pool.on('error', (err) => {
      console.error('[DB] Pool error:', err);
      pool = null;
    });
  }
  return pool;
}

// Helper: run a parameterized query safely
export async function dbQuery<T = sql.IRecordSet<Record<string, unknown>>>(
  queryFn: (request: sql.Request) => Promise<sql.IResult<T>>
): Promise<T> {
  const db = await getDb();
  const request = new sql.Request(db);
  const result = await queryFn(request);
  return result.recordset as unknown as T;
}

export default getDb;
