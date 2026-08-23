import api from '../api/axios';

// --- Interfaces ---
export interface AuthResponse {
  message: string;
  idUsuario: number;
  nombre: string;
  correo: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
  tipo: 'INGRESO' | 'GASTO';
}

export interface TransaccionRequest {
  monto: number;
  descripcion: string;
  fecha: string;
  idUsuario: number;
  idCategoria: number;
}

export interface Transaccion {
  idTransaccion: number;
  monto: number;
  descripcion: string;
  fecha: string;
  categoria: Categoria;
}

export interface BalanceResponse {
  totalIngresos: number;
  totalGastos: number;
  balanceTotal: number;
}

// --- Servicios ---
export const loginUser = (credentials: LoginRequest) =>
  api.post<AuthResponse>('/auth/login', credentials);

export const registerUser = (userData: RegisterRequest) =>
  api.post<AuthResponse>('/auth/register', userData);

export const getCategorias = () =>
  api.get<Categoria[]>('/categorias');

export const getTransaccionesUsuario = (idUsuario: number) =>
  api.get<Transaccion[]>(`/transacciones/usuario/${idUsuario}`);

export const getBalanceUsuario = (idUsuario: number) =>
  api.get<BalanceResponse>(`/transacciones/balance/usuario/${idUsuario}`);

export const crearTransaccion = (transaccion: TransaccionRequest) =>
  api.post<Transaccion>('/transacciones', transaccion);

export const actualizarTransaccion = (id: number, transaccion: TransaccionRequest) =>
  api.put<Transaccion>(`/transacciones/${id}`, transaccion);

export const eliminarTransaccion = (id: number) =>
  api.delete(`/transacciones/${id}`);

export interface CrearCategoriaDTO {
  nombre: string;
  tipo: 'INGRESO' | 'GASTO';
}

export const crearCategoria = async (data: CrearCategoriaDTO) => {
  return await api.post<Categoria>('/categorias', data);
};