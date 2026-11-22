import request from 'supertest';

import app from '../../../../app';

// Crea una propiedad y un inquilino por HTTP y devuelve los datos de un contrato listo para enviar.
const createContractPayload = async (startDate = '2026-01-15', endDate = '2026-04-15') => {
  const property = await request(app)
    .post('/properties')
    .send({ address: 'Av. Amazonas 123', type: 'departamento', monthlyPrice: 450, owner: 'Marta Cevallos' });
  const tenant = await request(app)
    .post('/tenants')
    .send({ name: 'Lucía Mendoza', email: 'lucia@correo.com', phone: '0991234567' });

  return { propertyId: property.body.id, tenantId: tenant.body.id, startDate, endDate, monthlyAmount: 450 };
};

describe('POST /contracts', () => {
  it('creates an active contract and responds with 201', async () => {
    const payload = await createContractPayload();

    const response = await request(app).post('/contracts').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ ...payload, status: 'activo' });
    expect(response.body.id).toBeDefined();
  });

  it('leases the property', async () => {
    const payload = await createContractPayload();

    await request(app).post('/contracts').send(payload);
    const property = await request(app).get(`/properties/${payload.propertyId}`);

    expect(property.body.status).toBe('arrendada');
  });

  it('responds with 400 and the message of the broken rule', async () => {
    const payload = await createContractPayload();

    const response = await request(app).post('/contracts').send({ ...payload, endDate: '2026-01-01' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('La fecha de término debe ser posterior a la de inicio');
  });

  it('responds with 404 when the property or the tenant does not exist', async () => {
    const payload = await createContractPayload();

    const noProperty = await request(app).post('/contracts').send({ ...payload, propertyId: 9999 });
    const noTenant = await request(app).post('/contracts').send({ ...payload, tenantId: 9999 });

    expect(noProperty.body.error).toBe('Propiedad no encontrada');
    expect(noTenant.status).toBe(404);
  });

  it('responds with 400 when the property is already leased', async () => {
    const payload = await createContractPayload();
    await request(app).post('/contracts').send(payload);

    const response = await request(app).post('/contracts').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('La propiedad no está disponible');
  });
});

describe('GET /contracts', () => {
  it('responds with 200, lists the contracts and filters by status', async () => {
    const created = await request(app).post('/contracts').send(await createContractPayload());

    const all = await request(app).get('/contracts');
    const active = await request(app).get('/contracts?status=activo');
    const finished = await request(app).get('/contracts?status=finalizado');

    expect(all.status).toBe(200);
    expect(all.body).toContainEqual(created.body);
    expect(active.body).toContainEqual(created.body);
    expect(finished.body).not.toContainEqual(created.body);
  });

  it('responds with 400 when the status filter is not valid', async () => {
    const response = await request(app).get('/contracts?status=vencido');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El estado no es válido');
  });
});

describe('PATCH /contracts/:id/finish', () => {
  it('finishes the contract and makes the property available again', async () => {
    const payload = await createContractPayload();
    const contract = await request(app).post('/contracts').send(payload);

    const response = await request(app).patch(`/contracts/${contract.body.id}/finish`);
    const property = await request(app).get(`/properties/${payload.propertyId}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('finalizado');
    expect(property.body.status).toBe('disponible');
  });

  it('responds with 400 when the contract is already finished', async () => {
    const contract = await request(app).post('/contracts').send(await createContractPayload());
    await request(app).patch(`/contracts/${contract.body.id}/finish`);

    const response = await request(app).patch(`/contracts/${contract.body.id}/finish`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Solo se puede finalizar un contrato activo');
  });

  it('responds with 404 when the contract does not exist and 400 when the id is not valid', async () => {
    expect((await request(app).patch('/contracts/9999/finish')).body.error).toBe('Contrato no encontrado');
    expect((await request(app).patch('/contracts/abc/finish')).body.error).toBe('El identificador no es válido');
  });
});
