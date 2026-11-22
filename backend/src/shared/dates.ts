
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// Cantidad de días del mes (month: 1 a 12). Date.UTC con día 0 da el último día del mes anterior.
const daysInMonth = (year: number, month: number): number => new Date(Date.UTC(year, month, 0)).getUTCDate();

// Convierte año, mes y día en texto AAAA-MM-DD.
const formatDate = (year: number, month: number, day: number): string =>
  `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

// ¿Es un texto AAAA-MM-DD que además es una fecha real? (2026-02-30 no lo es)
export const isValidIsoDate = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }

  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return false;
  }

  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];

  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
};

// Suma meses a una fecha. Si el mes de destino es más corto, usa su último día (31 de enero + 1 mes = 28 de febrero).
export const addMonths = (isoDate: string, months: number): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const totalMonths = year * 12 + (month - 1) + months;
  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;

  return formatDate(newYear, newMonth, Math.min(day, daysInMonth(newYear, newMonth)));
};

// La fecha de hoy en la hora LOCAL (no en UTC: en Ecuador, desde las 19:00 UTC ya es el día siguiente).
export const getToday = (): string => new Date().toLocaleDateString('en-CA');
