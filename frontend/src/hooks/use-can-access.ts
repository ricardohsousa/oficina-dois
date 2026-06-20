import { useAuth } from '@/contexts/auth-context';
import { canAccess, type PermissionType, type Resource, UserRole } from '@/types/permissions';

/**
 * Hook para verificar se o usuário autenticado tem permissão para acessar um recurso
 * @param resource - O recurso (e.g., 'voluntarios', 'oficinas', 'auditoria')
 * @param action - A ação (e.g., 'CREATE', 'READ', 'UPDATE', 'DELETE')
 * @returns boolean indicando se o usuário tem permissão
 */
export function useCanAccess(resource: Resource, action: PermissionType): boolean {
  const { user } = useAuth();

  if (!user) {
    return false;
  }

  const userRole = user.role as UserRole;

  if (!Object.values(UserRole).includes(userRole)) {
    return false;
  }

  return canAccess(userRole, resource, action);
}

/**
 * Hook para verificar se o usuário tem um dos roles permitidos
 * @param allowedRoles - Array de roles permitidos
 * @returns boolean indicando se o usuário tem um dos roles
 */
export function useHasRole(allowedRoles: string[]): boolean {
  const { user } = useAuth();

  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role);
}

/**
 * Hook para obter o role do usuário autenticado
 * @returns O role do usuário ou null se não autenticado
 */
export function useUserRole(): string | null {
  const { user } = useAuth();
  return user?.role ?? null;
}

/**
 * Hook para verificar se o usuário é admin
 * @returns boolean indicando se o usuário é coordenador_geral
 */
export function useIsAdmin(): boolean {
  return useHasRole(['coordenador_geral']);
}

/**
 * Hook para verificar se o usuário é professor
 * @returns boolean indicando se o usuário é professor
 */
export function useIsProfessor(): boolean {
  return useHasRole(['professor']);
}

/**
 * Hook para verificar se o usuário é voluntário
 * @returns boolean indicando se o usuário é voluntário
 */
export function useIsVoluntario(): boolean {
  return useHasRole(['voluntario']);
}
