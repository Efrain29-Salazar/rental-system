// Carga el .env para tener TEST_DATABASE_URL (Jest no lo carga solo).
import 'dotenv/config';

import { Pool } from 'pg';

import { createPostgresPool } from '../../../../shared/database/postgresPool';
import { NewPayment } from '../../domain/Payment';
import { PostgresPaymentRepository } from './PostgresPaymentRepository';

// PROTECCIÓN: estas pruebas BORRAN las tablas. Si la base de pruebas no existe o es la misma
// que la de desarrollo, la suite falla ANTES de ejecutar cualquier prueba.
const testDatabaseUrl = process.env.TEST_DATABASE_URL?.trim();
const developmentDatabaseUrl = process.env.DATABASE_URL?.trim();

if (!testDatabaseUrl) {
  throw new Error('Falta TEST_DATABASE_URL en el archivo .env');
}

if (testDatabaseUrl === developmentDatabaseUrl) {
  throw new Error('TEST_DATABASE_URL no puede ser igual a DATABASE_URL: las pruebas borrarían los datos de desarrollo');
}

// Pago pendiente del contrato 1 (datos de prueba).
const pending = (dueDate: string, contractId = 1): NewPayment => ({
  contractId,
  dueDate,
  amount: 450.5,
  status: 'pendiente',
  paidDate: null,
});

describe('PostgresPaymentRepository', () => {
  let pool: Pool;
  let repository: PostgresPaymentRepository;

  beforeAll(() => {
    pool = createPostgresPool(testDatabaseUrl);
    repository = new PostgresPaymentRepository(pool);
  });

  // Antes de CADA prueba: vacía las tablas (CASCADE vacía también contratos y pagos), reinicia los ids
  // y crea la propiedad, el inquilino y el contrato 1 que los pagos necesitan por la clave foránea.
  beforeEach(async () => {
    await pool.query('TRUNCATE properties, tenants RESTART IDENTITY CASCADE');
    await pool.query(
      `INSERT INTO properties (address, type, monthly_price, owner) VALUES ('Av. Amazonas 123', 'departamento', 450, 'Marta Cevallos')`,
    );
    await pool.query(`INSERT INTO tenants (name, email, phone) VALUES ('Lucía Mendoza', 'lucia@correo.com', '0991234567')`);
    await pool.query(
      `INSERT INTO contracts (property_id, tenant_id, start_date, end_date, monthly_amount) VALUES (1, 1, '2026-01-15', '2026-07-15', 450)`,
    );
  });

  afterAll(async () => {
    await pool.end();
  });

  it('starts empty', async () => {
    expect(await repository.findByContract(1)).toEqual([]);
  });

  it('saves many payments, with ids, the dates as text and the amount as a number', async () => {
    const saved = await repository.saveMany([pending('2026-01-15'), pending('2026-02-15')]);

    expect(saved.map((payment) => payment.id)).toEqual([1, 2]);
    expect(saved[0]).toEqual({ id: 1, ...pending('2026-01-15') });
  });

  it('saves nothing when one of the payments fails (transaction)', async () => {
    await expect(repository.saveMany([pending('2026-01-15'), pending('2026-02-15', 999)])).rejects.toThrow();

    expect(await repository.findByContract(1)).toEqual([]);
  });

  it('finds an existing payment by id and returns undefined when it does not exist', async () => {
    const [saved] = await repository.saveMany([pending('2026-01-15')]);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('lists the payments of a contract ordered by due date', async () => {
    await repository.saveMany([pending('2026-02-15'), pending('2026-01-15')]);

    expect((await repository.findByContract(1)).map((payment) => payment.dueDate)).toEqual(['2026-01-15', '2026-02-15']);
  });

  it('lists only the pending payments whose due date has passed', async () => {
    const [first] = await repository.saveMany([pending('2026-01-15'), pending('2026-02-15'), pending('2026-04-15')]);
    await repository.markAsPaid(first.id, '2026-01-16');

    expect((await repository.findOverdue('2026-03-01')).map((payment) => payment.dueDate)).toEqual(['2026-02-15']);
  });

  it('marks a payment as paid and returns undefined when it does not exist', async () => {
    const [saved] = await repository.saveMany([pending('2026-01-15')]);

    expect(await repository.markAsPaid(saved.id, '2026-01-16')).toMatchObject({ status: 'pagado', paidDate: '2026-01-16' });
    expect(await repository.markAsPaid(999, '2026-01-16')).toBeUndefined();
  });
});