import { useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { VoluntarioForm } from '@/components/voluntarios/voluntario-form';
import {
  emptyVoluntarioForm,
  toCriarVoluntarioDto,
  type VoluntarioFormValues
} from '@/components/voluntarios/voluntario-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useCriarVoluntario } from '@/hooks/use-voluntario-mutations';

export function VoluntarioCadastroPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<VoluntarioFormValues>(emptyVoluntarioForm);

  const { isLoading, error, execute } = useCriarVoluntario((voluntario) => {
    navigate(`/voluntarios/${voluntario.id}`, { replace: true });
  });

  const errorMessage =
    error?.problem?.errors?.map((item) => `${item.field}: ${item.message}`).join(' ') ??
    error?.problem?.detail ??
    error?.message ??
    null;

  const handleSubmit = async () => {
    try {
      await execute(toCriarVoluntarioDto(values));
    } catch {
      // erro já capturado no hook
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate('/voluntarios')}
            aria-label="Voltar para listagem"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Cadastrar voluntário</h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados abaixo para registrar um novo voluntário.
            </p>
          </div>
        </div>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao cadastrar</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Dados do voluntário</CardTitle>
            <CardDescription>Todos os campos são obrigatórios.</CardDescription>
          </CardHeader>
          <CardContent>
            <VoluntarioForm
              values={values}
              disabled={isLoading}
              onChange={setValues}
              onSubmit={() => void handleSubmit()}
              onCancel={() => navigate('/voluntarios')}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
