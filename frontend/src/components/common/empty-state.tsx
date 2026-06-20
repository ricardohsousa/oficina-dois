import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <Card className={`border-dashed bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="mb-4 p-4 rounded-full bg-slate-200/50">
          <Icon className="h-12 w-12 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        {description && <p className="text-sm text-slate-600 text-center mb-6 max-w-sm">{description}</p>}
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
