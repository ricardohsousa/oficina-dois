import { getRoleColor } from '@/constants/role-colors';

interface AvatarProps {
  name: string;
  role?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ name, role, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-2xl'
  };

  if (!name) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg font-semibold text-white bg-slate-400 ${sizeClasses[size]} ${className}`}
        title="Usuario"
      >
        ?
      </div>
    );
  }

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const roleColor = role ? getRoleColor(role) : getRoleColor('voluntario');

  return (
    <div
      className={`flex items-center justify-center rounded-lg font-semibold text-white ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: roleColor.accentColor
      }}
      title={name}
    >
      {initials}
    </div>
  );
}
