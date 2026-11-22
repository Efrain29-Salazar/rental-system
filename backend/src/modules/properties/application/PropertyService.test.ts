import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { InMemoryPropertyRepository } from '../adapters/persistence/InMemoryPropertyRepository';
import { PropertyService } from './PropertyService';

const validInput = { address: 'Av. Amazonas 123', type: 'departamento', monthlyPrice: 450, owner: 'Marta Cevallos' };

const createService = (): PropertyService => new PropertyService(new InMemoryPropertyRepository());

describe('PropertyService', () => {
  it('creates a valid property, available and with an id', async () => {
    const created = await createService().create(validInput);

    expect(created).toEqual({ id: 1, ...validInput, status: 'disponible' });
  });

  it('rejects an invalid property and does not save it', async () => {
    const service = createService();

    await expect(service.create({ address: 'Solo dirección' })).rejects.toThrow(DomainError);
    expect(await service.list()).toEqual([]);
  });

  it('lists the properties that were created', async () => {
    const service = createService();

    await service.create(validInput);

    expect(await service.list()).toHaveLength(1);
  });

  it('gets a property by id', async () => {
    const service = createService();
    const created = await service.create(validInput);

    expect(await service.getById(created.id)).toEqual(created);
  });

  it('throws NotFoundError when the property does not exist', async () => {
    await expect(createService().getById(999)).rejects.toThrow(new NotFoundError('Propiedad no encontrada'));
  });
});
