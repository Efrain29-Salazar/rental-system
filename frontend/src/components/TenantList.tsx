import type { Tenant } from '../types/tenant';
import { TenantCard } from './TenantCard';
import './TenantList.css';

interface TenantListProps {
  tenants: Tenant[];
}

export const TenantList = ({ tenants }: TenantListProps) => {
  return (
    <div className="tenant-list">
      {/* La key es el id del inquilino, nunca la posición. */}
      {tenants.map((tenant) => (
        <TenantCard key={tenant.id} tenant={tenant} />
      ))}
    </div>
  );
};