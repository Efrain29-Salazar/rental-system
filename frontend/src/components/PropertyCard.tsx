import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../data/propertyOptions';
import type { Property, PropertyStatus, PropertyType } from '../types/property';
import { formatMoney } from '../utils/format';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { PropertyArt } from './PropertyArt';
import './PropertyCard.css';

// El ícono de cada tipo de propiedad y de cada estado.
const TYPE_ICONS: Record<PropertyType, IconName> = {
  casa: 'home',
  departamento: 'building',
  local: 'store',
  oficina: 'briefcase',
};

const STATUS_ICONS: Record<PropertyStatus, IconName> = {
  disponible: 'check',
  arrendada: 'key',
  mantencion: 'wrench',
};

// La tarjeta solo muestra los datos de una propiedad. No guarda estado.
interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <article className="card property-card">
      <div className="property-card-art">
        <PropertyArt type={property.type} />
        {/* El color del estado cambia según su valor: disponible, arrendada o mantencion. */}
        <span className={`chip property-card-status property-card-status-${property.status}`}>
          <Icon name={STATUS_ICONS[property.status]} size={14} />
          {PROPERTY_STATUS_LABELS[property.status]}
        </span>
      </div>

      <div className="property-card-body">
        <h3 className="property-card-title">{property.address}</h3>

        <p className="property-card-type">
          <Icon name={TYPE_ICONS[property.type]} size={16} />
          {PROPERTY_TYPE_LABELS[property.type]}
        </p>
        <p className="property-card-price">
          <Icon name="coins" size={18} />
          {formatMoney(property.monthlyPrice)} <span>al mes</span>
        </p>
        <p className="property-card-owner">
          <Icon name="owner" size={16} />
          Propietario: {property.owner}
        </p>
      </div>
    </article>
  );
};
