import { Router } from 'express';
import { categoriaController } from './categoria.controller';
import { validateBody } from '../../middlewares/validateRequest';
import { CrearCategoriaSchema } from './categoria.schema';

const router = Router();

router.get('/', (req, res, next) => categoriaController.obtenerTodas(req, res, next));
router.get('/tipo/:tipo', (req, res, next) => categoriaController.obtenerPorTipo(req, res, next));
router.post('/', validateBody(CrearCategoriaSchema), (req, res, next) =>
  categoriaController.crearCategoria(req, res, next)
);

export default router;
