import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/session';
import { login } from '@/services/auth/login';
import { obterUsuarioAutenticado } from '@/services/auth/me';
import type { AuthenticatedUser } from '@/services/auth/types';

type AuthContextValue = {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    obterUsuarioAutenticado()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        clearAccessToken();
        setUser(null);
      })
      .finally(() => {
        setIsBootstrapping(false);
      });
  }, []);

  const handleLogin = async (email: string, senha: string) => {
    const result = await login({ email, senha });
    setAccessToken(result.accessToken);
    setUser(result.user);
  };

  const handleLogout = () => {
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isBootstrapping,
        login: handleLogin,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
