import { Pool } from 'pg';

import { createPostgresPool } from './database/postgresPool';

// El pool de conexiones se crea una sola vez y lo comparten todos los módulos.
let pool: Pool | undefined;

// ¿Se debe usar PostgreSQL? Solo si PERSISTENCE vale postgres Y existe DATABASE_URL.
export const isPostgresEnabled = (): boolean =>
  process.env.PERSISTENCE === 'postgres' && Boolean(process.env.DATABASE_URL);

// Devuelve el pool compartido (lo crea la primera vez que se pide).
export const getPostgresPool = (): Pool => {
  if (!pool) {
    pool = createPostgresPool(process.env.DATABASE_URL as string);
  }

  return pool;
};
