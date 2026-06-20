import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../../shared/errors/http-error';
import type { AuthTokenPayload } from '../../../application/auth/services/token-service';
import { canAccess } from '../../../shared/types/permissions';
import type { Permission, Resource } from '../../../shared/types/permissions';
import { UserRole } from '../../../shared/types/permissions';

export type AuthenticatedRequest = Request & {
  auth?: AuthTokenPayload;
};

/**
 * Middleware that checks if user has permission to access a resource
 * @param resource - The resource being accessed (e.g., 'voluntarios', 'oficinas')
 * @param action - The action being performed (e.g., 'CREATE', 'READ', 'UPDATE', 'DELETE')
 */
export const createPermissionMiddleware =
  (resource: Resource, action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE') =>
  (request: AuthenticatedRequest, response: Response, next: NextFunction): void => {
    const auth = request.auth;

    if (!auth) {
      next(
        new HttpError({
          status: 401,
          title: 'Não autenticado',
          detail: 'Token de autenticação não fornecido ou inválido.',
          type: 'https://ellp.local/errors/unauthenticated',
        })
      );
      return;
    }

    const userRole = auth.role as UserRole;

    if (!Object.values(UserRole).includes(userRole)) {
      next(
        new HttpError({
          status: 403,
          title: 'Role inválido',
          detail: `O role '${userRole}' não é reconhecido.`,
          type: 'https://ellp.local/errors/invalid-role',
        })
      );
      return;
    }

    const hasPermission = canAccess(userRole, resource, action);

    if (!hasPermission) {
      next(
        new HttpError({
          status: 403,
          title: 'Acesso negado',
          detail: `Você não tem permissão para ${action} em ${resource}. Role necessário: admin ou superior.`,
          type: 'https://ellp.local/errors/insufficient-permission',
        })
      );
      return;
    }

    next();
  };
