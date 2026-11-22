import { addMonths, getToday, isValidIsoDate } from './dates';

describe('isValidIsoDate', () => {
  it('accepts real dates in the AAAA-MM-DD format', () => {
    expect(isValidIsoDate('2026-01-15')).toBe(true);
    expect(isValidIsoDate('2028-02-29')).toBe(true);
  });

  it('rejects other formats, impossible dates and non-text values', () => {
    expect(isValidIsoDate('15-01-2026')).toBe(false);
    expect(isValidIsoDate('2026-02-30')).toBe(false);
    expect(isValidIsoDate('2026-13-01')).toBe(false);
    expect(isValidIsoDate('2027-02-29')).toBe(false);
    expect(isValidIsoDate(20260115)).toBe(false);
  });
});

describe('addMonths', () => {
  it('adds months keeping the same day', () => {
    expect(addMonths('2026-01-15', 1)).toBe('2026-02-15');
    expect(addMonths('2026-11-10', 3)).toBe('2027-02-10');
  });

  it('uses the last day of a shorter month', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2028-01-31', 1)).toBe('2028-02-29');
    expect(addMonths('2026-01-31', 2)).toBe('2026-03-31');
  });
});

describe('getToday', () => {
  it('returns a valid date', () => {
    expect(isValidIsoDate(getToday())).toBe(true);
  });
});
