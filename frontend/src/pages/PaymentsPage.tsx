import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/http';
import { getOverduePayments, payPayment } from '../api/payments';
import { Notice } from '../components/Notice';
import { PageHeader } from '../components/PageHeader';
import { StatsRow } from '../components/StatsRow';
import { PaymentList } from '../components/PaymentList';
import type { Payment } from '../types/payment';
import { formatMoney, getDaysOverdue } from '../utils/format';
import './PaymentsPage.css';

export const PaymentsPage = () => {
  // La página guarda los datos: los pagos morosos, si está cargando, el error y cuál pago se está registrando.
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [payingId, setPayingId] = useState<number | null>(null);

  // Un contador: cada vez que sube, el efecto de abajo vuelve a pedir la lista.
  const [reloadCount, setReloadCount] = useState<number>(0);

  // Cada vez que cambia reloadCount (al abrir la página y después de cada cambio) se vuelve a pedir los pagos morosos.
  // isCurrent evita guardar datos si la página se cerró antes de que la API respondiera.
  useEffect(() => {
    let isCurrent = true;

    getOverduePayments()
      .then((data) => {
        if (isCurrent) {
          setPayments(data);
          setErrorMessage('');
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [reloadCount]);

  // Registra un pago. El pago registrado ya no es moroso: se quita de la pantalla al instante y se pide la lista de nuevo.
  const handlePay = async (id: number) => {
    setPayingId(id);

    try {
      await payPayment(id);
      setPayments((current) => current.filter((payment) => payment.id !== id));
      setReloadCount((count) => count + 1);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setPayingId(null);
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <section className="payments-page">
      <PageHeader
        icon="coins"
        title="Pagos morosos"
        subtitle="Cobros vencidos que están esperando ser registrados"
        meta={`${payments.length} ${payments.length === 1 ? 'pago' : 'pagos'} · Total ${formatMoney(totalAmount)}`}
      />

      <StatsRow
        stats={[
          { icon: 'alert', label: 'Pagos vencidos', value: String(payments.length), tone: 'red' },
          { icon: 'coins', label: 'Total adeudado', value: formatMoney(totalAmount), tone: 'amber' },
          {
            icon: 'clock',
            label: 'Mayor atraso',
            value: `${Math.max(0, ...payments.map((p) => getDaysOverdue(p.dueDate)))} días`,
            tone: 'gray',
          },
        ]}
      />

      {errorMessage && <Notice kind="error" message={errorMessage} />}
      {isLoading && <Notice kind="info" message="Cargando pagos..." />}
      {!isLoading && !errorMessage && payments.length === 0 && (
        <Notice kind="info" message="No hay pagos morosos. Todo está al día." />
      )}
      {payments.length > 0 && <PaymentList payments={payments} payingId={payingId} onPay={handlePay} />}
    </section>
  );
};