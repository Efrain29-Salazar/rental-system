import { useState } from 'react';
import type { ReactNode } from 'react';

import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import type { Section } from './types/section';


import { PropertiesPage } from './pages/PropertiesPage';

import { TenantsPage } from './pages/TenantsPage';

import { ContractsPage } from './pages/ContractsPage';

import { PaymentsPage } from './pages/PaymentsPage';
// ===== fin de los imports =====

// Qué se muestra en cada sección. Cada integrante reemplaza SOLO su línea cuando su página esté lista.
const sectionPages: Record<Section, ReactNode> = {
  
  properties: <PropertiesPage />,

  tenants: <TenantsPage />,

  contracts: <ContractsPage />,

  payments: <PaymentsPage />,


  // ===== fin de las secciones =====
};

// App solo ensambla: la cabecera, el menú y la página de la sección activa.
const App = () => {
  const [activeSection, setActiveSection] = useState<Section>('properties');

  return (
    <div>
      <Header />
      <MainMenu activeSection={activeSection} onChange={setActiveSection} />
      {/* data-module da a toda la sección el color de su módulo. key hace que la animación de entrada se repita al cambiar. */}
      <main className="container" data-module={activeSection} key={activeSection}>
        {sectionPages[activeSection]}
      </main>
    </div>
  );
};

export default App;