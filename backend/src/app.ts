import express from 'express';
import cors from 'cors';
import { PropertyService } from './modules/properties/application/PropertyService';
import { createPropertyRouter } from './modules/properties/adapters/http/propertyRoutes';
import { createPropertyRepository } from './modules/properties/adapters/persistence/createPropertyRepository';
import { createTenantRepository } from './modules/tenants/adapters/persistence/createTenantRepository';
import { TenantService } from './modules/tenants/application/TenantService';
import { createTenantRouter } from './modules/tenants/adapters/http/tenantRoutes';
import { createPaymentRepository } from './modules/payments/adapters/persistence/createPaymentRepository';
import { PaymentService } from './modules/payments/application/PaymentService';
import { createPaymentRouter } from './modules/payments/adapters/http/paymentRoutes';
import { getToday } from './shared/dates';
import { errorHandler, notFoundHandler } from './shared/httpErrorHandlers';
import { InMemoryContractRepository } from './modules/contracts/adapters/persistence/InMemoryContractRepository';
import { ContractService } from './modules/contracts/application/ContractService';
import { createContractRouter } from './modules/contracts/adapters/http/contractRoutes';



const app = express();

// Permite que el frontend (que corre en otro puerto) llame a la API
app.use(cors());

// Permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());
const propertyRepository = createPropertyRepository();
const propertyService = new PropertyService(propertyRepository);
app.use('/properties', createPropertyRouter(propertyService));


// ===== [B] Tenants: repositorio, servicio y rutas =====
const tenantRepository = createTenantRepository();
const tenantService = new TenantService(tenantRepository);
app.use('/tenants', createTenantRouter(tenantService));


// ===== [B] Payments: repositorio, servicio y rutas =====
const paymentRepository = createPaymentRepository();
const paymentService = new PaymentService(paymentRepository, getToday);
app.use('/payments', createPaymentRouter(paymentService));

const contractRepository = new InMemoryContractRepository();
const contractService = new ContractService(contractRepository, propertyRepository, tenantRepository, paymentRepository);
app.use('/contracts', createContractRouter(contractService));



// Si ninguna ruta coincidió: 404 en JSON
app.use(notFoundHandler);

// El manejador de errores va SIEMPRE al final
app.use(errorHandler);

export default app;
