import { useState } from 'react';
import type { FormEvent } from 'react';

import { getErrorMessage } from '../api/http';
import type { NewTenant } from '../types/tenant';
import { Notice } from './Notice';
import './TenantForm.css';

// El formulario no llama a la API: avisa con onSubmit y la página decide qué hacer.
// Si onSubmit falla, el formulario muestra el mensaje de error que envía la API.
interface TenantFormProps {
  onSubmit: (data: NewTenant) => Promise<void>;
}

export const TenantForm = ({ onSubmit }: TenantFormProps) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await onSubmit({ name, email, phone });
      // Si todo salió bien, el formulario se vacía.
      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // noValidate: la validación la hace la API y responde con mensajes en español (el navegador mostraría los suyos).
  return (
    <form className="tenant-form" onSubmit={handleSubmit} noValidate>
      <h3 className="tenant-form-title">Registrar inquilino</h3>

      <div className="tenant-form-fields">
        <div className="field">
          <label htmlFor="tenant-name">Nombre</label>
          <input id="tenant-name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="tenant-email">Correo</label>
          <input id="tenant-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="tenant-phone">Teléfono</label>
          <input id="tenant-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
      </div>

      {errorMessage && <Notice kind="error" message={errorMessage} />}

      <button type="submit" className="button" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Registrar inquilino'}
      </button>
    </form>
  );
};