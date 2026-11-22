import request from 'supertest';

import app from '../../../../app';

const validPayload = { address: 'Calle Bolívar 45', type: 'casa', monthlyPrice: 600, owner: 'Pedro Jaramillo' };

describe('POST /properties', () => {
  it('creates a property and responds with 201, its id and the status disponible', async () => {
    const response = await request(app).post('/properties').send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ ...validPayload, status: 'disponible' });
    expect(response.body.id).toBeDefined();
  });

  it('responds with 400 and the message of the broken rule', async () => {
    const response = await request(app).post('/properties').send({ ...validPayload, type: 'castillo' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El tipo de propiedad no es válido');
  });
});

describe('GET /properties', () => {
  it('responds with 200 and an array', async () => {
    const response = await request(app).get('/properties');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('GET /properties/:id', () => {
  it('responds with 200 and the property', async () => {
    const created = await request(app).post('/properties').send(validPayload);

    const response = await request(app).get(`/properties/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(created.body);
  });

  it('responds with 404 when the property does not exist', async () => {
    const response = await request(app).get('/properties/9999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Propiedad no encontrada');
  });

  it('responds with 400 when the id is not a number', async () => {
    const response = await request(app).get('/properties/abc');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El identificador no es válido');
  });
});
