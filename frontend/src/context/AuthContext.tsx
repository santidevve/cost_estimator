import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  businessName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, businessName: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeaders: () => { Authorization: string; 'Content-Type': string };
  apiUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getApiUrl = (): string => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // Enlace dinámico a la misma IP local del equipo que corre la API en el puerto 5000
  return `http://${hostname}:5000/api`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = getApiUrl();

  useEffect(() => {
    const storedToken = localStorage.getItem('cost_estimator_token');
    const storedUser = localStorage.getItem('cost_estimator_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión.');
      }

      localStorage.setItem('cost_estimator_token', data.token);
      localStorage.setItem('cost_estimator_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor.');
      return false;
    }
  };

  const register = async (email: string, password: string, businessName: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, businessName }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrarse.');
      }

      localStorage.setItem('cost_estimator_token', data.token);
      localStorage.setItem('cost_estimator_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('cost_estimator_token');
    localStorage.removeItem('cost_estimator_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        getAuthHeaders,
        apiUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
