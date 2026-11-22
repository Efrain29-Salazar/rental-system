import express from 'express';
import cors from 'cors';

import { errorHandler, notFoundHandler } from './shared/httpErrorHandlers';

// ===== imports [A] Properties =====

// ===== imports [B] Tenants =====
import { createTenantRepository } from './modules/tenants/adapters/persistence/createTenantRepository';
import { TenantService } from './modules/tenants/application/TenantService';
import { createTenantRouter } from './modules/tenants/adapters/http/tenantRoutes';



// ===== imports [B] Payments =====

// ===== imports [A] Contracts =====

// ===== fin de los imports =====

const app = express();

// Permite que el frontend (que corre en otro puerto) llame a la API
app.use(cors());

// Permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());

// ===== [A] Properties: repositorio, servicio y rutas =====


// ===== [B] Tenants: repositorio, servicio y rutas =====
const tenantRepository = createTenantRepository();
const tenantService = new TenantService(tenantRepository);
app.use('/tenants', createTenantRouter(tenantService));


// ===== [B] Payments: repositorio, servicio y rutas =====


// ===== [A] Contracts: repositorio, servicio y rutas =====


// ===== fin de los módulos =====

// Si ninguna ruta coincidió: 404 en JSON
app.use(notFoundHandler);

// El manejador de errores va SIEMPRE al final
app.use(errorHandler);

export default app;
