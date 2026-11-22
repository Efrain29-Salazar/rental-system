// Dirección de la API. Se configura en el archivo .env (VITE_API_URL); si no existe, se usa el puerto 3000.
const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Saca un texto legible de cualquier error (las pantallas lo muestran al usuario).
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error inesperado';

// Hace una petición a la API y devuelve los datos ya convertidos desde JSON.
// Si la API responde con un error (400, 404...), lanza un Error con el mensaje en español que ella envía.
export const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }

  const data: unknown = await response.json();

  if (!response.ok) {
    const message = (data as { error?: string }).error;

    throw new Error(message ?? 'Error inesperado');
  }

  return data as T;
};