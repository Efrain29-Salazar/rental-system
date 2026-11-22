import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../data/propertyOptions';
import type { Property } from '../types/property';
import { formatMoney } from '../utils/format';
import './PropertyCard.css';

// La tarjeta solo muestra los datos de una propiedad. No guarda estado.
interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <article className="property-card">
      <div className="property-card-header">
        <h3 className="property-card-title">{property.address}</h3>
        {/* El color del estado cambia según su valor: disponible, arrendada o mantencion. */}
        <span className={`property-card-status property-card-status-${property.status}`}>
          {PROPERTY_STATUS_LABELS[property.status]}
        </span>
      </div>

      <p className="property-card-type">{PROPERTY_TYPE_LABELS[property.type]}</p>
      <p className="property-card-price">{formatMoney(property.monthlyPrice)} al mes</p>
      <p className="property-card-owner">Propietario: {property.owner}</p>
    </article>
  );
};
