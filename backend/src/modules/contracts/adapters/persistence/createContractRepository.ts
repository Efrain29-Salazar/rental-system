import { getPostgresPool, isPostgresEnabled } from '../../../../shared/persistence';
import { ContractRepository } from '../../ports/ContractRepository';
import { InMemoryContractRepository } from './InMemoryContractRepository';
import { PostgresContractRepository } from './PostgresContractRepository';

// Elige dónde se guardan los contratos según las variables de entorno (.env).
export const createContractRepository = (): ContractRepository => {
  // Con PERSISTENCE = postgres y DATABASE_URL: PostgreSQL con pg (SQL escrito a mano).
  if (isPostgresEnabled()) {
    console.log('Contracts persistence: PostgreSQL with pg');
    return new PostgresContractRepository(getPostgresPool());
  }

  // Por defecto: lista en memoria.
  console.log('Contracts persistence: in memory');
  return new InMemoryContractRepository();
};
