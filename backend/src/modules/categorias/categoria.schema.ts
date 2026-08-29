import { z } from 'zod';

export const CrearCategoriaSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre no puede estar vacío')
    .max(50, 'El nombre no puede superar los 50 caracteres'),
  tipo: z.enum(['INGRESO', 'GASTO'], {
    errorMap: () => ({ message: 'El tipo debe ser INGRESO o GASTO' }),
  }),
});

export type CrearCategoriaInput = z.infer<typeof CrearCategoriaSchema>;

export const TipoParamSchema = z.enum(['INGRESO', 'GASTO'], {
  errorMap: () => ({ message: 'El tipo debe ser INGRESO o GASTO' }),
});
