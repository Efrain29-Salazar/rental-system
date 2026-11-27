export interface Tenant {
  id: number;
  cedula: string;
  name: string;
  email: string;
  phone: string;
}

// Los datos que se envían al registrar un inquilino.
export type NewTenant = Omit<Tenant, 'id'>;