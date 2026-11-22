import type { Section } from '../types/section';
import './MainMenu.css';

// Las secciones que muestra el menú y su texto.
interface MenuItem {
  id: Section;
  label: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'properties', label: 'Propiedades' },
  { id: 'tenants', label: 'Inquilinos' },
  { id: 'contracts', label: 'Contratos' },
  { id: 'payments', label: 'Pagos' },
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
            className={item.id === activeSection ? 'main-menu-item main-menu-item-active' : 'main-menu-item'}
            aria-current={item.id === activeSection ? 'page' : undefined}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};