import { Contract, ContractStatus, NewContract } from '../../domain/Contract';
import { ContractRepository } from '../../ports/ContractRepository';

// Adaptador de salida: cumple el contrato ContractRepository guardando los contratos en un arreglo.
export class InMemoryContractRepository implements ContractRepository {
  private contracts: Contract[];

  private nextId: number;

  constructor(initialContracts: Contract[] = []) {
    this.contracts = initialContracts.map((contract) => ({ ...contract }));
    this.nextId = Math.max(0, ...initialContracts.map((contract) => contract.id)) + 1;
  }

  // Devuelve COPIAS, para que nadie de afuera pueda modificar los datos guardados.
  findAll = async (status?: ContractStatus): Promise<Contract[]> =>
    this.contracts.filter((contract) => status === undefined || contract.status === status).map((contract) => ({ ...contract }));

  findById = async (id: number): Promise<Contract | undefined> => {
    const contract = this.contracts.find((item) => item.id === id);

    return contract ? { ...contract } : undefined;
  };

  save = async (newContract: NewContract): Promise<Contract> => {
    const contract: Contract = { id: this.nextId++, ...newContract };
    this.contracts.push(contract);

    return { ...contract };
  };

  updateStatus = async (id: number, status: ContractStatus): Promise<Contract | undefined> => {
    const contract = this.contracts.find((item) => item.id === id);

    if (!contract) {
      return undefined;
    }

    contract.status = status;

    return { ...contract };
  };
}
