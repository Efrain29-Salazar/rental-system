import { getPostgresPool, isPostgresEnabled } from '../../../../shared/persistence';
import { TenantRepository } from '../../ports/TenantRepository';
import { InMemoryTenantRepository } from './InMemoryTenantRepository';
import { PostgresTenantRepository } from './PostgresTenantRepository';

// Elige dónde se guardan los inquilinos según las variables de entorno (.env).
export const createTenantRepository = (): TenantRepository => {
  // Con PERSISTENCE = postgres y DATABASE_URL: PostgreSQL con pg (SQL escrito a mano).
  if (isPostgresEnabled()) {
    console.log('Tenants persistence: PostgreSQL with pg');
    return new PostgresTenantRepository(getPostgresPool());
  }

  // Por defecto: lista en memoria.
  console.log('Tenants persistence: in memory');
  return new InMemoryTenantRepository();
};