import { Icon } from './Icon';
import type { IconName } from './Icon';
import './StatsRow.css';

// Una fila de datos resumen (cantidad + etiqueta) que va debajo del encabezado de cada sección.
// tone elige el color de la ficha: el del módulo (accent) o uno fijo para estados.
export interface Stat {
  icon: IconName;
  label: string;
  value: string;
  tone?: 'accent' | 'green' | 'blue' | 'amber' | 'gray' | 'red';
}

interface StatsRowProps {
  stats: Stat[];
}

export const StatsRow = ({ stats }: StatsRowProps) => {
  return (
    <div className="stats-row">
      {stats.map((stat) => (
        <div key={stat.label} className={`stat stat-${stat.tone ?? 'accent'}`}>
          <span className="stat-icon">
            <Icon name={stat.icon} size={20} />
          </span>
          <div>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
