import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import categoriaRoutes from './modules/categorias/categoria.routes';
import authRoutes from './modules/auth/auth.routes';
import transaccionRoutes from './modules/transacciones/transaccion.routes';

// Habilitar serialización JSON automática para tipos BigInt de Prisma/PostgreSQL
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON = function () {
  return Number(this);
};

const app: Application = express();

// Middlewares globales
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite solicitudes sin origen o cualquier origen configurado
      if (!origin || ENV.CORS_ORIGIN.includes('*') || ENV.CORS_ORIGIN.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/transacciones', transaccionRoutes);

// Endpoint de verificación de salud
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'FinanziApp Backend en Node.js funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Middleware de manejo global de errores (debe ser el último)
app.use(errorHandler);

export default app;
