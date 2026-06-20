import { Check, Clock, AlertCircle, X } from 'lucide-react';

type StatusType = 'ativa' | 'inativa' | 'encerrada' | 'cancelada' | 'ativo' | 'inativo' | 'planejada' | 'em_progresso' | 'concluida';

const statusConfig: Record<StatusType, { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  // Oficinas
  ativa: { bg: 'bg-green-100', text: 'text-green-800', icon: Check },
  inativa: { bg: 'bg-slate-100', text: 'text-slate-800', icon: AlertCircle },
  encerrada: { bg: 'bg-slate-100', text: 'text-slate-800', icon: X },
  cancelada: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
  // Voluntários
  ativo: { bg: 'bg-green-100', text: 'text-green-800', icon: Check },
  inativo: { bg: 'bg-slate-100', text: 'text-slate-800', icon: AlertCircle },
  // Atividades
  planejada: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
  em_progresso: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  concluida: { bg: 'bg-green-100', text: 'text-green-800', icon: Check }
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, label, showIcon = true, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const displayLabel = label || status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {displayLabel}
    </span>
  );
}
