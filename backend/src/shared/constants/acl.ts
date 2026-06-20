import { UserRole, Permission } from '../types/permissions';

/**
 * Access Control List Matrix
 * Define which roles have access to which resources and actions
 */
export const ACL_MATRIX = {
  [UserRole.COORDENADOR_GERAL]: {
    voluntarios: [Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE],
    oficinas: [Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE],
    atuacoes: [Permission.CREATE, Permission.READ],
    auditoria: [Permission.READ],
    dashboard: [Permission.READ],
  },
  [UserRole.PROFESSOR]: {
    voluntarios: [Permission.CREATE, Permission.READ],
    oficinas: [Permission.READ, Permission.UPDATE],
    atuacoes: [Permission.CREATE, Permission.READ],
    auditoria: [],
    dashboard: [Permission.READ],
  },
  [UserRole.VOLUNTARIO]: {
    voluntarios: [Permission.READ],
    oficinas: [Permission.READ],
    atuacoes: [],
    auditoria: [],
    dashboard: [Permission.READ],
  },
} as const;

/**
 * Roles allowed for admin-only operations
 */
export const ADMIN_ONLY_ROLES = [UserRole.COORDENADOR_GERAL] as const;

/**
 * Roles allowed to access voluntarios (any level)
 */
export const ROLES_WITH_VOLUNTARIOS_ACCESS = [
  UserRole.COORDENADOR_GERAL,
  UserRole.PROFESSOR,
] as const;

/**
 * Roles allowed to access oficinas (any level)
 */
export const ROLES_WITH_OFICINAS_ACCESS = [
  UserRole.COORDENADOR_GERAL,
  UserRole.PROFESSOR,
  UserRole.VOLUNTARIO,
] as const;

/**
 * Map human-readable role names
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.COORDENADOR_GERAL]: 'Coordenador Geral',
  [UserRole.PROFESSOR]: 'Professor',
  [UserRole.VOLUNTARIO]: 'Voluntário',
};
