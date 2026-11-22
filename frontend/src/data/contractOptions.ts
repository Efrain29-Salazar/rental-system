import type { ContractStatus } from '../types/contract';

// El texto que ve el usuario para cada estado (los valores guardados son los de la izquierda).
export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  activo: 'Activo',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
};

// Las opciones del filtro de la lista. El valor vacío significa "sin filtro".
export const CONTRACT_FILTER_OPTIONS: { value: ContractStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'finalizado', label: 'Finalizados' },
  { value: 'cancelado', label: 'Cancelados' },
];
