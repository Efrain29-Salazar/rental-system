import { useState } from 'react';
import type { FormEvent } from 'react';

import { getErrorMessage } from '../api/http';
import type { NewContract } from '../types/contract';
import type { Property } from '../types/property';
import type { Tenant } from '../types/tenant';
import { formatMoney } from '../utils/format';
import { Icon } from './Icon';
import { Notice } from './Notice';
import './ContractForm.css';

// El formulario no llama a la API: avisa con onSubmit y la página decide qué hacer.
// Recibe solo las propiedades DISPONIBLES y todos los inquilinos, para llenar las listas desplegables.
interface ContractFormProps {
  availableProperties: Property[];
  tenants: Tenant[];
  onSubmit: (data: NewContract) => Promise<void>;
}

export const ContractForm = ({ availableProperties, tenants, onSubmit }: ContractFormProps) => {
  // Los campos guardan texto (los selectores y las fechas devuelven texto); se convierten al enviar.
  const [propertyId, setPropertyId] = useState<string>('');
  const [tenantId, setTenantId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canCreate = availableProperties.length > 0 && tenants.length > 0;

  // Al elegir una propiedad, el monto mensual se llena con su precio (se puede cambiar).
  const handlePropertyChange = (value: string) => {
    setPropertyId(value);

    const selected = availableProperties.find((property) => String(property.id) === value);

    if (selected) {
      setMonthlyAmount(String(selected.monthlyPrice));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        propertyId: Number(propertyId),
        tenantId: Number(tenantId),
        startDate,
        endDate,
        monthlyAmount: Number(monthlyAmount),
      });
      // Si todo salió bien, el formulario se vacía.
      setPropertyId('');
      setTenantId('');
      setStartDate('');
      setEndDate('');
      setMonthlyAmount('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // noValidate: la validación la hace la API y responde con mensajes en español (el navegador mostraría los suyos).
  return (
    <form className="form-card contract-form" onSubmit={handleSubmit} noValidate>
      <h3 className="form-card-title">
        <span className="icon-tile">
          <Icon name="plus" size={20} />
        </span>
        Crear contrato
      </h3>

      {!canCreate && (
        <Notice kind="info" message="Para crear un contrato necesitas al menos una propiedad disponible y un inquilino." />
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="contract-property">
            <Icon name="home" size={15} />
            Propiedad disponible
          </label>
          <select id="contract-property" value={propertyId} onChange={(event) => handlePropertyChange(event.target.value)}>
            <option value="">Selecciona una propiedad</option>
            {availableProperties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.address} ({formatMoney(property.monthlyPrice)})
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="contract-tenant">
            <Icon name="user" size={15} />
            Inquilino
          </label>
          <select id="contract-tenant" value={tenantId} onChange={(event) => setTenantId(event.target.value)}>
            <option value="">Selecciona un inquilino</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name} · C.I. {tenant.cedula}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="contract-start">
            <Icon name="calendar" size={15} />
            Fecha de inicio
          </label>
          <input id="contract-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="contract-end">
            <Icon name="flag" size={15} />
            Fecha de término
          </label>
          <input id="contract-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="contract-amount">
            <Icon name="coins" size={15} />
            Monto mensual (USD)
          </label>
          <input
            id="contract-amount"
            type="number"
            min="0"
            step="0.01"
            value={monthlyAmount}
            onChange={(event) => setMonthlyAmount(event.target.value)}
          />
        </div>
      </div>

      {errorMessage && <Notice kind="error" message={errorMessage} />}

      <button type="submit" className="button" disabled={isSubmitting || !canCreate}>
        <Icon name={isSubmitting ? 'loader' : 'plus'} size={18} className={isSubmitting ? 'spin' : undefined} />
        {isSubmitting ? 'Guardando...' : 'Crear contrato'}
      </button>
    </form>
  );
};
