import { NewTenant, Tenant } from '../../domain/Tenant';
import { TenantRepository } from '../../ports/TenantRepository';

// Adaptador de salida: cumple el contrato TenantRepository guardando los inquilinos en un arreglo.
export class InMemoryTenantRepository implements TenantRepository {
  private tenants: Tenant[];

  private nextId: number;

  constructor(initialTenants: Tenant[] = []) {
    this.tenants = initialTenants.map((tenant) => ({ ...tenant }));
    this.nextId = Math.max(0, ...initialTenants.map((tenant) => tenant.id)) + 1;
  }

  // Devuelve COPIAS, para que nadie de afuera pueda modificar los datos guardados.
  findAll = async (): Promise<Tenant[]> => this.tenants.map((tenant) => ({ ...tenant }));

  findById = async (id: number): Promise<Tenant | undefined> => {
    const tenant = this.tenants.find((item) => item.id === id);

    return tenant ? { ...tenant } : undefined;
  };

  save = async (newTenant: NewTenant): Promise<Tenant> => {
    const tenant: Tenant = { id: this.nextId++, ...newTenant };
    this.tenants.push(tenant);

    return { ...tenant };
  };
}