import { Request, Response, NextFunction } from 'express';
import { categoriaService } from './categoria.service';
import { TipoParamSchema } from './categoria.schema';
import { AppError } from '../../middlewares/errorHandler';

export class CategoriaController {
  async obtenerTodas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categorias = await categoriaService.obtenerTodas();
      res.status(200).json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorTipo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawTipo = Array.isArray(req.params.tipo) ? req.params.tipo[0] : req.params.tipo;
      const parsedTipo = TipoParamSchema.safeParse(rawTipo?.toUpperCase());
      if (!parsedTipo.success) {
        throw new AppError('El tipo debe ser INGRESO o GASTO', 400);
      }

      const categorias = await categoriaService.obtenerPorTipo(parsedTipo.data);
      res.status(200).json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async crearCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nuevaCategoria = await categoriaService.crearCategoria(req.body);
      res.status(201).json(nuevaCategoria);
    } catch (error) {
      next(error);
    }
  }
}

export const categoriaController = new CategoriaController();
