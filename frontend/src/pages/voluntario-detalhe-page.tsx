import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Download, FilePlus2, Pencil, Plus, UserX } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  useAtualizarVoluntario,
  useInativarVoluntario,
  useObterVoluntario
} from '@/hooks/use-voluntario-mutations';
import { ApiError } from '@/lib/http';
import { associarVoluntarioOficina } from '@/services/atuacoes/associar-voluntario-oficina';
import { listarHistoricoDoVoluntario } from '@/services/atuacoes/listar-historico-do-voluntario';
import type {
  AssociarVoluntarioOficinaDto,
  HistoricoAtuacaoResponseDto
} from '@/services/atuacoes/types';
import { listarOficinas } from '@/services/oficinas/listar-oficinas';
import type { OficinaResponseDto } from '@/services/oficinas/types';
import { downloadTermoVoluntariado } from '@/services/termos/download-termo-voluntariado';
import { gerarTermoVoluntariado } from '@/services/termos/gerar-termo-voluntariado';
import type { TermoVoluntariadoResponseDto } from '@/services/termos/types';
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

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));

const toFormValues = (v: VoluntarioResponseDto): VoluntarioFormValues => ({
  nomeCompleto: v.nomeCompleto,
  cpf: v.cpf,
  dataNascimento: v.dataNascimento,
  email: v.email,
  telefone: v.telefone,
  endereco: v.endereco,
  dataEntrada: v.dataEntrada
});

type AtuacaoFormValues = {
  oficinaId: string;
  dataInicio: string;
  dataFim: string;
  cargaHoraria: string;
};

const emptyAtuacaoForm: AtuacaoFormValues = {
  oficinaId: '',
  dataInicio: '',
  dataFim: '',
  cargaHoraria: ''
};

