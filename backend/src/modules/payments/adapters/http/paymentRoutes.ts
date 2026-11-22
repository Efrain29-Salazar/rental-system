import { Router } from 'express';

import { DomainError } from '../../../../shared/DomainError';
import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { PaymentService } from '../../application/PaymentService';

// Convierte el id que llega como texto ("5") en número (5) y comprueba que sea válido.
const parseId = (value: unknown): number => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new DomainError('El identificador no es válido');
  }

  return id;
};

// Recibe el servicio desde afuera y devuelve las rutas armadas.
export const createPaymentRouter = (service: PaymentService): Router => {
  const router = Router();

  // GET /payments/overdue → pagos morosos.
  router.get('/overdue', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.listOverdue());
  });

  // GET /payments?contractId=1 → pagos de un contrato.
  router.get('/', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.listByContract(parseId(req.query.contractId)));
  });

  // PATCH /payments/:id/pay → registrar un pago.
  router.patch('/:id/pay', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.markAsPaid(parseId(req.params.id)));
  });

  return router;
};
