import type { Tenant } from '../types/tenant';
import { getAvatarGradient, getInitials } from '../utils/avatar';
import { Icon } from './Icon';
import './TenantCard.css';

// La tarjeta solo muestra los datos de un inquilino. No guarda estado.
interface TenantCardProps {
  tenant: Tenant;
}

export const TenantCard = ({ tenant }: TenantCardProps) => {
  return (
    <article className="card tenant-card">
      {/* El avatar muestra las iniciales sobre un color que siempre es el mismo para ese nombre. */}
      <div className="tenant-card-avatar" style={{ background: getAvatarGradient(tenant.name) }} aria-hidden="true">
        {getInitials(tenant.name)}
      </div>

      <div className="tenant-card-info">
        <h3 className="tenant-card-title">{tenant.name}</h3>
        <p className="tenant-card-cedula">
          <span className="icon-tile">
            <Icon name="idcard" size={16} />
          </span>
          <span>
            <span className="tenant-card-cedula-label">C.I.</span> {tenant.cedula}
          </span>
        </p>
        <p className="tenant-card-email">
          <span className="icon-tile">
            <Icon name="mail" size={16} />
          </span>
          <a href={`mailto:${tenant.email}`}>{tenant.email}</a>
        </p>
        <p className="tenant-card-phone">
          <span className="icon-tile">
            <Icon name="phone" size={16} />
          </span>
          <a href={`tel:${tenant.phone}`}>{tenant.phone}</a>
        </p>
      </div>
    </article>
  );
};
