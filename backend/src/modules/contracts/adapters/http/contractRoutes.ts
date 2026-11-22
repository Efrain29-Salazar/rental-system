import { Router } from 'express';

import { DomainError } from '../../../../shared/DomainError';
import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { ContractService } from '../../application/ContractService';

// Convierte el id que llega como texto ("5") en número (5) y comprueba que sea válido.
const parseId = (value: string): number => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new DomainError('El identificador no es válido');
  }

  return id;
};

// Recibe el servicio desde afuera y devuelve las rutas armadas.
export const createContractRouter = (service: ContractService): Router => {
  const router = Router();

  // GET /contracts → listar contratos. Con ?status=activo, solo los activos.
  router.get('/', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.list(req.query.status));
  });

  // POST /contracts → crear un contrato.
  router.post('/', async (req, res) => {
    res.status(HTTP_STATUS.CREATED).json(await service.create(req.body));
  });

  // PATCH /contracts/:id/finish → finalizar un contrato.
  router.patch('/:id/finish', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.finish(parseId(req.params.id)));
  });

  return router;
};
