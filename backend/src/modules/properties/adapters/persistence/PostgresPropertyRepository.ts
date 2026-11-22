import { Pool } from 'pg';

import { NewProperty, Property, PropertyStatus, PropertyType } from '../../domain/Property';
import { PropertyRepository } from '../../ports/PropertyRepository';

// Cómo llega una fila desde la base
type PropertyRow = {
  id: number;
  address: string;
  type: PropertyType;
  monthly_price: string;
  owner: string;
  status: PropertyStatus;
};

const COLUMNS = 'id, address, type, monthly_price, owner, status';

// Traduce una fila de la base (monthly_price) al objeto del dominio
const toProperty = (row: PropertyRow): Property => ({
  id: row.id,
  address: row.address,
  type: row.type,
  monthlyPrice: Number(row.monthly_price),
  owner: row.owner,
  status: row.status,
});

// Adaptador de salida: cumple el contrato PropertyRepository guardando las propiedades en PostgreSQL.
export class PostgresPropertyRepository implements PropertyRepository {
  constructor(private readonly pool: Pool) {}

  findAll = async (): Promise<Property[]> => {
    const result = await this.pool.query<PropertyRow>(`SELECT ${COLUMNS} FROM properties ORDER BY id`);

    return result.rows.map(toProperty);
  };

  findById = async (id: number): Promise<Property | undefined> => {
    const result = await this.pool.query<PropertyRow>(`SELECT ${COLUMNS} FROM properties WHERE id = $1`, [id]);

    return result.rows[0] ? toProperty(result.rows[0]) : undefined;
  };

  // Consulta con parámetros ($1, $2...): nunca se arma el texto SQL con los datos.
  save = async (newProperty: NewProperty): Promise<Property> => {
    const result = await this.pool.query<PropertyRow>(
      `INSERT INTO properties (address, type, monthly_price, owner, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUMNS}`,
      [newProperty.address, newProperty.type, newProperty.monthlyPrice, newProperty.owner, newProperty.status],
    );

    return toProperty(result.rows[0]);
  };

  updateStatus = async (id: number, status: PropertyStatus): Promise<Property | undefined> => {
    const result = await this.pool.query<PropertyRow>(
      `UPDATE properties SET status = $2 WHERE id = $1 RETURNING ${COLUMNS}`,
      [id, status],
    );

    return result.rows[0] ? toProperty(result.rows[0]) : undefined;
  };
}
