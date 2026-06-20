import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../../../shared/types/user-role";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nome: string;
        role: string;
      };
    }
  }
}

export const createAuthorizationMiddleware = (allowedRoles: UserRole[]) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const user = request.user;

    if (!user) {
      response.status(401).json({
        type: "https://example.com/errors/unauthorized",
        status: 401,
        title: "Não autenticado",
        detail: "Você precisa estar autenticado para acessar este recurso",
      });
      return;
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      response.status(403).json({
        type: "https://example.com/errors/forbidden",
        status: 403,
        title: "Acesso negado",
        detail: `Você não tem permissão para acessar este recurso. Roles permitidas: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };
};
