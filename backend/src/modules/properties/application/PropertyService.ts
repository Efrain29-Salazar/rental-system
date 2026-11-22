import { NotFoundError } from '../../../shared/NotFoundError';
import { Property, parseNewProperty } from '../domain/Property';
import { PropertyRepository } from '../ports/PropertyRepository';

// Un "servicio" agrupa los casos de uso de las propiedades. Solo conoce el contrato (el puerto).
export class PropertyService {
  constructor(private readonly repository: PropertyRepository) {}

  // CASO DE USO 2: listar propiedades.
  list = async (): Promise<Property[]> => this.repository.findAll();

  // CASO DE USO 3: consultar una propiedad.
  getById = async (id: number): Promise<Property> => {
    const property = await this.repository.findById(id);

    if (!property) {
      throw new NotFoundError('Propiedad no encontrada');
    }

    return property;
  };

  // CASO DE USO 1: registrar una propiedad. El dominio valida (DomainError → 400).
  create = async (input: unknown): Promise<Property> => this.repository.save(parseNewProperty(input));
}
