import { getPostgresPool, isPostgresEnabled } from '../../../../shared/persistence';
import { PaymentRepository } from '../../ports/PaymentRepository';
import { InMemoryPaymentRepository } from './InMemoryPaymentRepository';
import { PostgresPaymentRepository } from './PostgresPaymentRepository';

// Elige dónde se guardan los pagos según las variables de entorno (.env).
export const createPaymentRepository = (): PaymentRepository => {
  // Con PERSISTENCE = postgres y DATABASE_URL: PostgreSQL con pg (SQL escrito a mano).
  if (isPostgresEnabled()) {
    console.log('Payments persistence: PostgreSQL with pg');
    return new PostgresPaymentRepository(getPostgresPool());
  }

  // Por defecto: lista en memoria.
  console.log('Payments persistence: in memory');
  return new InMemoryPaymentRepository();
};
