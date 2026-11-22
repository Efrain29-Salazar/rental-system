import { Router } from 'express';

import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { TenantService } from '../../application/TenantService';

// Recibe el servicio desde afuera y devuelve las rutas armadas.
export const createTenantRouter = (service: TenantService): Router => {
  const router = Router();

  // GET /tenants → listar inquilinos.
  router.get('/', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.list());
  });

  // POST /tenants → registrar un inquilino.
  router.post('/', async (req, res) => {
    res.status(HTTP_STATUS.CREATED).json(await service.create(req.body));
  });

  return router;
};