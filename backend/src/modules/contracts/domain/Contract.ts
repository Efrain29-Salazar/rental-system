import { DomainError } from '../../../shared/DomainError';
import { isValidIsoDate } from '../../../shared/dates';

// Estados de un contrato. "cancelado" existe en el modelo
export const CONTRACT_STATUSES = ['activo', 'finalizado', 'cancelado'] as const;

export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

// Cómo es un contrato. Las fechas son texto AAAA-MM-DD.
export interface Contract {
  id: number;
  propertyId: number;
  tenantId: number;
  startDate: string;
  endDate: string;
  monthlyAmount: number;
  status: ContractStatus;
}

// Datos de un contrato nuevo (todo menos el id, que lo asigna el repositorio).
export type NewContract = Omit<Contract, 'id'>;

const isPositiveInteger = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0;

// Valida los datos de entrada y devuelve un contrato limpio. Todo contrato nuevo nace activo.
export const parseNewContract = (input: unknown): NewContract => {
  const { propertyId, tenantId, startDate, endDate, monthlyAmount } = (input ?? {}) as Record<string, unknown>;

  if (!isPositiveInteger(propertyId)) {
    throw new DomainError('La propiedad es obligatoria');
  }

  if (!isPositiveInteger(tenantId)) {
    throw new DomainError('El inquilino es obligatorio');
  }

  if (!isValidIsoDate(startDate)) {
    throw new DomainError('La fecha de inicio no es válida');
  }

  if (!isValidIsoDate(endDate)) {
    throw new DomainError('La fecha de término no es válida');
  }

  // Las fechas AAAA-MM-DD se pueden comparar como texto.
  if (endDate <= startDate) {
    throw new DomainError('La fecha de término debe ser posterior a la de inicio');
  }

  if (typeof monthlyAmount !== 'number' || !Number.isFinite(monthlyAmount) || monthlyAmount <= 0) {
    throw new DomainError('El monto mensual debe ser un número mayor que 0');
  }

  return { propertyId, tenantId, startDate, endDate, monthlyAmount, status: 'activo' };
};

// Valida el filtro opcional ?status= de la lista. Sin valor, no se filtra (undefined).
export const parseContractStatus = (value: unknown): ContractStatus | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string' || !(CONTRACT_STATUSES as readonly string[]).includes(value)) {
    throw new DomainError('El estado no es válido');
  }

  return value as ContractStatus;
};
