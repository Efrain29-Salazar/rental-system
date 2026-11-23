import type { Payment } from '../types/payment';
import { PaymentCard } from './PaymentCard';
import './PaymentList.css';

interface PaymentListProps {
  payments: Payment[];
  payingId: number | null;
  onPay: (id: number) => void;
}

export const PaymentList = ({ payments, payingId, onPay }: PaymentListProps) => {
  return (
    <div className="payment-list">
      {/* La key es el id del pago, nunca la posición. */}
      {payments.map((payment) => (
        <PaymentCard key={payment.id} payment={payment} isPaying={payingId === payment.id} onPay={onPay} />
      ))}
    </div>
  );
};