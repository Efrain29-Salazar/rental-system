import express from 'express';
import cors from 'cors';
import { PropertyService } from './modules/properties/application/PropertyService';
import { createPropertyRouter } from './modules/properties/adapters/http/propertyRoutes';
import { createPropertyRepository } from './modules/properties/adapters/persistence/createPropertyRepository';


import { errorHandler, notFoundHandler } from './shared/httpErrorHandlers';


const app = express();

// Permite que el frontend (que corre en otro puerto) llame a la API
app.use(cors());

// Permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());
const propertyRepository = createPropertyRepository();
const propertyService = new PropertyService(propertyRepository);
app.use('/properties', createPropertyRouter(propertyService));


// Si ninguna ruta coincidió: 404 en JSON
app.use(notFoundHandler);

// El manejador de errores va SIEMPRE al final
app.use(errorHandler);

export default app;
