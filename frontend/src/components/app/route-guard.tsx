import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

/**
 * Componente que protege rotas verificando se o usuário tem um dos roles permitidos
 * Se não autorizado, redireciona para fallbackPath (padrão: /dashboard)
 */
export function RouteGuard({
  children,
  allowedRoles,
  fallbackPath = '/dashboard',
}: RouteGuardProps) {
  const { user, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        Carregando...
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
