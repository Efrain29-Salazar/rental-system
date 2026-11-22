import { CONTRACT_STATUS_LABELS } from '../data/contractOptions';
import type { Contract } from '../types/contract';
import { formatDate, formatMoney } from '../utils/format';
import './ContractCard.css';

// La tarjeta solo muestra un contrato y avisa del clic. No guarda estado.
// La página le entrega ya resueltos la dirección de la propiedad y el nombre del inquilino.
interface ContractCardProps {
  contract: Contract;
  propertyAddress: string;
  tenantName: string;
  isFinishing: boolean;
  onFinish: (id: number) => void;
}

export const ContractCard = ({ contract, propertyAddress, tenantName, isFinishing, onFinish }: ContractCardProps) => {
  return (
    <article className="contract-card">
      <div className="contract-card-header">
        <h3 className="contract-card-title">Contrato #{contract.id}</h3>
        {/* El color del estado cambia según su valor: activo, finalizado o cancelado. */}
        <span className={`contract-card-status contract-card-status-${contract.status}`}>
          {CONTRACT_STATUS_LABELS[contract.status]}
        </span>
      </div>

      <p className="contract-card-property">{propertyAddress}</p>
      <p className="contract-card-tenant">Inquilino: {tenantName}</p>
      <p className="contract-card-dates">
        {formatDate(contract.startDate)} al {formatDate(contract.endDate)}
      </p>
      <p className="contract-card-amount">{formatMoney(contract.monthlyAmount)} al mes</p>

      {contract.status === 'activo' && (
        <button
          type="button"
          className="button button-outline contract-card-finish"
          disabled={isFinishing}
          onClick={() => onFinish(contract.id)}
        >
          {isFinishing ? 'Finalizando...' : 'Finalizar contrato'}
        </button>
      )}
    </article>
  );
};
