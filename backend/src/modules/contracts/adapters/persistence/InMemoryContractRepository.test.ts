import { InMemoryContractRepository } from './InMemoryContractRepository';

const sampleContract = {
  propertyId: 1,
  tenantId: 1,
  startDate: '2026-01-15',
  endDate: '2026-07-15',
  monthlyAmount: 450,
  status: 'activo' as const,
};

describe('InMemoryContractRepository', () => {
  it('starts empty', async () => {
    expect(await new InMemoryContractRepository().findAll()).toEqual([]);
  });

  it('saves a contract and assigns an id', async () => {
    expect(await new InMemoryContractRepository().save(sampleContract)).toEqual({ id: 1, ...sampleContract });
  });

  it('finds a contract by id and returns undefined when it does not exist', async () => {
    const repository = new InMemoryContractRepository();
    const saved = await repository.save(sampleContract);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('lists all the contracts or only the ones with a status', async () => {
    const repository = new InMemoryContractRepository();
    const first = await repository.save(sampleContract);
    await repository.save(sampleContract);
    await repository.updateStatus(first.id, 'finalizado');

    expect(await repository.findAll()).toHaveLength(2);
    expect(await repository.findAll('activo')).toHaveLength(1);
    expect((await repository.findAll('finalizado'))[0].id).toBe(first.id);
  });

  it('changes the status of a contract', async () => {
    const repository = new InMemoryContractRepository();
    const saved = await repository.save(sampleContract);

    expect((await repository.updateStatus(saved.id, 'finalizado'))?.status).toBe('finalizado');
    expect(await repository.updateStatus(999, 'finalizado')).toBeUndefined();
  });

  it('returns copies so outside code cannot modify the stored data', async () => {
    const repository = new InMemoryContractRepository([{ id: 1, ...sampleContract }]);

    const list = await repository.findAll();
    list[0].monthlyAmount = 1;

    expect((await repository.findAll())[0].monthlyAmount).toBe(450);
  });
});
