import { InMemoryPropertyRepository } from './InMemoryPropertyRepository';

// Datos de ejemplo (datos de prueba en español).
const sampleProperty = {
  address: 'Av. Amazonas 123',
  type: 'departamento' as const,
  monthlyPrice: 450,
  owner: 'Marta Cevallos',
  status: 'disponible' as const,
};

describe('InMemoryPropertyRepository', () => {
  it('starts empty', async () => {
    expect(await new InMemoryPropertyRepository().findAll()).toEqual([]);
  });

  it('saves a property and assigns an id', async () => {
    const repository = new InMemoryPropertyRepository();

    expect(await repository.save(sampleProperty)).toEqual({ id: 1, ...sampleProperty });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    const repository = new InMemoryPropertyRepository();

    await repository.save(sampleProperty);
    const second = await repository.save(sampleProperty);

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds a property by id and returns undefined when it does not exist', async () => {
    const repository = new InMemoryPropertyRepository();
    const saved = await repository.save(sampleProperty);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('changes the status of a property', async () => {
    const repository = new InMemoryPropertyRepository();
    const saved = await repository.save(sampleProperty);

    const updated = await repository.updateStatus(saved.id, 'arrendada');

    expect(updated?.status).toBe('arrendada');
    expect((await repository.findById(saved.id))?.status).toBe('arrendada');
    expect(await repository.updateStatus(999, 'arrendada')).toBeUndefined();
  });

  it('returns copies so outside code cannot modify the stored data', async () => {
    const repository = new InMemoryPropertyRepository([{ id: 1, ...sampleProperty }]);

    const list = await repository.findAll();
    list[0].address = 'Dirección alterada';

    expect((await repository.findAll())[0].address).toBe('Av. Amazonas 123');
  });
});
