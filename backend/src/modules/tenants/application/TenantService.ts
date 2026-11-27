import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { Tenant, parseNewTenant } from '../domain/Tenant';
import { TenantRepository } from '../ports/TenantRepository';

// Un "servicio" agrupa los casos de uso de los inquilinos. Solo conoce el contrato (el puerto).
export class TenantService {
  constructor(private readonly repository: TenantRepository) {}

  // CASO DE USO 5: listar inquilinos.
  list = async (): Promise<Tenant[]> => this.repository.findAll();

  // Obtener un inquilino por su id.
  getById = async (id: number): Promise<Tenant> => {
    const tenant = await this.repository.findById(id);

    if (!tenant) {
      throw new NotFoundError('Inquilino no encontrado');
    }

    return tenant;
  };

  // CASO DE USO 4: registrar un inquilino. El dominio valida (DomainError → 400) y la cédula no puede repetirse.
  create = async (input: unknown): Promise<Tenant> => {
    const newTenant = parseNewTenant(input);

    if (await this.repository.findByCedula(newTenant.cedula)) {
      throw new DomainError('Ya existe un inquilino con esa cédula');
    }

    return this.repository.save(newTenant);
  };
}
