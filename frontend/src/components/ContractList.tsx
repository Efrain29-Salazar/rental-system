import type { Contract } from '../types/contract';
import type { Property } from '../types/property';
import type { Tenant } from '../types/tenant';
import { ContractCard } from './ContractCard';
import './ContractList.css';

// Recibe los contratos y también las propiedades y los inquilinos, para mostrar nombres en vez de números.
interface ContractListProps {
  contracts: Contract[];
  properties: Property[];
  tenants: Tenant[];
  finishingId: number | null;
  onFinish: (id: number) => void;
}

export const ContractList = ({ contracts, properties, tenants, finishingId, onFinish }: ContractListProps) => {
  return (
    <div className="contract-list">
      {/* La key es el id del contrato, nunca la posición. */}
      {contracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          propertyAddress={properties.find((property) => property.id === contract.propertyId)?.address ?? `Propiedad #${contract.propertyId}`}
          tenantName={tenants.find((tenant) => tenant.id === contract.tenantId)?.name ?? `Inquilino #${contract.tenantId}`}
          isFinishing={finishingId === contract.id}
          onFinish={onFinish}
        />
      ))}
    </div>
  );
};
