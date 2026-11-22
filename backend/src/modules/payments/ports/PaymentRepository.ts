import { NewPayment, Payment } from '../domain/Payment';

// Contrato que debe cumplir CUALQUIER lugar donde se guarden pagos (memoria, PostgreSQL, etc.).
export interface PaymentRepository {
  // Guarda varios pagos de una vez (el módulo de contratos genera uno por mes) y los devuelve con su id.
  saveMany: (newPayments: NewPayment[]) => Promise<Payment[]>;

  // Busca un pago por su id. Devuelve undefined si no existe.
  findById: (id: number) => Promise<Payment | undefined>;

  // Pagos de un contrato, ordenados por fecha de vencimiento.
  findByContract: (contractId: number) => Promise<Payment[]>;

  // Pagos pendientes con vencimiento anterior a la fecha dada (AAAA-MM-DD), ordenados por vencimiento.
  findOverdue: (today: string) => Promise<Payment[]>;

  // Marca un pago como pagado en la fecha dada. Devuelve undefined si no existe.
  markAsPaid: (id: number, paidDate: string) => Promise<Payment | undefined>;
}
