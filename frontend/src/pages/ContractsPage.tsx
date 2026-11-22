import { useEffect, useState } from 'react';

import { createContract, finishContract, getContracts } from '../api/contracts';
import { getErrorMessage } from '../api/http';
import { getProperties } from '../api/properties';
import { getTenants } from '../api/tenants';
import { ContractForm } from '../components/ContractForm';
import { ContractList } from '../components/ContractList';
import { Notice } from '../components/Notice';
import { CONTRACT_FILTER_OPTIONS } from '../data/contractOptions';
import type { Contract, ContractStatus, NewContract } from '../types/contract';
import type { Property } from '../types/property';
import type { Tenant } from '../types/tenant';
import './ContractsPage.css';

export const ContractsPage = () => {
  // La página guarda los datos: contratos, propiedades e inquilinos (para los nombres y las listas del formulario),
  // el filtro elegido, si está cargando, el error y cuál contrato se está finalizando.
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [finishingId, setFinishingId] = useState<number | null>(null);

  // Un contador: cada vez que sube, el efecto de abajo vuelve a pedir los datos.
  const [reloadCount, setReloadCount] = useState<number>(0);

  // Se piden los tres datos a la API a la vez. El efecto se repite al cambiar el filtro o reloadCount.
  // isCurrent evita guardar datos si la página se cerró o el filtro cambió antes de que la API respondiera.
  useEffect(() => {
    let isCurrent = true;

    Promise.all([getContracts(statusFilter || undefined), getProperties(), getTenants()])
      .then(([loadedContracts, loadedProperties, loadedTenants]) => {
        if (isCurrent) {
          setContracts(loadedContracts);
          setProperties(loadedProperties);
          setTenants(loadedTenants);
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
  }, [statusFilter, reloadCount]);

  // Crea un contrato y pide todo de nuevo (la propiedad pasó a arrendada). Si la API rechaza los datos, el error llega al formulario.
  const handleCreate = async (data: NewContract) => {
    await createContract(data);
    setReloadCount((count) => count + 1);
  };

  // Finaliza un contrato: se actualiza en pantalla al instante y se pide todo de nuevo (la propiedad quedó disponible).
  const handleFinish = async (id: number) => {
    setFinishingId(id);

    try {
      await finishContract(id);
      setContracts((current) =>
        current.map((contract) => (contract.id === id ? { ...contract, status: 'finalizado' } : contract)),
      );
      setReloadCount((count) => count + 1);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setFinishingId(null);
    }
  };

  const availableProperties = properties.filter((property) => property.status === 'disponible');

  return (
    <section>
      <div className="contracts-page-header">
        <h2 className="contracts-page-title">Contratos</h2>
        <p className="contracts-page-count">
          {contracts.length} {contracts.length === 1 ? 'contrato' : 'contratos'}
        </p>
      </div>

      <ContractForm availableProperties={availableProperties} tenants={tenants} onSubmit={handleCreate} />

      <div className="contracts-page-filter">
        <label htmlFor="contracts-filter">Estado</label>
        <select
          id="contracts-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as ContractStatus | '')}
        >
          {CONTRACT_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && <Notice kind="error" message={errorMessage} />}
      {isLoading && <Notice kind="info" message="Cargando contratos..." />}
      {!isLoading && !errorMessage && contracts.length === 0 && (
        <Notice kind="info" message="No hay contratos con ese estado." />
      )}
      {contracts.length > 0 && (
        <ContractList
          contracts={contracts}
          properties={properties}
          tenants={tenants}
          finishingId={finishingId}
          onFinish={handleFinish}
        />
      )}
    </section>
  );
};
