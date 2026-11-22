import { addMonths } from '../../../shared/dates';
import { NewPayment } from '../../payments/domain/Payment';
import { Contract } from './Contract';

// Genera el calendario de pagos de un contrato: un pago pendiente por cada mes,
// desde la fecha de inicio, mientras el vencimiento sea anterior a la fecha de término.
export const buildPaymentSchedule = (
  contract: Pick<Contract, 'id' | 'startDate' | 'endDate' | 'monthlyAmount'>,
): NewPayment[] => {
  const schedule: NewPayment[] = [];

  // Siempre se suma al día de inicio original (no al anterior), para que 31 de enero + 1 mes sea 28 de febrero
  // y el mes siguiente vuelva al 31.
  for (let month = 0; ; month += 1) {
    const dueDate = addMonths(contract.startDate, month);

    if (dueDate >= contract.endDate) {
      return schedule;
    }

    schedule.push({
      contractId: contract.id,
      dueDate,
      amount: contract.monthlyAmount,
      status: 'pendiente',
      paidDate: null,
    });
  }
};
