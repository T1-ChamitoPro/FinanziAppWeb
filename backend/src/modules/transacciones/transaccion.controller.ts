import { Request, Response, NextFunction } from 'express';
import { transaccionService } from './transaccion.service';
import { AppError } from '../../middlewares/errorHandler';

export class TransaccionController {
  async crearTransaccion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaccion = await transaccionService.registrarTransaccion(req.body);
      res.status(201).json(transaccion);
    } catch (error) {
      next(error);
    }
  }

  async obtenerTransacciones(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = Array.isArray(req.params.idUsuario) ? req.params.idUsuario[0] : req.params.idUsuario;
      const idUsuario = parseInt(rawId, 10);
      if (isNaN(idUsuario)) {
        throw new AppError('El ID de usuario debe ser un número válido', 400);
      }

      const transacciones = await transaccionService.obtenerPorUsuario(idUsuario);
      res.status(200).json(transacciones);
    } catch (error) {
      next(error);
    }
  }

  async obtenerBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = Array.isArray(req.params.idUsuario) ? req.params.idUsuario[0] : req.params.idUsuario;
      const idUsuario = parseInt(rawId, 10);
      if (isNaN(idUsuario)) {
        throw new AppError('El ID de usuario debe ser un número válido', 400);
      }

      const balance = await transaccionService.obtenerBalance(idUsuario);
      res.status(200).json(balance);
    } catch (error) {
      next(error);
    }
  }

  async actualizarTransaccion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        throw new AppError('El ID de transacción debe ser un número válido', 400);
      }

      const actualizada = await transaccionService.actualizarTransaccion(id, req.body);
      res.status(200).json(actualizada);
    } catch (error) {
      next(error);
    }
  }

  async eliminarTransaccion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        throw new AppError('El ID de transacción debe ser un número válido', 400);
      }

      await transaccionService.eliminarTransaccion(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const transaccionController = new TransaccionController();
