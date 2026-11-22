import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { InMemoryPaymentRepository } from '../adapters/persistence/InMemoryPaymentRepository';
import { PaymentService } from './PaymentService';

// Con un reloj de fecha fija las pruebas siempre dan lo mismo.
const TODAY = '2026-03-01';

const createService = async () => {
  const repository = new InMemoryPaymentRepository();
  const saved = await repository.saveMany([
    { contractId: 1, dueDate: '2026-01-15', amount: 450, status: 'pendiente', paidDate: null },
    { contractId: 1, dueDate: '2026-02-15', amount: 450, status: 'pendiente', paidDate: null },
    { contractId: 1, dueDate: '2026-04-15', amount: 450, status: 'pendiente', paidDate: null },
  ]);

  return { service: new PaymentService(repository, () => TODAY), saved };
};

describe('PaymentService', () => {
  it('marks a pending payment as paid with the date of today', async () => {
    const { service, saved } = await createService();

    const paid = await service.markAsPaid(saved[0].id);

    expect(paid).toMatchObject({ id: saved[0].id, status: 'pagado', paidDate: TODAY });
  });

  it('throws NotFoundError when the payment does not exist', async () => {
    const { service } = await createService();

    await expect(service.markAsPaid(999)).rejects.toThrow(new NotFoundError('Pago no encontrado'));
  });

  it('rejects a payment that is already paid', async () => {
    const { service, saved } = await createService();
    await service.markAsPaid(saved[0].id);

    await expect(service.markAsPaid(saved[0].id)).rejects.toThrow(new DomainError('El pago ya está registrado'));
  });

  it('lists the overdue payments ordered by due date', async () => {
    const { service } = await createService();

    const overdue = await service.listOverdue();

    expect(overdue.map((payment) => payment.dueDate)).toEqual(['2026-01-15', '2026-02-15']);
  });

  it('stops listing a payment as overdue once it is paid', async () => {
    const { service, saved } = await createService();
    await service.markAsPaid(saved[0].id);

    expect((await service.listOverdue()).map((payment) => payment.id)).toEqual([saved[1].id]);
  });

  it('lists the payments of a contract', async () => {
    const { service } = await createService();

    expect(await service.listByContract(1)).toHaveLength(3);
    expect(await service.listByContract(2)).toEqual([]);
  });
});