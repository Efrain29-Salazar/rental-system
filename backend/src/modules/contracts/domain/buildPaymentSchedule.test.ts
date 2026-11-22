import { buildPaymentSchedule } from './buildPaymentSchedule';

const dueDates = (startDate: string, endDate: string): string[] =>
  buildPaymentSchedule({ id: 1, startDate, endDate, monthlyAmount: 450 }).map((payment) => payment.dueDate);

describe('buildPaymentSchedule', () => {
  it('creates one pending payment per month before the end date', () => {
    expect(dueDates('2026-01-15', '2026-04-15')).toEqual(['2026-01-15', '2026-02-15', '2026-03-15']);
  });

  it('fills every payment with the contract data', () => {
    const [first] = buildPaymentSchedule({ id: 7, startDate: '2026-01-15', endDate: '2026-02-20', monthlyAmount: 500 });

    expect(first).toEqual({ contractId: 7, dueDate: '2026-01-15', amount: 500, status: 'pendiente', paidDate: null });
  });

  it('uses the last day of shorter months and goes back to the original day', () => {
    expect(dueDates('2026-01-31', '2026-05-01')).toEqual(['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30']);
  });

  it('works across years', () => {
    expect(dueDates('2026-11-10', '2027-02-10')).toEqual(['2026-11-10', '2026-12-10', '2027-01-10']);
  });

  it('creates a single payment when the contract is shorter than a month', () => {
    expect(dueDates('2026-01-15', '2026-01-25')).toEqual(['2026-01-15']);
  });
});