const toAssociacaoDto = (values: AtuacaoFormValues): AssociarVoluntarioOficinaDto => ({
  oficinaId: values.oficinaId,
  dataInicio: values.dataInicio,
  ...(values.dataFim ? { dataFim: values.dataFim } : {}),
  ...(values.cargaHoraria ? { cargaHoraria: Number(values.cargaHoraria) } : {})
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

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
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
  const [oficinas, setOficinas] = useState<OficinaResponseDto[]>([]);
  const [historico, setHistorico] = useState<HistoricoAtuacaoResponseDto[]>([]);
  const [atuacaoValues, setAtuacaoValues] = useState<AtuacaoFormValues>(emptyAtuacaoForm);
  const [termo, setTermo] = useState<TermoVoluntariadoResponseDto | null>(null);
  const [isLoadingRelacionamentos, setIsLoadingRelacionamentos] = useState(true);
  const [relacionamentosError, setRelacionamentosError] = useState<ApiError | null>(null);
  const [isAssociando, setIsAssociando] = useState(false);
  const [associacaoError, setAssociacaoError] = useState<ApiError | null>(null);
  const [isGerandoTermo, setIsGerandoTermo] = useState(false);
  const [termoError, setTermoError] = useState<ApiError | null>(null);
  const [isDownloadingTermo, setIsDownloadingTermo] = useState(false);

  // ── busca inicial ──
  useEffect(() => {
    if (id) void fetch(id);
  }, [id, fetch]);

  // ── sincroniza form quando voluntário é carregado ──
  useEffect(() => {
    if (voluntario) setFormValues(toFormValues(voluntario));
  }, [voluntario]);

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoadingRelacionamentos(true);
    setRelacionamentosError(null);

    Promise.all([listarOficinas(), listarHistoricoDoVoluntario(id)])
      .then(([oficinasData, historicoData]) => {
        setOficinas(oficinasData);
        setHistorico(historicoData);
      })
      .catch((caughtError) => {
        setRelacionamentosError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
      })
      .finally(() => {
        setIsLoadingRelacionamentos(false);
      });
  }, [id]);

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

  const activeOficinas = useMemo(() => oficinas.filter((oficina) => oficina.status === 'ativa'), [oficinas]);

  const historicoAtivo = useMemo(
    () => historico.filter((item) => !item.dataFim),
    [historico]
  );

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

  const handleAssociarOficina = async () => {
    if (!id) {
      return;
    }

    setIsAssociando(true);
    setAssociacaoError(null);

    try {
      await associarVoluntarioOficina(id, toAssociacaoDto(atuacaoValues));
      const historicoData = await listarHistoricoDoVoluntario(id);
      setHistorico(historicoData);
      setAtuacaoValues(emptyAtuacaoForm);
    } catch (caughtError) {
      setAssociacaoError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsAssociando(false);
    }
  };

  const handleGerarTermo = async () => {
    if (!id) {
      return;
    }

    setIsGerandoTermo(true);
    setTermoError(null);

    try {
      const response = await gerarTermoVoluntariado(id);
      setTermo(response);
    } catch (caughtError) {
      setTermoError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsGerandoTermo(false);
    }
  };

  const handleDownloadTermo = async () => {
    if (!termo) {
      return;
    }

    setIsDownloadingTermo(true);
    setTermoError(null);

    try {
      const blob = await downloadTermoVoluntariado(termo.downloadUrl);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = termo.nomeArquivo;
      link.click();
      URL.revokeObjectURL(url);
    } catch (caughtError) {
      setTermoError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsDownloadingTermo(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container max-w-6xl space-y-6">
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
        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Termo e situação operacional</CardTitle>
              <CardDescription>Gere o termo de adesão e acompanhe o vínculo do voluntário com as oficinas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {termoError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Falha ao processar termo</AlertTitle>
                  <AlertDescription>{termoError.problem?.detail ?? termoError.message}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <p className="text-sm text-muted-foreground">Oficinas em andamento</p>
                  <p className="mt-1 text-3xl font-semibold">{historicoAtivo.length}</p>
                </div>
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <p className="text-sm text-muted-foreground">Histórico registrado</p>
                  <p className="mt-1 text-3xl font-semibold">{historico.length}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-dashed p-4">
                <p className="font-medium">Termo de voluntariado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gere um novo PDF quando os dados cadastrais estiverem completos e atualizados.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button type="button" onClick={() => void handleGerarTermo()} disabled={isGerandoTermo}>
                    <FilePlus2 className="h-4 w-4" />
                    {isGerandoTermo ? 'Gerando...' : 'Gerar termo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleDownloadTermo()}
                    disabled={!termo || isDownloadingTermo}
                  >
                    <Download className="h-4 w-4" />
                    {isDownloadingTermo ? 'Baixando...' : 'Baixar último termo'}
                  </Button>
                </div>
                {termo ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Último termo gerado em {formatDateTime(termo.createdAt)}.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Associar a oficina</CardTitle>
              <CardDescription>Somente oficinas ativas podem receber novos vínculos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {associacaoError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Falha ao associar oficina</AlertTitle>
                  <AlertDescription>{associacaoError.problem?.detail ?? associacaoError.message}</AlertDescription>
                </Alert>
              ) : null}

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleAssociarOficina();
                }}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Oficina</label>
                  <Select
                    value={atuacaoValues.oficinaId}
                    onValueChange={(value) => setAtuacaoValues((current) => ({ ...current, oficinaId: value }))}
                    disabled={isAssociando}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma oficina ativa" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeOficinas.map((oficina) => (
                        <SelectItem key={oficina.id} value={oficina.id}>
                          {oficina.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="atuacaoDataInicio" className="text-sm font-medium">
                      Data de início
                    </label>
                    <Input
                      id="atuacaoDataInicio"
                      type="date"
                      value={atuacaoValues.dataInicio}
                      disabled={isAssociando}
                      onChange={(event) =>
                        setAtuacaoValues((current) => ({ ...current, dataInicio: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="atuacaoDataFim" className="text-sm font-medium">
                      Data de fim
                    </label>
                    <Input
                      id="atuacaoDataFim"
                      type="date"
                      value={atuacaoValues.dataFim}
                      disabled={isAssociando}
                      onChange={(event) => setAtuacaoValues((current) => ({ ...current, dataFim: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="cargaHoraria" className="text-sm font-medium">
                    Carga horária
                  </label>
                  <Input
                    id="cargaHoraria"
                    type="number"
                    min="0"
                    placeholder="Ex: 40"
                    value={atuacaoValues.cargaHoraria}
                    disabled={isAssociando}
                    onChange={(event) =>
                      setAtuacaoValues((current) => ({ ...current, cargaHoraria: event.target.value }))
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isAssociando || !voluntario?.ativo}>
                    <Plus className="h-4 w-4" />
                    {isAssociando ? 'Associando...' : 'Registrar vínculo'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Histórico de atuação</CardTitle>
              <CardDescription>Registros de oficinas vinculadas ao voluntário, com período e carga horária.</CardDescription>
            </CardHeader>
            <CardContent>
              {relacionamentosError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Não foi possível carregar o histórico</AlertTitle>
                  <AlertDescription>{relacionamentosError.problem?.detail ?? relacionamentosError.message}</AlertDescription>
                </Alert>
              ) : isLoadingRelacionamentos ? (
                <TableSkeleton />
              ) : historico.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Oficina</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Carga horária</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historico.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.oficina.nome}</p>
                            <p className="text-xs text-muted-foreground">{item.oficina.descricao}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(item.dataInicio)}
                          {item.dataFim ? ` - ${formatDate(item.dataFim)}` : ' - Em andamento'}
                        </TableCell>
                        <TableCell>{item.cargaHoraria ? `${item.cargaHoraria}h` : 'Não informada'}</TableCell>
                        <TableCell>
                          <Badge variant={item.oficina.status === 'ativa' ? 'success' : 'secondary'}>
                            {item.oficina.status === 'ativa' ? 'Oficina ativa' : 'Oficina inativa'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum vínculo com oficinas foi registrado para este voluntário.</p>
              )}
            </CardContent>
          </Card>
        </section>
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
