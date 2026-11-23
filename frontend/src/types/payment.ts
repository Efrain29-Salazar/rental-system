export type PaymentStatus = 'pendiente' | 'pagado';

// Es el mismo modelo del backend. Las fechas son texto AAAA-MM-DD; paidDate es null hasta que se paga.
export interface Payment {
  id: number;
  contractId: number;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  paidDate: string | null;
}