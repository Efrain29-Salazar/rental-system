import { NotFoundError } from '../../../shared/NotFoundError';
import { DomainError } from '../../../shared/DomainError';
import { PaymentRepository } from '../../payments/ports/PaymentRepository';
import { PropertyRepository } from '../../properties/ports/PropertyRepository';
import { TenantRepository } from '../../tenants/ports/TenantRepository';
import { Contract, parseContractStatus, parseNewContract } from '../domain/Contract';
import { buildPaymentSchedule } from '../domain/buildPaymentSchedule';
import { ContractRepository } from '../ports/ContractRepository';

// El servicio de contratos coordina varios módulos, pero solo conoce sus contratos (puertos), nunca la base de datos.
export class ContractService {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly propertyRepository: PropertyRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  // CASO DE USO 7: listar contratos. El filtro status= es opcional.
  list = async (status?: unknown): Promise<Contract[]> => this.contractRepository.findAll(parseContractStatus(status));

  // CASO DE USO 6: crear un contrato.
  create = async (input: unknown): Promise<Contract> => {
    // 1) El dominio valida los datos (DomainError → 400).
    const newContract = parseNewContract(input);

    // 2) La propiedad y el inquilino deben existir (NotFoundError → 404).
    const property = await this.propertyRepository.findById(newContract.propertyId);

    if (!property) {
      throw new NotFoundError('Propiedad no encontrada');
    }

    if (!(await this.tenantRepository.findById(newContract.tenantId))) {
      throw new NotFoundError('Inquilino no encontrado');
    }

    // 3) La propiedad debe estar disponible.
    if (property.status !== 'disponible') {
      throw new DomainError('La propiedad no está disponible');
    }

    // 4) Se guarda el contrato, se generan sus pagos mensuales y la propiedad pasa a arrendada.
    const contract = await this.contractRepository.save(newContract);
    await this.paymentRepository.saveMany(buildPaymentSchedule(contract));
    await this.propertyRepository.updateStatus(contract.propertyId, 'arrendada');

    return contract;
  };

  // CASO DE USO 10: finalizar un contrato. La propiedad vuelve a quedar disponible.
  finish = async (id: number): Promise<Contract> => {
    const contract = await this.contractRepository.findById(id);

    if (!contract) {
      throw new NotFoundError('Contrato no encontrado');
    }

    if (contract.status !== 'activo') {
      throw new DomainError('Solo se puede finalizar un contrato activo');
    }

    const finished = await this.contractRepository.updateStatus(id, 'finalizado');

    if (!finished) {
      throw new NotFoundError('Contrato no encontrado');
    }

    await this.propertyRepository.updateStatus(contract.propertyId, 'disponible');

    return finished;
  };
}
