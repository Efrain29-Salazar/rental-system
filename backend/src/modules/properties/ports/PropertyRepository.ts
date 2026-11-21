import { NewProperty, Property, PropertyStatus } from '../domain/Property';

// Contrato que debe cumplir CUALQUIER lugar donde se guarden propiedades (memoria, PostgreSQL, etc.).
export interface PropertyRepository {
  // Devuelve todas las propiedades.
  findAll: () => Promise<Property[]>;

  // Busca una propiedad por su id. Devuelve la propiedad o undefined si no existe.
  findById: (id: number) => Promise<Property | undefined>;

  // Guarda una propiedad nueva y la devuelve con su id.
  save: (newProperty: NewProperty) => Promise<Property>;

  // Cambia el estado de una propiedad (lo usa el módulo de contratos). Devuelve undefined si no existe.
  updateStatus: (id: number, status: PropertyStatus) => Promise<Property | undefined>;
}
