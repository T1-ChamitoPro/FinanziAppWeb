import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    err.errors.forEach((e) => {
      const field = e.path.join('.');
      fieldErrors[field] = e.message;
    });
    res.status(400).json(fieldErrors);
    return;
  }

  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
