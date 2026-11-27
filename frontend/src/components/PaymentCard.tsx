import { formatDate, formatMoney, getDaysOverdue } from '../utils/format';
import type { Payment } from '../types/payment';
import { Icon } from './Icon';
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
    <article className="card payment-card">
      <div className="payment-card-header">
        <span className="icon-tile payment-card-icon">
          <Icon name="coins" size={22} />
        </span>
        <h3 className="payment-card-title">Contrato #{payment.contractId}</h3>
      </div>

      <p className="payment-card-amount">{formatMoney(payment.amount)}</p>

      <p className="payment-card-due">
        <Icon name="calendar" size={17} />
        Vencía el {formatDate(payment.dueDate)}
      </p>
      <p className="chip payment-card-overdue">
        <Icon name="alert" size={14} />
        Vencido hace {daysOverdue} {daysOverdue === 1 ? 'día' : 'días'}
      </p>

      <button type="button" className="button payment-card-pay" disabled={isPaying} onClick={() => onPay(payment.id)}>
        <Icon name={isPaying ? 'loader' : 'check'} size={18} className={isPaying ? 'spin' : undefined} />
        {isPaying ? 'Registrando...' : 'Registrar pago'}
      </button>
    </article>
  );
};
