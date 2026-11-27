import { CONTRACT_STATUS_LABELS } from '../data/contractOptions';
import type { Contract, ContractStatus } from '../types/contract';
import { formatDate, formatMoney } from '../utils/format';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import './ContractCard.css';

const STATUS_ICONS: Record<ContractStatus, IconName> = {
  activo: 'check',
  finalizado: 'flag',
  cancelado: 'xcircle',
};

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
    <article className={`card contract-card contract-card-${contract.status}-card`}>
      <div className="contract-card-header">
        <span className="icon-tile contract-card-icon">
          <Icon name="file" size={20} />
        </span>
        <h3 className="contract-card-title">Contrato #{contract.id}</h3>
        {/* El color del estado cambia según su valor: activo, finalizado o cancelado. */}
        <span className={`chip contract-card-status contract-card-status-${contract.status}`}>
          <Icon name={STATUS_ICONS[contract.status]} size={14} />
          {CONTRACT_STATUS_LABELS[contract.status]}
        </span>
      </div>

      <p className="contract-card-property">
        <Icon name="pin" size={17} />
        {propertyAddress}
      </p>
      <p className="contract-card-tenant">
        <Icon name="user" size={17} />
        Inquilino: {tenantName}
      </p>
      <p className="contract-card-dates">
        <Icon name="calendar" size={17} />
        {formatDate(contract.startDate)} al {formatDate(contract.endDate)}
      </p>
      <p className="contract-card-amount">
        <Icon name="coins" size={18} />
        {formatMoney(contract.monthlyAmount)} <span>al mes</span>
      </p>

      {contract.status === 'activo' && (
        <button
          type="button"
          className="button button-outline contract-card-finish"
          disabled={isFinishing}
          onClick={() => onFinish(contract.id)}
        >
          <Icon name={isFinishing ? 'loader' : 'flag'} size={18} className={isFinishing ? 'spin' : undefined} />
          {isFinishing ? 'Finalizando...' : 'Finalizar contrato'}
        </button>
      )}
    </article>
  );
};
