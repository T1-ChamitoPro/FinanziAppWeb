import { Router } from 'express';
import { authController } from './auth.controller';
import { validateBody } from '../../middlewares/validateRequest';
import { RegisterSchema, LoginSchema } from './auth.schema';

const router = Router();

router.post('/register', validateBody(RegisterSchema), (req, res, next) =>
  authController.registrar(req, res, next)
);

router.post('/login', validateBody(LoginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

export default router;
