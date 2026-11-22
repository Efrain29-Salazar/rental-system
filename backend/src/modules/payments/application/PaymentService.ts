import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { Payment } from '../domain/Payment';
import { PaymentRepository } from '../ports/PaymentRepository';

// Un "servicio" agrupa los casos de uso de los pagos. Solo conoce el contrato (el puerto).
export class PaymentService {
  // El reloj devuelve la fecha de hoy (AAAA-MM-DD). Se recibe desde afuera para poder probar con una fecha fija.
  constructor(
    private readonly repository: PaymentRepository,
    private readonly clock: () => string,
  ) {}

  // CASO DE USO 8: registrar un pago. Pasa a "pagado" con la fecha de hoy.
  markAsPaid = async (id: number): Promise<Payment> => {
    const payment = await this.repository.findById(id);

    if (!payment) {
      throw new NotFoundError('Pago no encontrado');
    }

    if (payment.status === 'pagado') {
      throw new DomainError('El pago ya está registrado');
    }

    const paid = await this.repository.markAsPaid(id, this.clock());

    if (!paid) {
      throw new NotFoundError('Pago no encontrado');
    }

    return paid;
  };

  // CASO DE USO 9: pagos morosos (pendientes con vencimiento anterior a hoy).
  listOverdue = async (): Promise<Payment[]> => this.repository.findOverdue(this.clock());

  // Pagos de un contrato (para mostrarlos en la pantalla).
  listByContract = async (contractId: number): Promise<Payment[]> => this.repository.findByContract(contractId);
}
