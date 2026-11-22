import type { NewProperty, Property } from '../types/property';
import { request } from './http';

// GET /properties
export const getProperties = (): Promise<Property[]> => request<Property[]>('/properties');

// POST /properties
export const createProperty = (data: NewProperty): Promise<Property> =>
  request<Property>('/properties', { method: 'POST', body: JSON.stringify(data) });
