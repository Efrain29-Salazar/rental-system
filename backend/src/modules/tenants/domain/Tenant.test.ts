import { DomainError } from '../../../shared/DomainError';
import { parseNewTenant } from './Tenant';

// Datos de ejemplo válidos (datos de prueba en español).
const validInput = { name: 'Lucía Mendoza', email: 'lucia.mendoza@correo.com', phone: '0991234567' };

describe('parseNewTenant', () => {
  it('returns the tenant data trimmed', () => {
    expect(parseNewTenant({ name: '  Lucía Mendoza ', email: ' lucia.mendoza@correo.com ', phone: validInput.phone })).toEqual(validInput);
  });

  it('throws when the name is missing', () => {
    expect(() => parseNewTenant({ ...validInput, name: '' })).toThrow(new DomainError('El nombre es obligatorio'));
  });

  it('throws when the email format is not valid', () => {
    const message = 'El correo no tiene un formato válido';

    expect(() => parseNewTenant({ ...validInput, email: 'correo-sin-arroba' })).toThrow(new DomainError(message));
    expect(() => parseNewTenant({ name: validInput.name, phone: validInput.phone })).toThrow(new DomainError(message));
  });

  it('throws when the phone is missing', () => {
    const { phone, ...withoutPhone } = validInput;

    expect(() => parseNewTenant(withoutPhone)).toThrow(new DomainError('El teléfono es obligatorio'));
  });

  it('accepts phones with spaces, hyphens and a leading +', () => {
    expect(parseNewTenant({ ...validInput, phone: '+593 99-123 4567' }).phone).toBe('+593 99-123 4567');
  });

  it('throws when the phone does not have 7 to 15 digits', () => {
    const message = 'El teléfono no es válido';

    expect(() => parseNewTenant({ ...validInput, phone: '12345' })).toThrow(new DomainError(message));
    expect(() => parseNewTenant({ ...validInput, phone: '099abc4567' })).toThrow(new DomainError(message));
    expect(() => parseNewTenant({ ...validInput, phone: '1234567890123456' })).toThrow(new DomainError(message));
  });
});
