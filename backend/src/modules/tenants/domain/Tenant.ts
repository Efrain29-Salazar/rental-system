import { DomainError } from '../../../shared/DomainError';

// Cómo es un inquilino.
export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Datos de un inquilino nuevo (todo menos el id, que lo asigna el repositorio).
export type NewTenant = Omit<Tenant, 'id'>;

// Formato básico de correo: algo@dominio.ext (sin espacios).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// De 7 a 15 dígitos (antes se quitan espacios, guiones y un + inicial).
const PHONE_DIGITS_PATTERN = /^\d{7,15}$/;

const isFilledText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

// Valida los datos de entrada y devuelve un inquilino limpio.
export const parseNewTenant = (input: unknown): NewTenant => {
  const { name, email, phone } = (input ?? {}) as Record<string, unknown>;

  if (!isFilledText(name)) {
    throw new DomainError('El nombre es obligatorio');
  }

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    throw new DomainError('El correo no tiene un formato válido');
  }

  if (!isFilledText(phone)) {
    throw new DomainError('El teléfono es obligatorio');
  }

  if (!PHONE_DIGITS_PATTERN.test(phone.trim().replace(/^\+/, '').replace(/[\s-]/g, ''))) {
    throw new DomainError('El teléfono no es válido');
  }

  return { name: name.trim(), email: email.trim(), phone: phone.trim() };
};