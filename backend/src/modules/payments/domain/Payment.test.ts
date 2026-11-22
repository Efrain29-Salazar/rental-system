import { isOverdue } from './Payment';

describe('isOverdue', () => {
  it('is overdue when the payment is pending and the due date has passed', () => {
    expect(isOverdue({ status: 'pendiente', dueDate: '2026-02-15' }, '2026-03-01')).toBe(true);
  });

  it('is not overdue when the due date has not passed yet', () => {
    expect(isOverdue({ status: 'pendiente', dueDate: '2026-04-15' }, '2026-03-01')).toBe(false);
  });

  it('is not overdue when the payment is already paid', () => {
    expect(isOverdue({ status: 'pagado', dueDate: '2026-02-15' }, '2026-03-01')).toBe(false);
  });

  it('is not overdue when the due date is today', () => {
    expect(isOverdue({ status: 'pendiente', dueDate: '2026-03-01' }, '2026-03-01')).toBe(false);
  });
});
