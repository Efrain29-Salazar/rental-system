import { NewPayment } from '../../domain/Payment';
import { InMemoryPaymentRepository } from './InMemoryPaymentRepository';

// Pago pendiente de ejemplo (datos de prueba).
const pending = (contractId: number, dueDate: string): NewPayment => ({
  contractId,
  dueDate,
  amount: 450,
  status: 'pendiente',
  paidDate: null,
});

describe('InMemoryPaymentRepository', () => {
  it('saves many payments and assigns increasing ids', async () => {
    const repository = new InMemoryPaymentRepository();

    const saved = await repository.saveMany([pending(1, '2026-01-15'), pending(1, '2026-02-15')]);

    expect(saved.map((payment) => payment.id)).toEqual([1, 2]);
    expect(saved[0]).toEqual({ id: 1, ...pending(1, '2026-01-15') });
  });

  it('finds a payment by id and returns undefined when it does not exist', async () => {
    const repository = new InMemoryPaymentRepository();
    const [saved] = await repository.saveMany([pending(1, '2026-01-15')]);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('lists the payments of one contract ordered by due date', async () => {
    const repository = new InMemoryPaymentRepository();
    await repository.saveMany([pending(1, '2026-02-15'), pending(2, '2026-01-15'), pending(1, '2026-01-15')]);

    const payments = await repository.findByContract(1);

    expect(payments.map((payment) => payment.dueDate)).toEqual(['2026-01-15', '2026-02-15']);
  });

  it('lists only the pending payments whose due date has passed', async () => {
    const repository = new InMemoryPaymentRepository();
    const [first] = await repository.saveMany([pending(1, '2026-01-15'), pending(1, '2026-02-15'), pending(1, '2026-04-15')]);
    await repository.markAsPaid(first.id, '2026-01-16');

    const overdue = await repository.findOverdue('2026-03-01');

    expect(overdue.map((payment) => payment.dueDate)).toEqual(['2026-02-15']);
  });

  it('marks a payment as paid and returns undefined when it does not exist', async () => {
    const repository = new InMemoryPaymentRepository();
    const [saved] = await repository.saveMany([pending(1, '2026-01-15')]);

    const paid = await repository.markAsPaid(saved.id, '2026-01-16');

    expect(paid).toMatchObject({ status: 'pagado', paidDate: '2026-01-16' });
    expect(await repository.markAsPaid(999, '2026-01-16')).toBeUndefined();
  });

  it('returns copies so outside code cannot modify the stored data', async () => {
    const repository = new InMemoryPaymentRepository();
    const [saved] = await repository.saveMany([pending(1, '2026-01-15')]);

    saved.amount = 1;

    expect((await repository.findById(saved.id))?.amount).toBe(450);
  });
});
