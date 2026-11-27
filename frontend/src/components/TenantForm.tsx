import { useState } from 'react';
import type { FormEvent } from 'react';

import { getErrorMessage } from '../api/http';
import type { NewTenant } from '../types/tenant';
import { Icon } from './Icon';
import { Notice } from './Notice';
import './TenantForm.css';

// El formulario no llama a la API: avisa con onSubmit y la página decide qué hacer.
// Si onSubmit falla, el formulario muestra el mensaje de error que envía la API.
interface TenantFormProps {
  onSubmit: (data: NewTenant) => Promise<void>;
}

export const TenantForm = ({ onSubmit }: TenantFormProps) => {
  const [cedula, setCedula] = useState<string>('');
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
      await onSubmit({ cedula, name, email, phone });
      // Si todo salió bien, el formulario se vacía.
      setCedula('');
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
    <form className="form-card tenant-form" onSubmit={handleSubmit} noValidate>
      <h3 className="form-card-title">
        <span className="icon-tile">
          <Icon name="plus" size={20} />
        </span>
        Registrar inquilino
      </h3>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="tenant-cedula">
            <Icon name="idcard" size={15} />
            Cédula
          </label>
          {/* inputMode="numeric" muestra el teclado de números en el celular; maxLength evita escribir más de 10 dígitos. */}
          <input
            id="tenant-cedula"
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="10 dígitos"
            value={cedula}
            onChange={(event) => setCedula(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="tenant-name">
            <Icon name="user" size={15} />
            Nombre
          </label>
          <input id="tenant-name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="tenant-email">
            <Icon name="mail" size={15} />
            Correo
          </label>
          <input id="tenant-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="tenant-phone">
            <Icon name="phone" size={15} />
            Teléfono
          </label>
          <input id="tenant-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
      </div>

      {errorMessage && <Notice kind="error" message={errorMessage} />}

      <button type="submit" className="button" disabled={isSubmitting}>
        <Icon name={isSubmitting ? 'loader' : 'plus'} size={18} className={isSubmitting ? 'spin' : undefined} />
        {isSubmitting ? 'Guardando...' : 'Registrar inquilino'}
      </button>
    </form>
  );
};