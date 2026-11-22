import express from 'express';
import request from 'supertest';

import { errorHandler } from '../../../../shared/httpErrorHandlers';
import { InMemoryPaymentRepository } from '../persistence/InMemoryPaymentRepository';
import { PaymentService } from '../../application/PaymentService';
import { createPaymentRouter } from './paymentRoutes';

// Los pagos los genera el módulo de contratos, así que aquí se arma una app pequeña con pagos ya guardados
// y una fecha fija (2026-03-01).
const buildApp = async () => {
  const repository = new InMemoryPaymentRepository();
  await repository.saveMany([
    { contractId: 1, dueDate: '2026-01-15', amount: 450, status: 'pendiente', paidDate: null },
    { contractId: 1, dueDate: '2026-04-15', amount: 450, status: 'pendiente', paidDate: null },
  ]);

  const app = express();
  app.use(express.json());
  app.use('/payments', createPaymentRouter(new PaymentService(repository, () => '2026-03-01')));
  app.use(errorHandler);

  return app;
};

describe('GET /payments/overdue', () => {
  it('responds with 200 and only the overdue payments', async () => {
    const response = await request(await buildApp()).get('/payments/overdue');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({ dueDate: '2026-01-15', status: 'pendiente' });
  });
});

describe('PATCH /payments/:id/pay', () => {
  it('registers the payment and responds with 200', async () => {
    const response = await request(await buildApp()).patch('/payments/1/pay');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 1, status: 'pagado', paidDate: '2026-03-01' });
  });

  it('responds with 400 when the payment is already registered', async () => {
    const app = await buildApp();
    await request(app).patch('/payments/1/pay');

    const response = await request(app).patch('/payments/1/pay');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El pago ya está registrado');
  });

  it('responds with 404 when the payment does not exist', async () => {
    const response = await request(await buildApp()).patch('/payments/999/pay');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Pago no encontrado');
  });

  it('responds with 400 when the id is not a number', async () => {
    const response = await request(await buildApp()).patch('/payments/abc/pay');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El identificador no es válido');
  });
});

describe('GET /payments?contractId=', () => {
  it('responds with 200 and the payments of the contract', async () => {
    const response = await request(await buildApp()).get('/payments?contractId=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('responds with 400 when the contract id is missing or not valid', async () => {
    const app = await buildApp();

    expect((await request(app).get('/payments')).status).toBe(400);
    expect((await request(app).get('/payments?contractId=abc')).body.error).toBe('El identificador no es válido');
  });
});