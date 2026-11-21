import { NewProperty, Property, PropertyStatus } from '../../domain/Property';
import { PropertyRepository } from '../../ports/PropertyRepository';

// Adaptador de salida: cumple el contrato PropertyRepository guardando las propiedades en un arreglo.
export class InMemoryPropertyRepository implements PropertyRepository {
  private properties: Property[];

  // El número que usará la próxima propiedad.
  private nextId: number;

  constructor(initialProperties: Property[] = []) {
    // Se copian los objetos para no depender del arreglo original.
    this.properties = initialProperties.map((property) => ({ ...property }));
    this.nextId = Math.max(0, ...initialProperties.map((property) => property.id)) + 1;
  }

  // Devuelve COPIAS, para que nadie de afuera pueda modificar los datos guardados.
  findAll = async (): Promise<Property[]> => this.properties.map((property) => ({ ...property }));

  findById = async (id: number): Promise<Property | undefined> => {
    const property = this.properties.find((item) => item.id === id);

    return property ? { ...property } : undefined;
  };

  save = async (newProperty: NewProperty): Promise<Property> => {
    const property: Property = { id: this.nextId++, ...newProperty };
    this.properties.push(property);

    return { ...property };
  };

  updateStatus = async (id: number, status: PropertyStatus): Promise<Property | undefined> => {
    const property = this.properties.find((item) => item.id === id);

    if (!property) {
      return undefined;
    }

    property.status = status;

    return { ...property };
  };
}
