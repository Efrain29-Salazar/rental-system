import { DomainError } from '../../../shared/DomainError';
import { parseNewProperty } from './Property';

// Datos de ejemplo válidos (datos de prueba en español).
const validInput = { address: 'Av. Amazonas 123', type: 'departamento', monthlyPrice: 450, owner: 'Marta Cevallos' };

describe('parseNewProperty', () => {
  it('returns the property trimmed and available', () => {
    const result = parseNewProperty({ ...validInput, address: '  Av. Amazonas 123  ', owner: ' Marta Cevallos ' });

    expect(result).toEqual({ ...validInput, status: 'disponible' });
  });

  it('throws when the address is missing', () => {
    expect(() => parseNewProperty({ ...validInput, address: '  ' })).toThrow(new DomainError('La dirección es obligatoria'));
  });

  it('throws when the type is not valid', () => {
    expect(() => parseNewProperty({ ...validInput, type: 'castillo' })).toThrow(
      new DomainError('El tipo de propiedad no es válido'),
    );
  });

  it('accepts the four types', () => {
    for (const type of ['casa', 'departamento', 'local', 'oficina']) {
      expect(parseNewProperty({ ...validInput, type }).type).toBe(type);
    }
  });

  it('throws when the monthly price is not a number greater than 0', () => {
    const message = 'El precio mensual debe ser un número mayor que 0';

    expect(() => parseNewProperty({ ...validInput, monthlyPrice: 0 })).toThrow(new DomainError(message));
    expect(() => parseNewProperty({ ...validInput, monthlyPrice: -5 })).toThrow(new DomainError(message));
    expect(() => parseNewProperty({ ...validInput, monthlyPrice: '450' })).toThrow(new DomainError(message));
  });

  it('throws when the owner is missing', () => {
    const { owner, ...withoutOwner } = validInput;

    expect(() => parseNewProperty(withoutOwner)).toThrow(new DomainError('El propietario es obligatorio'));
  });
});
