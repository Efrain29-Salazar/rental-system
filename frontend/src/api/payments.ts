import type { Payment } from '../types/payment';
import { request } from './http';

// GET /payments/overdue: pagos pendientes cuyo vencimiento ya pasó.
export const getOverduePayments = (): Promise<Payment[]> => request<Payment[]>('/payments/overdue');

// PATCH /payments/:id/pay: registra el pago.
export const payPayment = (id: number): Promise<Payment> =>
  request<Payment>(`/payments/${id}/pay`, { method: 'PATCH' });