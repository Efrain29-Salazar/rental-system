import { Icon } from './Icon';
import type { IconName } from './Icon';
import './PageHeader.css';

// La franja de color con la que empieza cada sección: ícono, título, una frase y un dato resumen.
// El color lo da el módulo activo (data-module en el <main> de la App).
interface PageHeaderProps {
  icon: IconName;
  title: string;
  subtitle: string;
  meta: string;
}

export const PageHeader = ({ icon, title, subtitle, meta }: PageHeaderProps) => {
  return (
    <div className="page-header">
      <span className="page-header-badge">
        <Icon name={icon} size={30} />
      </span>
      <div className="page-header-text">
        <h2 className="page-header-title">{title}</h2>
        <p className="page-header-subtitle">{subtitle}</p>
      </div>
      <p className="page-header-meta">{meta}</p>
    </div>
  );
};
