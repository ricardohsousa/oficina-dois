export const ROLE_COLORS = {
  coordenador_geral: {
    bg: 'bg-amber-50',
    bgLight: 'bg-amber-100',
    text: 'text-amber-900',
    textMuted: 'text-amber-700',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800 border border-amber-300',
    button: 'bg-amber-600 hover:bg-amber-700',
    accentBg: '#fffbeb',
    accentColor: '#d97706',
    accentBorder: '#fde68a'
  },
  professor: {
    bg: 'bg-purple-50',
    bgLight: 'bg-purple-100',
    text: 'text-purple-900',
    textMuted: 'text-purple-700',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-800 border border-purple-300',
    button: 'bg-purple-600 hover:bg-purple-700',
    accentBg: '#f5f3ff',
    accentColor: '#7c3aed',
    accentBorder: '#ddd6fe'
  },
  voluntario: {
    bg: 'bg-emerald-50',
    bgLight: 'bg-emerald-100',
    text: 'text-emerald-900',
    textMuted: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    accentBg: '#f0fdf4',
    accentColor: '#059669',
    accentBorder: '#bbf7d0'
  }
} as const;

export function getRoleColor(role?: string | null) {
  if (!role) return ROLE_COLORS.voluntario;
  const normalizedRole = role.toLowerCase().replace(' ', '_');
  return ROLE_COLORS[normalizedRole as keyof typeof ROLE_COLORS] || ROLE_COLORS.voluntario;
}

export function getRoleLabel(role?: string | null): string {
  if (!role) return 'Voluntário';
  const labels: Record<string, string> = {
    coordenador_geral: 'Coordenador',
    professor: 'Professor',
    voluntario: 'Voluntário'
  };
  return labels[role] || role;
}
