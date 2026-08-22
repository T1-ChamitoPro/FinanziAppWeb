import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../services/finanziappService';
import { loginUser, registerUser } from '../services/finanziappService';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('finanzia_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleAuthSuccess = (data: AuthResponse) => {
    const userData = {
      idUsuario: data.idUsuario,
      nombre: data.nombre,
      correo: data.correo,
    };
    setUser(userData);
    localStorage.setItem('finanzia_user', JSON.stringify(userData));
  };

  const login = async (credentials: LoginRequest) => {
    const response = await loginUser(credentials);
    handleAuthSuccess(response.data);
  };

  const register = async (userData: RegisterRequest) => {
    const response = await registerUser(userData);
    handleAuthSuccess(response.data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finanzia_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};