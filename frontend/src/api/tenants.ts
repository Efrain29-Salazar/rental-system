import type { NewTenant, Tenant } from '../types/tenant';
import { request } from './http';

// GET /tenants
export const getTenants = (): Promise<Tenant[]> => request<Tenant[]>('/tenants');

// POST /tenants
export const createTenant = (data: NewTenant): Promise<Tenant> =>
  request<Tenant>('/tenants', { method: 'POST', body: JSON.stringify(data) });