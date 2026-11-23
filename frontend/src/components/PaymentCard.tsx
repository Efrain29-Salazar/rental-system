import { formatDate, formatMoney, getDaysOverdue } from '../utils/format';
import type { Payment } from '../types/payment';
import './PaymentCard.css';

// La tarjeta solo muestra un pago y avisa del clic. No guarda estado.
interface PaymentCardProps {
  payment: Payment;
  isPaying: boolean;
  onPay: (id: number) => void;
}

export const PaymentCard = ({ payment, isPaying, onPay }: PaymentCardProps) => {
  const daysOverdue = getDaysOverdue(payment.dueDate);

  return (
    <article className="payment-card">
      <div className="payment-card-header">
        <h3 className="payment-card-title">Contrato #{payment.contractId}</h3>
        <span className="payment-card-amount">{formatMoney(payment.amount)}</span>
      </div>

      <p className="payment-card-due">Vencía el {formatDate(payment.dueDate)}</p>
      <p className="payment-card-overdue">
        Vencido hace {daysOverdue} {daysOverdue === 1 ? 'día' : 'días'}
      </p>

      <button type="button" className="button payment-card-pay" disabled={isPaying} onClick={() => onPay(payment.id)}>
        {isPaying ? 'Registrando...' : 'Registrar pago'}
      </button>
    </article>
  );
};