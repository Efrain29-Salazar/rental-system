import request from 'supertest';

import app from '../../../../app';

const validPayload = { name: 'Andrés Salazar', email: 'andres.salazar@correo.com', phone: '+593 98 765 4321' };

describe('POST /tenants', () => {
  it('creates a tenant and responds with 201 and its id', async () => {
    const response = await request(app).post('/tenants').send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(validPayload);
    expect(response.body.id).toBeDefined();
  });

  it('responds with 400 and the message of the broken rule', async () => {
    const response = await request(app).post('/tenants').send({ ...validPayload, email: 'mal' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El correo no tiene un formato válido');
  });
});

describe('GET /tenants', () => {
  it('responds with 200 and an array that includes the created tenant', async () => {
    const created = await request(app).post('/tenants').send(validPayload);

    const response = await request(app).get('/tenants');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toContainEqual(created.body);
  });
});
