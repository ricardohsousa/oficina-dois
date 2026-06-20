import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  gradient?: 'amber' | 'purple' | 'emerald' | 'cyan' | 'none';
}

const gradients = {
  amber: 'bg-gradient-to-br from-white/95 to-amber-50/80',
  purple: 'bg-gradient-to-br from-white/95 to-purple-50/80',
  emerald: 'bg-gradient-to-br from-white/95 to-emerald-50/80',
  cyan: 'bg-gradient-to-br from-white/95 to-cyan-50/80',
  none: 'bg-white/80'
};

export function AnimatedCard({
  title,
  description,
  children,
  className = '',
  interactive = false,
  onClick,
  gradient = 'none'
}: AnimatedCardProps) {
  return (
    <Card
      className={cn(
        'border-white/70 shadow-md overflow-hidden transition-all duration-300 ease-out',
        gradients[gradient],
        interactive && 'cursor-pointer hover:shadow-xl hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
