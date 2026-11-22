import { DomainError } from '../../../shared/DomainError';
import { parseContractStatus, parseNewContract } from './Contract';

// Datos de ejemplo válidos (datos de prueba).
const validInput = { propertyId: 1, tenantId: 2, startDate: '2026-01-15', endDate: '2026-07-15', monthlyAmount: 450 };

describe('parseNewContract', () => {
  it('returns the contract data as an active contract', () => {
    expect(parseNewContract(validInput)).toEqual({ ...validInput, status: 'activo' });
  });

  it('throws when the property is missing or not valid', () => {
    const message = 'La propiedad es obligatoria';

    expect(() => parseNewContract({ ...validInput, propertyId: undefined })).toThrow(new DomainError(message));
    expect(() => parseNewContract({ ...validInput, propertyId: 0 })).toThrow(new DomainError(message));
    expect(() => parseNewContract({ ...validInput, propertyId: '1' })).toThrow(new DomainError(message));
  });

  it('throws when the tenant is missing or not valid', () => {
    expect(() => parseNewContract({ ...validInput, tenantId: -1 })).toThrow(new DomainError('El inquilino es obligatorio'));
  });

  it('throws when the start date is not a real date', () => {
    const message = 'La fecha de inicio no es válida';

    expect(() => parseNewContract({ ...validInput, startDate: '15-01-2026' })).toThrow(new DomainError(message));
    expect(() => parseNewContract({ ...validInput, startDate: '2026-02-30' })).toThrow(new DomainError(message));
  });

  it('throws when the end date is not a real date', () => {
    expect(() => parseNewContract({ ...validInput, endDate: 'mañana' })).toThrow(new DomainError('La fecha de término no es válida'));
  });

  it('throws when the end date is not after the start date', () => {
    const message = 'La fecha de término debe ser posterior a la de inicio';

    expect(() => parseNewContract({ ...validInput, endDate: '2026-01-15' })).toThrow(new DomainError(message));
    expect(() => parseNewContract({ ...validInput, endDate: '2025-12-01' })).toThrow(new DomainError(message));
  });

  it('throws when the monthly amount is not a number greater than 0', () => {
    const message = 'El monto mensual debe ser un número mayor que 0';

    expect(() => parseNewContract({ ...validInput, monthlyAmount: 0 })).toThrow(new DomainError(message));
    expect(() => parseNewContract({ ...validInput, monthlyAmount: '450' })).toThrow(new DomainError(message));
  });
});

describe('parseContractStatus', () => {
  it('returns undefined when there is no filter and the status when it is valid', () => {
    expect(parseContractStatus(undefined)).toBeUndefined();
    expect(parseContractStatus('finalizado')).toBe('finalizado');
  });

  it('throws when the status is not valid', () => {
    expect(() => parseContractStatus('vencido')).toThrow(new DomainError('El estado no es válido'));
  });
});
