import { z } from 'zod';

export const CrearTransaccionSchema = z.object({
  monto: z
    .number({ required_error: 'El monto es obligatorio' })
    .positive('El monto debe ser mayor a cero'),
  descripcion: z.string().max(255, 'La descripción no puede exceder 255 caracteres').optional().nullable(),
  fecha: z
    .string({ required_error: 'La fecha es obligatoria' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD'),
  idUsuario: z
    .number({ required_error: 'El ID del usuario es obligatorio' })
    .int('El ID de usuario debe ser un número entero')
    .positive('El ID de usuario no es válido'),
  idCategoria: z
    .number({ required_error: 'El ID de la categoría es obligatorio' })
    .int('El ID de categoría debe ser un número entero')
    .positive('El ID de categoría no es válido'),
});

export type CrearTransaccionInput = z.infer<typeof CrearTransaccionSchema>;

export const ActualizarTransaccionSchema = z.object({
  monto: z
    .number({ required_error: 'El monto es obligatorio' })
    .positive('El monto debe ser mayor a cero'),
  descripcion: z.string().max(255, 'La descripción no puede exceder 255 caracteres').optional().nullable(),
  fecha: z
    .string({ required_error: 'La fecha es obligatoria' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD'),
  idCategoria: z
    .number({ required_error: 'El ID de la categoría es obligatorio' })
    .int('El ID de categoría debe ser un número entero')
    .positive('El ID de categoría no es válido'),
  idUsuario: z.number().optional(),
});

export type ActualizarTransaccionInput = z.infer<typeof ActualizarTransaccionSchema>;
