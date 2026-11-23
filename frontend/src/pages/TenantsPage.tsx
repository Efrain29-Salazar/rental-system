import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/http';
import { createTenant, getTenants } from '../api/tenants';
import { Notice } from '../components/Notice';
import { TenantForm } from '../components/TenantForm';
import { TenantList } from '../components/TenantList';
import type { NewTenant, Tenant } from '../types/tenant';
import './TenantsPage.css';

export const TenantsPage = () => {
  // La página guarda los datos: la lista, si está cargando y el error de la carga.
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Un contador: cada vez que sube, el efecto de abajo vuelve a pedir la lista.
  const [reloadCount, setReloadCount] = useState<number>(0);

  // Cada vez que cambia reloadCount (al abrir la página y después de cada cambio) se vuelve a pedir la lista.
  // isCurrent evita guardar datos si la página se cerró antes de que la API respondiera.
  useEffect(() => {
    let isCurrent = true;

    getTenants()
      .then((data) => {
        if (isCurrent) {
          setTenants(data);
          setErrorMessage('');
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [reloadCount]);

  // Registra un inquilino y pide la lista de nuevo. Si la API rechaza los datos, el error llega al formulario.
  const handleCreate = async (data: NewTenant) => {
    await createTenant(data);
    setReloadCount((count) => count + 1);
  };

  return (
    <section>
      <div className="tenants-page-header">
        <h2 className="tenants-page-title">Inquilinos</h2>
        <p className="tenants-page-count">
          {tenants.length} {tenants.length === 1 ? 'inquilino' : 'inquilinos'}
        </p>
      </div>

      <TenantForm onSubmit={handleCreate} />

      {errorMessage && <Notice kind="error" message={errorMessage} />}
      {isLoading && <Notice kind="info" message="Cargando inquilinos..." />}
      {!isLoading && !errorMessage && tenants.length === 0 && (
        <Notice kind="info" message="Todavía no hay inquilinos registrados." />
      )}
      {tenants.length > 0 && <TenantList tenants={tenants} />}
    </section>
  );
};
