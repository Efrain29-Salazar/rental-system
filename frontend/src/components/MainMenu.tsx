import type { Section } from '../types/section';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import './MainMenu.css';

// Las secciones que muestra el menú, su texto y su ícono. El color de cada una sale de data-module (ver index.css).
interface MenuItem {
  id: Section;
  label: string;
  icon: IconName;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'properties', label: 'Propiedades', icon: 'home' },
  { id: 'tenants', label: 'Inquilinos', icon: 'users' },
  { id: 'contracts', label: 'Contratos', icon: 'file' },
  { id: 'payments', label: 'Pagos', icon: 'coins' },
];

// El menú NO guarda estado: la App le dice qué sección está activa y él avisa cuando el usuario elige otra.
interface MainMenuProps {
  activeSection: Section;
  onChange: (section: Section) => void;
}

export const MainMenu = ({ activeSection, onChange }: MainMenuProps) => {
  return (
    <nav className="main-menu" aria-label="Secciones">
      <div className="container main-menu-content">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            data-module={item.id}
            className={item.id === activeSection ? 'main-menu-item main-menu-item-active' : 'main-menu-item'}
            aria-current={item.id === activeSection ? 'page' : undefined}
            onClick={() => onChange(item.id)}
          >
            <span className="main-menu-icon">
              <Icon name={item.icon} size={18} />
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
