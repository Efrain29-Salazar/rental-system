import { InMemoryTenantRepository } from './InMemoryTenantRepository';

const sampleTenant = { name: 'Lucía Mendoza', email: 'lucia.mendoza@correo.com', phone: '0991234567' };

describe('InMemoryTenantRepository', () => {
  it('starts empty', async () => {
    expect(await new InMemoryTenantRepository().findAll()).toEqual([]);
  });

  it('saves a tenant and assigns an id', async () => {
    expect(await new InMemoryTenantRepository().save(sampleTenant)).toEqual({ id: 1, ...sampleTenant });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    const repository = new InMemoryTenantRepository();

    await repository.save(sampleTenant);
    const second = await repository.save(sampleTenant);

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds a tenant by id and returns undefined when it does not exist', async () => {
    const repository = new InMemoryTenantRepository();
    const saved = await repository.save(sampleTenant);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('returns copies so outside code cannot modify the stored data', async () => {
    const repository = new InMemoryTenantRepository([{ id: 1, ...sampleTenant }]);

    const list = await repository.findAll();
    list[0].name = 'Nombre alterado';

    expect((await repository.findAll())[0].name).toBe('Lucía Mendoza');
  });
});
