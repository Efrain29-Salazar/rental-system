import './Notice.css';

// Un mensaje para el usuario: de error (rojo) o informativo (gris). Lo usan todas las pantallas.
interface NoticeProps {
  kind: 'info' | 'error';
  message: string;
}

export const Notice = ({ kind, message }: NoticeProps) => {
  return (
    <p className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {message}
    </p>
  );
};