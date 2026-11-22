import { getPostgresPool, isPostgresEnabled } from '../../../../shared/persistence';
import { PropertyRepository } from '../../ports/PropertyRepository';
import { InMemoryPropertyRepository } from './InMemoryPropertyRepository';
import { PostgresPropertyRepository } from './PostgresPropertyRepository';

// Elige dónde se guardan las propiedades según las variables de entorno (.env).
export const createPropertyRepository = (): PropertyRepository => {
  // Con PERSISTENCE = postgres y DATABASE_URL: PostgreSQL con pg (SQL escrito a mano).
  if (isPostgresEnabled()) {
    console.log('Properties persistence: PostgreSQL with pg');
    return new PostgresPropertyRepository(getPostgresPool());
  }

  // Por defecto: lista en memoria.
  console.log('Properties persistence: in memory');
  return new InMemoryPropertyRepository();
};
