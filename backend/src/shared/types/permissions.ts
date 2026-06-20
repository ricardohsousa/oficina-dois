export enum UserRole {
  COORDENADOR_GERAL = 'coordenador_geral',
  PROFESSOR = 'professor',
  VOLUNTARIO = 'voluntario',
}

export type UserRoleType = keyof typeof UserRole;

export enum Permission {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export type PermissionType = keyof typeof Permission;

export type Resource = 'voluntarios' | 'oficinas' | 'atuacoes' | 'auditoria' | 'dashboard';

export type ACLEntry = {
  [key in Resource]?: PermissionType[];
};

export type RolePermissions = {
  [key in UserRole]: ACLEntry;
};

export function canAccess(role: UserRole, resource: Resource, action: PermissionType): boolean {
  const rolePermissions: RolePermissions = {
    [UserRole.COORDENADOR_GERAL]: {
      voluntarios: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      oficinas: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      atuacoes: ['CREATE', 'READ'],
      auditoria: ['READ'],
      dashboard: ['READ'],
    },
    [UserRole.PROFESSOR]: {
      voluntarios: ['CREATE', 'READ'],
      oficinas: ['READ', 'UPDATE'],
      atuacoes: ['CREATE', 'READ'],
      auditoria: [],
      dashboard: ['READ'],
    },
    [UserRole.VOLUNTARIO]: {
      voluntarios: ['READ'],
      oficinas: ['READ'],
      atuacoes: [],
      auditoria: [],
      dashboard: ['READ'],
    },
  };

  const permissions = rolePermissions[role]?.[resource] ?? [];
  return permissions.includes(action);
}

export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}
