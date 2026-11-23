import type { Tenant } from '../types/tenant';
import './TenantCard.css';

// La tarjeta solo muestra los datos de un inquilino. No guarda estado.
interface TenantCardProps {
  tenant: Tenant;
}

export const TenantCard = ({ tenant }: TenantCardProps) => {
  return (
    <article className="tenant-card">
      <h3 className="tenant-card-title">{tenant.name}</h3>
      <p className="tenant-card-email">{tenant.email}</p>
      <p className="tenant-card-phone">{tenant.phone}</p>
    </article>
  );
};
