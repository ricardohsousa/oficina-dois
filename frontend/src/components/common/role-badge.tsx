import { getRoleColor, getRoleLabel } from '@/constants/role-colors';

interface RoleBadgeProps {
  role?: string | null;
  className?: string;
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  if (!role) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
        Usuário
      </span>
    );
  }

  const roleColor = getRoleColor(role);
  const roleLabel = getRoleLabel(role);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${roleColor.badge} ${className}`}
    >
      {roleLabel}
    </span>
  );
}
