import type { Contract, ContractStatus, NewContract } from '../types/contract';
import { request } from './http';

// GET /contracts (con status=activo, solo los de ese estado)
export const getContracts = (status?: ContractStatus): Promise<Contract[]> =>
  request<Contract[]>(status ? `/contracts?status=${status}` : '/contracts');

// POST /contracts: crea el contrato, genera sus pagos y deja la propiedad arrendada.
export const createContract = (data: NewContract): Promise<Contract> =>
  request<Contract>('/contracts', { method: 'POST', body: JSON.stringify(data) });

// PATCH /contracts/:id/finish: finaliza el contrato y deja la propiedad disponible.
export const finishContract = (id: number): Promise<Contract> =>
  request<Contract>(`/contracts/${id}/finish`, { method: 'PATCH' });
