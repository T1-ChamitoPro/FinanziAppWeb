import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { AppError } from '../../middlewares/errorHandler';
import { RegisterInput, LoginInput } from './auth.schema';

export interface AuthResponse {
  message: string;
  idUsuario: number;
  nombre: string;
  correo: string;
}

export class AuthService {
  async registrar(data: RegisterInput): Promise<AuthResponse> {
    const existingUser = await prisma.usuario.findUnique({
      where: { correo: data.correo },
    });

    if (existingUser) {
      throw new AppError('El correo ya se encuentra registrado.', 400);
    }

    // Hashear contraseña con BCrypt (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(data.contrasena, salt);

    const usuario = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        correo: data.correo,
        contrasena: contrasenaEncriptada,
      },
    });

    return {
      message: 'Usuario registrado exitosamente',
      idUsuario: Number(usuario.idUsuario),
      nombre: usuario.nombre,
      correo: usuario.correo,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const usuario = await prisma.usuario.findUnique({
      where: { correo: data.correo },
    });

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Comparar la contraseña plana contra el hash almacenado
    const isMatch = await bcrypt.compare(data.contrasena, usuario.contrasena);
    if (!isMatch) {
      throw new AppError('Credenciales inválidas', 401);
    }

    return {
      message: 'Inicio de sesión exitoso',
      idUsuario: Number(usuario.idUsuario),
      nombre: usuario.nombre,
      correo: usuario.correo,
    };
  }
}

export const authService = new AuthService();
