import { Pool } from 'pg';

import { NewTenant, Tenant } from '../../domain/Tenant';
import { TenantRepository } from '../../ports/TenantRepository';

// Aquí los nombres de la tabla y del dominio coinciden: la fila ya tiene la forma de un Tenant.
const COLUMNS = 'id, name, email, phone';

// Adaptador de salida: cumple el contrato TenantRepository guardando los inquilinos en PostgreSQL.
export class PostgresTenantRepository implements TenantRepository {
  constructor(private readonly pool: Pool) {}

  findAll = async (): Promise<Tenant[]> => {
    const result = await this.pool.query<Tenant>(`SELECT ${COLUMNS} FROM tenants ORDER BY id`);

    return result.rows;
  };

  findById = async (id: number): Promise<Tenant | undefined> => {
    const result = await this.pool.query<Tenant>(`SELECT ${COLUMNS} FROM tenants WHERE id = $1`, [id]);

    return result.rows[0];
  };

  // Consulta con parámetros ($1, $2...): nunca se arma el texto SQL con los datos.
  save = async (newTenant: NewTenant): Promise<Tenant> => {
    const result = await this.pool.query<Tenant>(
      `INSERT INTO tenants (name, email, phone) VALUES ($1, $2, $3) RETURNING ${COLUMNS}`,
      [newTenant.name, newTenant.email, newTenant.phone],
    );

    return result.rows[0];
  };
}