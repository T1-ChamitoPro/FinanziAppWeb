import { Router } from 'express';
import { transaccionController } from './transaccion.controller';
import { validateBody } from '../../middlewares/validateRequest';
import { CrearTransaccionSchema, ActualizarTransaccionSchema } from './transaccion.schema';

const router = Router();

router.post('/', validateBody(CrearTransaccionSchema), (req, res, next) =>
  transaccionController.crearTransaccion(req, res, next)
);

router.get('/usuario/:idUsuario', (req, res, next) =>
  transaccionController.obtenerTransacciones(req, res, next)
);

router.get('/balance/usuario/:idUsuario', (req, res, next) =>
  transaccionController.obtenerBalance(req, res, next)
);

router.put('/:id', validateBody(ActualizarTransaccionSchema), (req, res, next) =>
  transaccionController.actualizarTransaccion(req, res, next)
);

router.delete('/:id', (req, res, next) =>
  transaccionController.eliminarTransaccion(req, res, next)
);

export default router;
