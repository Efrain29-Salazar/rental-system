import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { InMemoryPaymentRepository } from '../../payments/adapters/persistence/InMemoryPaymentRepository';
import { InMemoryPropertyRepository } from '../../properties/adapters/persistence/InMemoryPropertyRepository';
import { InMemoryTenantRepository } from '../../tenants/adapters/persistence/InMemoryTenantRepository';
import { InMemoryContractRepository } from '../adapters/persistence/InMemoryContractRepository';
import { ContractService } from './ContractService';

// Arma el servicio con repositorios en memoria y deja una propiedad disponible y un inquilino ya guardados.
const setup = async () => {
  const propertyRepository = new InMemoryPropertyRepository();
  const tenantRepository = new InMemoryTenantRepository();
  const paymentRepository = new InMemoryPaymentRepository();
  const contractRepository = new InMemoryContractRepository();

  const property = await propertyRepository.save({
    address: 'Av. Amazonas 123',
    type: 'departamento',
    monthlyPrice: 450,
    owner: 'Marta Cevallos',
    status: 'disponible',
  });
  const tenant = await tenantRepository.save({ name: 'Lucía Mendoza', email: 'lucia@correo.com', phone: '0991234567' });

  const service = new ContractService(contractRepository, propertyRepository, tenantRepository, paymentRepository);
  const input = { propertyId: property.id, tenantId: tenant.id, startDate: '2026-01-15', endDate: '2026-04-15', monthlyAmount: 450 };

  return { service, input, propertyRepository, paymentRepository };
};

describe('ContractService.create', () => {
  it('creates an active contract, generates its monthly payments and leases the property', async () => {
    const { service, input, propertyRepository, paymentRepository } = await setup();

    const contract = await service.create(input);

    expect(contract).toEqual({ id: 1, ...input, status: 'activo' });
    expect(await paymentRepository.findByContract(contract.id)).toHaveLength(3);
    expect((await propertyRepository.findById(input.propertyId))?.status).toBe('arrendada');
  });

  it('rejects invalid data and saves nothing', async () => {
    const { service, input, paymentRepository } = await setup();

    await expect(service.create({ ...input, monthlyAmount: 0 })).rejects.toThrow(DomainError);
    expect(await service.list()).toEqual([]);
    expect(await paymentRepository.findOverdue('2999-01-01')).toEqual([]);
  });

  it('throws NotFoundError when the property does not exist', async () => {
    const { service, input } = await setup();

    await expect(service.create({ ...input, propertyId: 999 })).rejects.toThrow(new NotFoundError('Propiedad no encontrada'));
  });

  it('throws NotFoundError when the tenant does not exist', async () => {
    const { service, input } = await setup();

    await expect(service.create({ ...input, tenantId: 999 })).rejects.toThrow(new NotFoundError('Inquilino no encontrado'));
  });

  it('rejects a property that is not available', async () => {
    const { service, input } = await setup();
    await service.create(input);

    await expect(service.create(input)).rejects.toThrow(new DomainError('La propiedad no está disponible'));
    expect(await service.list()).toHaveLength(1);
  });
});

describe('ContractService.list', () => {
  it('lists all the contracts and accepts a valid status filter', async () => {
    const { service, input } = await setup();
    await service.create(input);

    expect(await service.list()).toHaveLength(1);
    expect(await service.list('activo')).toHaveLength(1);
    expect(await service.list('finalizado')).toEqual([]);
  });

  it('rejects an invalid status filter', async () => {
    const { service } = await setup();

    await expect(service.list('vencido')).rejects.toThrow(new DomainError('El estado no es válido'));
  });
});

describe('ContractService.finish', () => {
  it('finishes an active contract and makes the property available again', async () => {
    const { service, input, propertyRepository } = await setup();
    const contract = await service.create(input);

    const finished = await service.finish(contract.id);

    expect(finished.status).toBe('finalizado');
    expect((await propertyRepository.findById(input.propertyId))?.status).toBe('disponible');
  });

  it('throws NotFoundError when the contract does not exist', async () => {
    const { service } = await setup();

    await expect(service.finish(999)).rejects.toThrow(new NotFoundError('Contrato no encontrado'));
  });

  it('rejects a contract that is not active', async () => {
    const { service, input } = await setup();
    const contract = await service.create(input);
    await service.finish(contract.id);

    await expect(service.finish(contract.id)).rejects.toThrow(new DomainError('Solo se puede finalizar un contrato activo'));
  });

  it('allows leasing the property again after finishing the contract', async () => {
    const { service, input } = await setup();
    const contract = await service.create(input);
    await service.finish(contract.id);

    expect((await service.create(input)).id).toBe(2);
  });
});
