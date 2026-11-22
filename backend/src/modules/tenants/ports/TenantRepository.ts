import { NewTenant, Tenant } from '../domain/Tenant';

// Contrato que debe cumplir CUALQUIER lugar donde se guarden inquilinos (memoria, PostgreSQL, etc.).
export interface TenantRepository {
  // Devuelve todos los inquilinos.
  findAll: () => Promise<Tenant[]>;

  // Busca un inquilino por su id (lo usa también el módulo de contratos). Devuelve undefined si no existe.
  findById: (id: number) => Promise<Tenant | undefined>;

  // Guarda un inquilino nuevo y lo devuelve con su id.
  save: (newTenant: NewTenant) => Promise<Tenant>;
}
