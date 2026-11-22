// Carga el .env para tener TEST_DATABASE_URL (Jest no lo carga solo).
import 'dotenv/config';

import { Pool } from 'pg';

import { createPostgresPool } from '../../../../shared/database/postgresPool';
import { PostgresPropertyRepository } from './PostgresPropertyRepository';

// PROTECCIÓN: estas pruebas BORRAN las tablas. Si la base de pruebas no existe o es la misma
const testDatabaseUrl = process.env.TEST_DATABASE_URL?.trim();
const developmentDatabaseUrl = process.env.DATABASE_URL?.trim();

if (!testDatabaseUrl) {
  throw new Error('Falta TEST_DATABASE_URL en el archivo .env');
}

if (testDatabaseUrl === developmentDatabaseUrl) {
  throw new Error('TEST_DATABASE_URL no puede ser igual a DATABASE_URL: las pruebas borrarían los datos de desarrollo');
}

const sampleProperty = {
  address: 'Av. Amazonas 123',
  type: 'departamento' as const,
  monthlyPrice: 450.5,
  owner: 'Marta Cevallos',
  status: 'disponible' as const,
};

describe('PostgresPropertyRepository', () => {
  let pool: Pool;
  let repository: PostgresPropertyRepository;

  beforeAll(() => {
    pool = createPostgresPool(testDatabaseUrl);
    repository = new PostgresPropertyRepository(pool);
  });

  // Antes de CADA prueba: vacía la tabla (y las que dependen de ella) y reinicia los ids en 1.
  beforeEach(async () => {
    await pool.query('TRUNCATE properties RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('starts empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a property and assigns an id', async () => {
    // monthlyPrice vuelve como NÚMERO
    expect(await repository.save(sampleProperty)).toEqual({ id: 1, ...sampleProperty });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    await repository.save(sampleProperty);
    const second = await repository.save({ ...sampleProperty, address: 'Calle Bolívar 45' });

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds an existing property by id', async () => {
    const saved = await repository.save(sampleProperty);

    expect(await repository.findById(saved.id)).toEqual(saved);
  });

  it('returns undefined when the property does not exist', async () => {
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('changes the status of a property', async () => {
    const saved = await repository.save(sampleProperty);

    expect((await repository.updateStatus(saved.id, 'arrendada'))?.status).toBe('arrendada');
    expect((await repository.findById(saved.id))?.status).toBe('arrendada');
    expect(await repository.updateStatus(999, 'arrendada')).toBeUndefined();
  });
});
