import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Pencil, UserX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { InativarVoluntarioDialog } from '@/components/voluntarios/inativar-voluntario-dialog';
import { VoluntarioForm } from '@/components/voluntarios/voluntario-form';
import {
  toAtualizarVoluntarioDto,
  type VoluntarioFormValues
} from '@/components/voluntarios/voluntario-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAtualizarVoluntario,
  useInativarVoluntario,
  useObterVoluntario
} from '@/hooks/use-voluntario-mutations';
import type { VoluntarioResponseDto } from '@/services/voluntarios/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        date
      );
};

const toFormValues = (v: VoluntarioResponseDto): VoluntarioFormValues => ({
  nomeCompleto: v.nomeCompleto,
  cpf: v.cpf,
  dataNascimento: v.dataNascimento,
  email: v.email,
  telefone: v.telefone,
  endereco: v.endereco,
  dataEntrada: v.dataEntrada
});

// ── Skeleton ──────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────

export function VoluntarioDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { voluntario, isLoading, error: fetchError, fetch } = useObterVoluntario();
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<VoluntarioFormValues | null>(null);
  const [showInativarDialog, setShowInativarDialog] = useState(false);

  // ── busca inicial ──
  useEffect(() => {
    if (id) void fetch(id);
  }, [id, fetch]);

  // ── sincroniza form quando voluntário é carregado ──
  useEffect(() => {
    if (voluntario) setFormValues(toFormValues(voluntario));
  }, [voluntario]);

  // ── hook de atualização ──
  const {
    isLoading: isSaving,
    error: saveError,
    execute: executeAtualizar
  } = useAtualizarVoluntario((updated) => {
    setIsEditing(false);
    setFormValues(toFormValues(updated));
  });

  // ── hook de inativação ──
  const {
    isLoading: isInativando,
    error: inativarError,
    execute: executeInativar
  } = useInativarVoluntario(() => {
    setShowInativarDialog(false);
    if (id) void fetch(id); // recarrega para exibir status atualizado
  });

  // ── mensagens de erro ──
  const fetchErrorMessage =
    fetchError?.problem?.detail ?? fetchError?.message ?? 'Não foi possível carregar o voluntário.';

  const saveErrorMessage =
    saveError?.problem?.errors?.map((item) => `${item.field}: ${item.message}`).join(' ') ??
    saveError?.problem?.detail ??
    saveError?.message ??
    null;

  // ── handlers ──
  const handleSave = async () => {
    if (!id || !formValues) return;
    try {
      await executeAtualizar(id, toAtualizarVoluntarioDto(formValues));
    } catch {
      // erro capturado no hook
    }
  };

  const handleCancelEdit = () => {
    if (voluntario) setFormValues(toFormValues(voluntario));
    setIsEditing(false);
  };

  const handleInativar = async (data: { dataSaida: string }) => {
    if (!id) return;
    try {
      await executeInativar(id, data);
    } catch {
      // erro capturado no hook
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container max-w-3xl space-y-6">
        {/* cabeçalho */}
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
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {isLoading ? 'Carregando...' : (voluntario?.nomeCompleto ?? 'Voluntário')}
              </h1>
              {voluntario ? (
                <Badge variant={voluntario.ativo ? 'success' : 'secondary'}>
                  {voluntario.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              ) : null}
            </div>
            {voluntario ? (
              <p className="text-sm text-muted-foreground">
                Entrada em {formatDate(voluntario.dataEntrada)}
                {voluntario.dataSaida ? ` · Saída em ${formatDate(voluntario.dataSaida)}` : ''}
              </p>
            ) : null}
          </div>
          {/* ações */}
          {voluntario?.ativo && !isEditing ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-1.5" />
                Editar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setShowInativarDialog(true)}
              >
                <UserX className="h-4 w-4 mr-1.5" />
                Inativar
              </Button>
            </div>
          ) : null}
        </div>

        {/* erro de busca */}
        {fetchError && !isLoading ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{fetchErrorMessage}</p>
              <Button type="button" variant="outline" onClick={() => id && void fetch(id)}>
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {/* erro de salvamento */}
        {saveErrorMessage ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao salvar</AlertTitle>
            <AlertDescription>{saveErrorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {/* conteúdo principal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isEditing ? 'Editar dados' : 'Dados do voluntário'}
            </CardTitle>
            {isEditing ? (
              <CardDescription>
                CPF não pode ser alterado. Altere os demais campos e salve.
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <DetailSkeleton />
            ) : formValues && isEditing ? (
              <VoluntarioForm
                values={formValues}
                isEditing
                disabled={isSaving}
                onChange={setFormValues}
                onSubmit={() => void handleSave()}
                onCancel={handleCancelEdit}
              />
            ) : voluntario && !isEditing ? (
              <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                {(
                  [
                    ['Nome completo', voluntario.nomeCompleto],
                    ['CPF', voluntario.cpf],
                    ['Data de nascimento', formatDate(voluntario.dataNascimento)],
                    ['E-mail', voluntario.email],
                    ['Telefone', voluntario.telefone],
                    ['Endereço', voluntario.endereco, true],
                    ['Data de entrada', formatDate(voluntario.dataEntrada)],
                    ...(voluntario.dataSaida
                      ? [['Data de saída', formatDate(voluntario.dataSaida)] as [string, string]]
                      : [])
                  ] as [string, string, boolean?][]
                ).map(([label, value, full]) => (
                  <div key={label} className={full ? 'sm:col-span-2' : undefined}>
                    <dt className="font-medium text-muted-foreground">{label}</dt>
                    <dd className="mt-0.5">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de inativação */}
      {showInativarDialog && voluntario ? (
        <InativarVoluntarioDialog
          nomeCompleto={voluntario.nomeCompleto}
          isLoading={isInativando}
          error={inativarError}
          onConfirm={(data) => void handleInativar(data)}
          onCancel={() => setShowInativarDialog(false)}
        />
      ) : null}
    </main>
  );
}
