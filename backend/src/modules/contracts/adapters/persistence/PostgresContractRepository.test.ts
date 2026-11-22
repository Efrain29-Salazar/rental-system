// Carga el .env para tener TEST_DATABASE_URL (Jest no lo carga solo).
import 'dotenv/config';

import { Pool } from 'pg';

import { createPostgresPool } from '../../../../shared/database/postgresPool';
import { PostgresContractRepository } from './PostgresContractRepository';

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

// Un contrato necesita una propiedad (id 1) y un inquilino (id 1): se insertan antes de cada prueba.
const sampleContract = {
  propertyId: 1,
  tenantId: 1,
  startDate: '2026-01-15',
  endDate: '2026-07-15',
  monthlyAmount: 450.5,
  status: 'activo' as const,
};

describe('PostgresContractRepository', () => {
  let pool: Pool;
  let repository: PostgresContractRepository;

  beforeAll(() => {
    pool = createPostgresPool(testDatabaseUrl);
    repository = new PostgresContractRepository(pool);
  });

  // Antes de CADA prueba: vacía las tablas (CASCADE vacía también contratos y pagos), reinicia los ids
  // y crea la propiedad y el inquilino que el contrato necesita por la clave foránea.
  beforeEach(async () => {
    await pool.query('TRUNCATE properties, tenants RESTART IDENTITY CASCADE');
    await pool.query(
      `INSERT INTO properties (address, type, monthly_price, owner) VALUES ('Av. Amazonas 123', 'departamento', 450, 'Marta Cevallos')`,
    );
    await pool.query(`INSERT INTO tenants (name, email, phone) VALUES ('Lucía Mendoza', 'lucia@correo.com', '0991234567')`);
  });

  afterAll(async () => {
    await pool.end();
  });

  it('starts empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a contract and assigns an id, with the dates as text and the amount as a number', async () => {
    expect(await repository.save(sampleContract)).toEqual({ id: 1, ...sampleContract });
  });

  it('lists what was saved and filters by status', async () => {
    const first = await repository.save(sampleContract);
    await repository.save(sampleContract);
    await repository.updateStatus(first.id, 'finalizado');

    expect(await repository.findAll()).toHaveLength(2);
    expect(await repository.findAll('activo')).toHaveLength(1);
    expect((await repository.findAll('finalizado'))[0].id).toBe(first.id);
  });

  it('finds an existing contract by id', async () => {
    const saved = await repository.save(sampleContract);

    expect(await repository.findById(saved.id)).toEqual(saved);
  });

  it('returns undefined when the contract does not exist', async () => {
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('changes the status of a contract', async () => {
    const saved = await repository.save(sampleContract);

    expect((await repository.updateStatus(saved.id, 'finalizado'))?.status).toBe('finalizado');
    expect(await repository.updateStatus(999, 'finalizado')).toBeUndefined();
  });
});
