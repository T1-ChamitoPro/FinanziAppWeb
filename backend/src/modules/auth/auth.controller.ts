import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export class AuthController {
  async registrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await authService.registrar(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await authService.login(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
