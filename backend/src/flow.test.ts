import request from 'supertest';

import app from './app';

// Flujo completo con los cuatro módulos juntos (en memoria): propiedad, inquilino, contrato y pagos.
const createContract = async (startDate: string, endDate: string) => {
  const property = await request(app)
    .post('/properties')
    .send({ address: 'Av. Amazonas 123', type: 'departamento', monthlyPrice: 450, owner: 'Marta Cevallos' });
  const tenant = await request(app)
    .post('/tenants')
    .send({ name: 'Lucía Mendoza', email: 'lucia@correo.com', phone: '0991234567' });

  return request(app)
    .post('/contracts')
    .send({ propertyId: property.body.id, tenantId: tenant.body.id, startDate, endDate, monthlyAmount: 450 });
};

describe('Contracts and payments flow', () => {
  it('generates one pending payment per month when a contract is created', async () => {
    const contract = await createContract('2026-01-15', '2026-04-15');

    const payments = await request(app).get(`/payments?contractId=${contract.body.id}`);

    expect(payments.body.map((payment: { dueDate: string }) => payment.dueDate)).toEqual(['2026-01-15', '2026-02-15', '2026-03-15']);
    expect(payments.body.every((payment: { status: string }) => payment.status === 'pendiente')).toBe(true);
  });

  it('lists the overdue payments of an old contract and registers one of them as paid', async () => {
    const contract = await createContract('2025-01-15', '2025-04-15');
    const ofContract = (payments: { contractId: number }[]) => payments.filter((payment) => payment.contractId === contract.body.id);

    const overdue = await request(app).get('/payments/overdue');
    const paid = await request(app).patch(`/payments/${ofContract(overdue.body)[0].id}/pay`);
    const overdueAfter = await request(app).get('/payments/overdue');

    expect(ofContract(overdue.body)).toHaveLength(3);
    expect(paid.body.status).toBe('pagado');
    expect(ofContract(overdueAfter.body)).toHaveLength(2);
  });

  it('does not list future payments as overdue', async () => {
    const contract = await createContract('2999-01-15', '2999-04-15');

    const overdue = await request(app).get('/payments/overdue');

    expect(overdue.body.filter((payment: { contractId: number }) => payment.contractId === contract.body.id)).toEqual([]);
  });
});
