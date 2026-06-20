import type { ReactNode } from 'react';
import { useCanAccess } from '@/hooks/use-can-access';
import { Button } from '@/components/ui/button';
import type { PermissionType, Resource } from '@/types/permissions';

interface PermissionButtonProps {
  resource: Resource;
  action: PermissionType;
  children: ReactNode;
  fallback?: ReactNode;
  [key: string]: unknown;
}

/**
 * Botão que apenas aparece se o usuário tem permissão para a ação
 */
export function PermissionButton({
  resource,
  action,
  children,
  fallback = null,
  ...buttonProps
}: PermissionButtonProps) {
  const canAccess = useCanAccess(resource, action);

  if (!canAccess) {
    return fallback;
  }

  return <Button {...buttonProps}>{children}</Button>;
}
