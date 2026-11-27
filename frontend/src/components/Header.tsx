import { Icon } from './Icon';
import { Logo } from './Logo';
import './Header.css';

// Muestra el logo y el nombre del sistema. No recibe props.
export const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-brand-group">
          <Logo size={46} />
          <div>
            <span className="header-brand">
              Sistema de <strong>Arriendos</strong>
            </span>
            <span className="header-tagline">Gestión de propiedades</span>
          </div>
        </div>
        <ul className="header-badges" aria-hidden="true">
          <li style={{ background: '#14b8a6' }}>
            <Icon name="home" size={16} />
          </li>
          <li style={{ background: '#8b5cf6' }}>
            <Icon name="users" size={16} />
          </li>
          <li style={{ background: '#f08a24' }}>
            <Icon name="file" size={16} />
          </li>
          <li style={{ background: '#fb5d7f' }}>
            <Icon name="coins" size={16} />
          </li>
        </ul>
      </div>
    </header>
  );
};
