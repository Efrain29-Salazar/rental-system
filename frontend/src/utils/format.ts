export const formatDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');

  return `${day}/${month}/${year}`;
};

// 450 -> $450,00
const moneyFormatter = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' });

export const formatMoney = (amount: number): string => moneyFormatter.format(amount);

// La fecha de hoy en la hora LOCAL, con el formato AAAA-MM-DD.
export const getToday = (): string => new Date().toLocaleDateString('en-CA');

// Convierte AAAA-MM-DD en un número de día, para poder restar fechas sin problemas de zona horaria.
const toDayNumber = (isoDate: string): number => {
  const [year, month, day] = isoDate.split('-').map(Number);

  return Date.UTC(year, month - 1, day) / 86_400_000;
};

// Cuántos días pasaron desde el vencimiento (0 si todavía no vence).
export const getDaysOverdue = (dueDate: string, today: string = getToday()): number =>
  Math.max(0, toDayNumber(today) - toDayNumber(dueDate));