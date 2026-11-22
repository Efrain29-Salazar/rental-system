import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { InMemoryTenantRepository } from '../adapters/persistence/InMemoryTenantRepository';
import { TenantService } from './TenantService';

const validInput = { name: 'Lucía Mendoza', email: 'lucia.mendoza@correo.com', phone: '0991234567' };

const createService = (): TenantService => new TenantService(new InMemoryTenantRepository());

describe('TenantService', () => {
  it('creates a valid tenant and returns it with an id', async () => {
    expect(await createService().create(validInput)).toEqual({ id: 1, ...validInput });
  });

  it('rejects an invalid tenant and does not save it', async () => {
    const service = createService();

    await expect(service.create({ name: 'Solo nombre' })).rejects.toThrow(DomainError);
    expect(await service.list()).toEqual([]);
  });

  it('lists the tenants that were created', async () => {
    const service = createService();

    await service.create(validInput);

    expect(await service.list()).toHaveLength(1);
  });

  it('gets a tenant by id', async () => {
    const service = createService();
    const created = await service.create(validInput);

    expect(await service.getById(created.id)).toEqual(created);
  });

  it('throws NotFoundError when the tenant does not exist', async () => {
    await expect(createService().getById(999)).rejects.toThrow(new NotFoundError('Inquilino no encontrado'));
  });
});