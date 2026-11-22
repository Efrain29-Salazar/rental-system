import 'dotenv/config';

import { Pool } from 'pg';

import { createPostgresPool } from '../../../../shared/database/postgresPool';
import { PostgresTenantRepository } from './PostgresTenantRepository';

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

const sampleTenant = { name: 'Lucía Mendoza', email: 'lucia.mendoza@correo.com', phone: '0991234567' };

describe('PostgresTenantRepository', () => {
  let pool: Pool;
  let repository: PostgresTenantRepository;

  beforeAll(() => {
    pool = createPostgresPool(testDatabaseUrl);
    repository = new PostgresTenantRepository(pool);
  });

  // Antes de CADA prueba: vacía la tabla (y las que dependen de ella) y reinicia los ids en 1.
  beforeEach(async () => {
    await pool.query('TRUNCATE tenants RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('starts empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a tenant and assigns an id', async () => {
    expect(await repository.save(sampleTenant)).toEqual({ id: 1, ...sampleTenant });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    await repository.save(sampleTenant);
    const second = await repository.save({ ...sampleTenant, name: 'Andrés Salazar' });

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds an existing tenant by id', async () => {
    const saved = await repository.save(sampleTenant);

    expect(await repository.findById(saved.id)).toEqual(saved);
  });

  it('returns undefined when the tenant does not exist', async () => {
    expect(await repository.findById(999)).toBeUndefined();
  });
});