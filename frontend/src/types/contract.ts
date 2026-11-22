export type ContractStatus = 'activo' | 'finalizado' | 'cancelado';

// Es el mismo modelo del backend. Las fechas son texto AAAA-MM-DD.
export interface Contract {
  id: number;
  propertyId: number;
  tenantId: number;
  startDate: string;
  endDate: string;
  monthlyAmount: number;
  status: ContractStatus;
}

// Los datos que se envían al crear un contrato (el id y el estado los asigna la API).
export type NewContract = Omit<Contract, 'id' | 'status'>;
