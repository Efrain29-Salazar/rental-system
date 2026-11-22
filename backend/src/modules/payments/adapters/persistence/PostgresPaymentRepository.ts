import { Pool } from 'pg';

import { NewPayment, Payment, PaymentStatus } from '../../domain/Payment';
import { PaymentRepository } from '../../ports/PaymentRepository';

// Cómo llega una fila desde la base (columnas con guion bajo).
type PaymentRow = {
  id: number;
  contract_id: number;
  due_date: string;
  amount: string; // NUMERIC llega como texto
  status: PaymentStatus;
  paid_date: string | null;
};

// pg convierte las columnas DATE en objetos Date y la zona horaria puede mover el día.
// Con to_char las fechas llegan ya como texto AAAA-MM-DD (o null si todavía no se pagó).
const COLUMNS = `id, contract_id,
  to_char(due_date, 'YYYY-MM-DD') AS due_date,
  amount, status,
  to_char(paid_date, 'YYYY-MM-DD') AS paid_date`;

// Traduce una fila de la base (guion bajo) al objeto del dominio.
const toPayment = (row: PaymentRow): Payment => ({
  id: row.id,
  contractId: row.contract_id,
  dueDate: row.due_date,
  amount: Number(row.amount),
  status: row.status,
  paidDate: row.paid_date,
});

// Adaptador de salida: cumple el contrato PaymentRepository guardando los pagos en PostgreSQL.
export class PostgresPaymentRepository implements PaymentRepository {
  constructor(private readonly pool: Pool) {}

  // Guarda todos los pagos dentro de una transacción: o se guardan todos o no se guarda ninguno.
  saveMany = async (newPayments: NewPayment[]): Promise<Payment[]> => {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const saved: Payment[] = [];

      for (const newPayment of newPayments) {
        const result = await client.query<PaymentRow>(
          `INSERT INTO payments (contract_id, due_date, amount, status, paid_date)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING ${COLUMNS}`,
          [newPayment.contractId, newPayment.dueDate, newPayment.amount, newPayment.status, newPayment.paidDate],
        );
        saved.push(toPayment(result.rows[0]));
      }

      await client.query('COMMIT');

      return saved;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

  findById = async (id: number): Promise<Payment | undefined> => {
    const result = await this.pool.query<PaymentRow>(`SELECT ${COLUMNS} FROM payments WHERE id = $1`, [id]);

    return result.rows[0] ? toPayment(result.rows[0]) : undefined;
  };

  findByContract = async (contractId: number): Promise<Payment[]> => {
    const result = await this.pool.query<PaymentRow>(
      `SELECT ${COLUMNS} FROM payments WHERE contract_id = $1 ORDER BY due_date, id`,
      [contractId],
    );

    return result.rows.map(toPayment);
  };

  // Pendientes con vencimiento anterior a la fecha dada (la fecha de hoy la entrega el servicio).
  findOverdue = async (today: string): Promise<Payment[]> => {
    const result = await this.pool.query<PaymentRow>(
      `SELECT ${COLUMNS} FROM payments WHERE status = 'pendiente' AND due_date < $1::date ORDER BY due_date, id`,
      [today],
    );

    return result.rows.map(toPayment);
  };

  markAsPaid = async (id: number, paidDate: string): Promise<Payment | undefined> => {
    const result = await this.pool.query<PaymentRow>(
      `UPDATE payments SET status = 'pagado', paid_date = $2 WHERE id = $1 RETURNING ${COLUMNS}`,
      [id, paidDate],
    );

    return result.rows[0] ? toPayment(result.rows[0]) : undefined;
  };
}
