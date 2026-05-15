import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ApiError } from '@/lib/http';
import type { InativarVoluntarioDto } from '@/services/voluntarios/types';

type InativarVoluntarioDialogProps = {
  nomeCompleto: string;
  isLoading: boolean;
  error: ApiError | null;
  onConfirm: (data: InativarVoluntarioDto) => void;
  onCancel: () => void;
};

export function InativarVoluntarioDialog({
  nomeCompleto,
  isLoading,
  error,
  onConfirm,
  onCancel
}: InativarVoluntarioDialogProps) {
  const [dataSaida, setDataSaida] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ dataSaida });
  };

  const errorMessage =
    error?.problem?.errors?.map((item) => `${item.field}: ${item.message}`).join(' ') ??
    error?.problem?.detail ??
    error?.message ??
    null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Inativar voluntário</h2>
          <p className="text-sm text-muted-foreground">
            Você está prestes a inativar{' '}
            <span className="font-medium text-foreground">{nomeCompleto}</span>. Informe a data de
            saída para continuar.
          </p>
        </div>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao inativar</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dataSaida" className="text-sm font-medium text-foreground">
              Data de saída
            </label>
            <Input
              id="dataSaida"
              type="date"
              value={dataSaida}
              disabled={isLoading}
              onChange={(e) => setDataSaida(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading || !dataSaida}>
              {isLoading ? 'Inativando...' : 'Confirmar inativação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
