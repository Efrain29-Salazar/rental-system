import { useState } from 'react';
import type { ReactNode } from 'react';

import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import type { Section } from './types/section';

// ===== imports [A] Properties =====
import { PropertiesPage } from './pages/PropertiesPage';

// ===== imports [B] Tenants =====

// ===== imports [A] Contracts =====
import { ContractsPage } from './pages/ContractsPage';

// ===== imports [B] Payments =====

// ===== fin de los imports =====

// Qué se muestra en cada sección. Cada integrante reemplaza SOLO su línea cuando su página esté lista.
const sectionPages: Record<Section, ReactNode> = {
  // ===== [A] Properties =====
  properties: <PropertiesPage />,

  // ===== [B] Tenants =====
  tenants: <p className="app-placeholder">Inquilinos: próximamente</p>,

  // ===== [A] Contracts =====
  contracts: <ContractsPage />,

  // ===== [B] Payments =====
  payments: <p className="app-placeholder">Pagos: próximamente</p>,

  // ===== fin de las secciones =====
};

// App solo ensambla: la cabecera, el menú y la página de la sección activa.
const App = () => {
  const [activeSection, setActiveSection] = useState<Section>('properties');

  return (
    <div>
      <Header />
      <MainMenu activeSection={activeSection} onChange={setActiveSection} />
      <main className="container">{sectionPages[activeSection]}</main>
    </div>
  );
};

export default App;