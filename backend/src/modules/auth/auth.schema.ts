import { z } from 'zod';

export const RegisterSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre no puede estar vacío' })
    .trim()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  correo: z
    .string({ required_error: 'El correo no puede estar vacío' })
    .trim()
    .min(1, 'El correo no puede estar vacío')
    .email('Correo no válido')
    .max(150, 'El correo no puede superar los 150 caracteres'),
  contrasena: z
    .string({ required_error: 'La contraseña no puede estar vacía' })
    .min(1, 'La contraseña no puede estar vacía'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  correo: z
    .string({ required_error: 'El correo es obligatorio' })
    .trim()
    .min(1, 'El correo es obligatorio')
    .email('Correo no válido'),
  contrasena: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña es obligatoria'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
