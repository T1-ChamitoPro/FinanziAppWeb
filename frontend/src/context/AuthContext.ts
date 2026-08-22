import { createContext } from 'react';
import type { LoginRequest, RegisterRequest } from '../services/finanziappService';

interface User {
  idUsuario: number;
  nombre: string;
  correo: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);