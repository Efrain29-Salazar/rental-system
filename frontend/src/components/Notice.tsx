import { Icon } from './Icon';
import './Notice.css';

// Un mensaje para el usuario: de error (rojo) o informativo (azul, con ícono que gira si dice "Cargando"). Lo usan todas las pantallas.
interface NoticeProps {
  kind: 'info' | 'error';
  message: string;
}

export const Notice = ({ kind, message }: NoticeProps) => {
  const isLoading = kind === 'info' && message.startsWith('Cargando');

  return (
    <p className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon
        name={kind === 'error' ? 'xcircle' : isLoading ? 'loader' : 'info'}
        size={20}
        className={isLoading ? 'spin' : undefined}
      />
      <span>{message}</span>
    </p>
  );
};
