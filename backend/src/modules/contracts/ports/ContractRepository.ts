import { Contract, ContractStatus, NewContract } from '../domain/Contract';

// Contrato que debe cumplir CUALQUIER lugar donde se guarden contratos (memoria, PostgreSQL, etc.).
export interface ContractRepository {
  // Devuelve los contratos. Con un estado, solo los que tienen ese estado.
  findAll: (status?: ContractStatus) => Promise<Contract[]>;

  // Busca un contrato por su id. Devuelve undefined si no existe.
  findById: (id: number) => Promise<Contract | undefined>;

  // Guarda un contrato nuevo y lo devuelve con su id.
  save: (newContract: NewContract) => Promise<Contract>;

  // Cambia el estado de un contrato. Devuelve undefined si no existe.
  updateStatus: (id: number, status: ContractStatus) => Promise<Contract | undefined>;
}
