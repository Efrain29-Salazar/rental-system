import { useEffect, useState } from 'react';

import { getErrorMessage } from '../api/http';
import { createProperty, getProperties } from '../api/properties';
import { Notice } from '../components/Notice';
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
    <section>
      <div className="properties-page-header">
        <h2 className="properties-page-title">Propiedades</h2>
        <p className="properties-page-count">
          {properties.length} {properties.length === 1 ? 'propiedad' : 'propiedades'}
        </p>
      </div>

      <PropertyForm onSubmit={handleCreate} />

      {errorMessage && <Notice kind="error" message={errorMessage} />}
      {isLoading && <Notice kind="info" message="Cargando propiedades..." />}
      {!isLoading && !errorMessage && properties.length === 0 && (
        <Notice kind="info" message="Todavía no hay propiedades registradas." />
      )}
      {properties.length > 0 && <PropertyList properties={properties} />}
    </section>
  );
};
