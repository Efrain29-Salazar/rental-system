import { Pool } from 'pg';

import { Contract, ContractStatus, NewContract } from '../../domain/Contract';
import { ContractRepository } from '../../ports/ContractRepository';

// Cómo llega una fila desde la base (columnas con guion bajo).
type ContractRow = {
  id: number;
  property_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  monthly_amount: string; 
  status: ContractStatus;
};

// pg convierte las columnas DATE en objetos Date y la zona horaria puede mover el día.
// Con to_char las fechas llegan ya como texto AAAA-MM-DD.
const COLUMNS = `id, property_id, tenant_id,
  to_char(start_date, 'YYYY-MM-DD') AS start_date,
  to_char(end_date, 'YYYY-MM-DD') AS end_date,
  monthly_amount, status`;

// Traduce una fila de la base (guion bajo) al objeto del dominio.
const toContract = (row: ContractRow): Contract => ({
  id: row.id,
  propertyId: row.property_id,
  tenantId: row.tenant_id,
  startDate: row.start_date,
  endDate: row.end_date,
  monthlyAmount: Number(row.monthly_amount),
  status: row.status,
});

// Adaptador de salida: cumple el contrato ContractRepository guardando los contratos en PostgreSQL.
export class PostgresContractRepository implements ContractRepository {
  constructor(private readonly pool: Pool) {}

  findAll = async (status?: ContractStatus): Promise<Contract[]> => {
    // Sin estado se piden todos; con estado, solo los de ese estado (parámetro $1).
    const result =
      status === undefined
        ? await this.pool.query<ContractRow>(`SELECT ${COLUMNS} FROM contracts ORDER BY id`)
        : await this.pool.query<ContractRow>(`SELECT ${COLUMNS} FROM contracts WHERE status = $1 ORDER BY id`, [status]);

    return result.rows.map(toContract);
  };

  findById = async (id: number): Promise<Contract | undefined> => {
    const result = await this.pool.query<ContractRow>(`SELECT ${COLUMNS} FROM contracts WHERE id = $1`, [id]);

    return result.rows[0] ? toContract(result.rows[0]) : undefined;
  };

  save = async (newContract: NewContract): Promise<Contract> => {
    const result = await this.pool.query<ContractRow>(
      `INSERT INTO contracts (property_id, tenant_id, start_date, end_date, monthly_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${COLUMNS}`,
      [
        newContract.propertyId,
        newContract.tenantId,
        newContract.startDate,
        newContract.endDate,
        newContract.monthlyAmount,
        newContract.status,
      ],
    );

    return toContract(result.rows[0]);
  };

  updateStatus = async (id: number, status: ContractStatus): Promise<Contract | undefined> => {
    const result = await this.pool.query<ContractRow>(
      `UPDATE contracts SET status = $2 WHERE id = $1 RETURNING ${COLUMNS}`,
      [id, status],
    );

    return result.rows[0] ? toContract(result.rows[0]) : undefined;
  };
}
