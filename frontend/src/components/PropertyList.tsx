import type { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';
import './PropertyList.css';

interface PropertyListProps {
  properties: Property[];
}

export const PropertyList = ({ properties }: PropertyListProps) => {
  return (
    <div className="property-list">
      {/* La key es el id de la propiedad, nunca la posición. */}
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
