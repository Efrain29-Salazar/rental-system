// Estados de un pago.
export const PAYMENT_STATUSES = ['pendiente', 'pagado'] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// Cómo es un pago. Las fechas son texto AAAA-MM-DD. paidDate es null hasta que se paga.
export interface Payment {
  id: number;
  contractId: number;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  paidDate: string | null;
}

// Datos de un pago nuevo (todo menos el id). Los pagos los genera el módulo de contratos.
export type NewPayment = Omit<Payment, 'id'>;

// Un pago es moroso si sigue pendiente y su vencimiento ya pasó (el día de hoy todavía no cuenta como mora).
export const isOverdue = (payment: Pick<Payment, 'status' | 'dueDate'>, today: string): boolean =>
  payment.status === 'pendiente' && payment.dueDate < today;