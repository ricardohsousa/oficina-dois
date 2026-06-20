export enum UserRole {
  COORDENADOR_GERAL = "coordenador_geral",
  PROFESSOR = "professor",
  VOLUNTARIO = "voluntario",
}

export type UserRoleType = keyof typeof UserRole;

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.COORDENADOR_GERAL]: "Coordenador Geral - Administra toda a plataforma",
  [UserRole.PROFESSOR]: "Professor - Gerencia oficinas e voluntários",
  [UserRole.VOLUNTARIO]: "Voluntário - Participa de oficinas",
};

export const isValidRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};
