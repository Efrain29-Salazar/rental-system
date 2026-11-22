import { Router } from 'express';

import { DomainError } from '../../../../shared/DomainError';
import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { PropertyService } from '../../application/PropertyService';

// Convierte el id que llega como texto ("5") en número (5) y comprueba que sea válido.
const parseId = (value: string): number => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new DomainError('El identificador no es válido');
  }

  return id;
};

// Recibe el servicio desde afuera y devuelve las rutas armadas.
export const createPropertyRouter = (service: PropertyService): Router => {
  const router = Router();

  // GET /properties → listar propiedades.
  router.get('/', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.list());
  });

  // GET /properties/:id → consultar una propiedad.
  router.get('/:id', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.getById(parseId(req.params.id)));
  });

  // POST /properties → registrar una propiedad.
  router.post('/', async (req, res) => {
    res.status(HTTP_STATUS.CREATED).json(await service.create(req.body));
  });

  return router;
};
