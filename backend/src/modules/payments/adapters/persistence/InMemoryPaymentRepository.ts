import { NewPayment, Payment, isOverdue } from '../../domain/Payment';
import { PaymentRepository } from '../../ports/PaymentRepository';

// Ordena por fecha de vencimiento y, si coinciden, por id.
const byDueDate = (a: Payment, b: Payment): number => a.dueDate.localeCompare(b.dueDate) || a.id - b.id;

// Adaptador de salida: cumple el contrato PaymentRepository guardando los pagos en un arreglo.
export class InMemoryPaymentRepository implements PaymentRepository {
  private payments: Payment[] = [];

  private nextId = 1;

  saveMany = async (newPayments: NewPayment[]): Promise<Payment[]> => {
    const saved = newPayments.map((newPayment): Payment => ({ id: this.nextId++, ...newPayment }));
    this.payments.push(...saved);

    return saved.map((payment) => ({ ...payment }));
  };

  findById = async (id: number): Promise<Payment | undefined> => {
    const payment = this.payments.find((item) => item.id === id);

    return payment ? { ...payment } : undefined;
  };

  findByContract = async (contractId: number): Promise<Payment[]> =>
    this.payments
      .filter((payment) => payment.contractId === contractId)
      .sort(byDueDate)
      .map((payment) => ({ ...payment }));

  findOverdue = async (today: string): Promise<Payment[]> =>
    this.payments
      .filter((payment) => isOverdue(payment, today))
      .sort(byDueDate)
      .map((payment) => ({ ...payment }));

  markAsPaid = async (id: number, paidDate: string): Promise<Payment | undefined> => {
    const payment = this.payments.find((item) => item.id === id);

    if (!payment) {
      return undefined;
    }

    payment.status = 'pagado';
    payment.paidDate = paidDate;

    return { ...payment };
  };
}