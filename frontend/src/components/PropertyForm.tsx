import { useState } from 'react';
import type { FormEvent } from 'react';

import { getErrorMessage } from '../api/http';
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from '../data/propertyOptions';
import type { NewProperty, PropertyType } from '../types/property';
import { Icon } from './Icon';
import { Notice } from './Notice';
import './PropertyForm.css';

// El formulario no llama a la API: avisa con onSubmit y la página decide qué hacer.
// Si onSubmit falla, el formulario muestra el mensaje de error que envía la API.
interface PropertyFormProps {
  onSubmit: (data: NewProperty) => Promise<void>;
}

export const PropertyForm = ({ onSubmit }: PropertyFormProps) => {
  const [address, setAddress] = useState<string>('');
  const [type, setType] = useState<PropertyType>('departamento');
  const [monthlyPrice, setMonthlyPrice] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // El campo de precio guarda texto; aquí se convierte en número para la API.
      await onSubmit({ address, type, monthlyPrice: Number(monthlyPrice), owner });
      // Si todo salió bien, el formulario se vacía.
      setAddress('');
      setMonthlyPrice('');
      setOwner('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // noValidate: la validación la hace la API y responde con mensajes en español (el navegador mostraría los suyos).
  return (
    <form className="form-card property-form" onSubmit={handleSubmit} noValidate>
      <h3 className="form-card-title">
        <span className="icon-tile">
          <Icon name="plus" size={20} />
        </span>
        Registrar propiedad
      </h3>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="property-address">
            <Icon name="pin" size={15} />
            Dirección
          </label>
          <input id="property-address" type="text" value={address} onChange={(event) => setAddress(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="property-type">
            <Icon name="building" size={15} />
            Tipo
          </label>
          <select id="property-type" value={type} onChange={(event) => setType(event.target.value as PropertyType)}>
            {PROPERTY_TYPES.map((option) => (
              <option key={option} value={option}>
                {PROPERTY_TYPE_LABELS[option]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="property-price">
            <Icon name="coins" size={15} />
            Precio mensual (USD)
          </label>
          <input
            id="property-price"
            type="number"
            min="0"
            step="0.01"
            value={monthlyPrice}
            onChange={(event) => setMonthlyPrice(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="property-owner">
            <Icon name="owner" size={15} />
            Propietario
          </label>
          <input id="property-owner" type="text" value={owner} onChange={(event) => setOwner(event.target.value)} />
        </div>
      </div>

      {errorMessage && <Notice kind="error" message={errorMessage} />}

      <button type="submit" className="button" disabled={isSubmitting}>
        <Icon name={isSubmitting ? 'loader' : 'plus'} size={18} className={isSubmitting ? 'spin' : undefined} />
        {isSubmitting ? 'Guardando...' : 'Registrar propiedad'}
      </button>
    </form>
  );
};
