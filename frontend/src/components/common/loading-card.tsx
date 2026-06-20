import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardProps {
  count?: number;
  variant?: 'small' | 'medium' | 'large';
  className?: string;
}

export function LoadingCard({ count = 1, variant = 'medium', className = '' }: LoadingCardProps) {
  const heights = {
    small: 'h-16',
    medium: 'h-32',
    large: 'h-48'
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className={`border-white/70 bg-white/80 ${className}`}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className={heights[variant]} />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
