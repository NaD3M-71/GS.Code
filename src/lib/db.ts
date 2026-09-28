import mysql from "mysql2/promise";

// En desarrollo, Next recarga los módulos en cada cambio.
// Guardamos el pool en globalThis para no abrir conexiones nuevas cada vez.
const globalParaDb = globalThis as unknown as { pool?: mysql.Pool };

export const pool =
  globalParaDb.pool ??
  mysql.createPool({
    host: process.env.BD_HOST,
    port: Number(process.env.BD_PORT ?? 3306),
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_NOMBRE,
    connectionLimit: 5,
    waitForConnections: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalParaDb.pool = pool;
}
