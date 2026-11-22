import type { PropertyStatus, PropertyType } from '../types/property';

// El texto que ve el usuario para cada valor (los valores guardados son los de la izquierda).
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  local: 'Local',
  oficina: 'Oficina',
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  disponible: 'Disponible',
  arrendada: 'Arrendada',
  mantencion: 'En mantención',
};

// Los tipos en el orden en que se muestran en el formulario.
export const PROPERTY_TYPES: PropertyType[] = ['casa', 'departamento', 'local', 'oficina'];
