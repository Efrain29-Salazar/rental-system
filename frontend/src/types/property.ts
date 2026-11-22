export type PropertyType = 'casa' | 'departamento' | 'local' | 'oficina';
export type PropertyStatus = 'disponible' | 'arrendada' | 'mantencion';

// Es el mismo modelo del backend.
export interface Property {
  id: number;
  address: string;
  type: PropertyType;
  monthlyPrice: number;
  owner: string;
  status: PropertyStatus;
}

// Los datos que se envían al registrar una propiedad (el id y el estado los asigna la API).
export type NewProperty = Omit<Property, 'id' | 'status'>;
