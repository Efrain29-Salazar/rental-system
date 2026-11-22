import { DomainError } from '../../../shared/DomainError';

// Valores permitidos (as const: se tratan como valores exactos y no como texto cualquiera).
export const PROPERTY_TYPES = ['casa', 'departamento', 'local', 'oficina'] as const;
export const PROPERTY_STATUSES = ['disponible', 'arrendada', 'mantencion'] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

// Cómo es una propiedad.
export interface Property {
  id: number;
  address: string;
  type: PropertyType;
  monthlyPrice: number;
  owner: string;
  status: PropertyStatus;
}

// Datos de una propiedad nueva (todo menos el id, que lo asigna el repositorio).
export type NewProperty = Omit<Property, 'id'>;

const isFilledText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

// Valida los datos de entrada y devuelve una propiedad limpia. Toda propiedad nueva nace disponible.
export const parseNewProperty = (input: unknown): NewProperty => {
  const { address, type, monthlyPrice, owner } = (input ?? {}) as Record<string, unknown>;

  if (!isFilledText(address)) {
    throw new DomainError('La dirección es obligatoria');
  }

  if (typeof type !== 'string' || !(PROPERTY_TYPES as readonly string[]).includes(type)) {
    throw new DomainError('El tipo de propiedad no es válido');
  }

  if (typeof monthlyPrice !== 'number' || !Number.isFinite(monthlyPrice) || monthlyPrice <= 0) {
    throw new DomainError('El precio mensual debe ser un número mayor que 0');
  }

  if (!isFilledText(owner)) {
    throw new DomainError('El propietario es obligatorio');
  }

  return {
    address: address.trim(),
    type: type as PropertyType,
    monthlyPrice,
    owner: owner.trim(),
    status: 'disponible',
  };
};
