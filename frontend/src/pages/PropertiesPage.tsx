import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/http';
import { createProperty, getProperties } from '../api/properties';
import { Notice } from '../components/Notice';
import { PageHeader } from '../components/PageHeader';
import { StatsRow } from '../components/StatsRow';
import { PropertyForm } from '../components/PropertyForm';
import { PropertyList } from '../components/PropertyList';
import type { NewProperty, Property } from '../types/property';
import './PropertiesPage.css';

export const PropertiesPage = () => {
  // La página guarda los datos: la lista, si está cargando y el error de la carga.
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Un contador: cada vez que sube, el efecto de abajo vuelve a pedir la lista.
  const [reloadCount, setReloadCount] = useState<number>(0);

  // Cada vez que cambia reloadCount (al abrir la página y después de cada cambio) se vuelve a pedir la lista.
  // isCurrent evita guardar datos si la página se cerró antes de que la API respondiera.
  useEffect(() => {
    let isCurrent = true;

    getProperties()
      .then((data) => {
        if (isCurrent) {
          setProperties(data);
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

  // Registra una propiedad y pide la lista de nuevo. Si la API rechaza los datos, el error llega al formulario.
  const handleCreate = async (data: NewProperty) => {
    await createProperty(data);
    setReloadCount((count) => count + 1);
  };

  return (
    <section className="properties-page">
      <PageHeader
        icon="home"
        title="Propiedades"
        subtitle="Casas, departamentos, locales y oficinas"
        meta={`${properties.length} ${properties.length === 1 ? 'propiedad' : 'propiedades'}`}
      />

      <StatsRow
        stats={[
          { icon: 'home', label: 'Total', value: String(properties.length) },
          { icon: 'check', label: 'Disponibles', value: String(properties.filter((p) => p.status === 'disponible').length), tone: 'green' },
          { icon: 'key', label: 'Arrendadas', value: String(properties.filter((p) => p.status === 'arrendada').length), tone: 'blue' },
          { icon: 'wrench', label: 'En mantención', value: String(properties.filter((p) => p.status === 'mantencion').length), tone: 'amber' },
        ]}
      />

      <PropertyForm onSubmit={handleCreate} />

      {errorMessage && <Notice kind="error" message={errorMessage} />}
      {isLoading && <Notice kind="info" message="Cargando propiedades..." />}
      {!isLoading && !errorMessage && properties.length === 0 && (
        <Notice kind="info" message="Todavía no hay propiedades registradas." />
      )}
      {properties.length > 0 && <h3 className="page-section-title">Catálogo de propiedades</h3>}
      {properties.length > 0 && <PropertyList properties={properties} />}
    </section>
  );
};
