import './Header.css';

// Muestra el nombre del sistema. No recibe props.
export const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <span className="header-brand">Sistema de Arriendos</span>
        <span className="header-tagline">Gestión de propiedades</span>
      </div>
    </header>
  );
};
