import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Pencil, Plus, School, Slash, UserPlus } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CronogramaAtividades } from '@/components/oficinas/cronograma-atividades';
import { ProfessoresVoluntarios } from '@/components/oficinas/professores-voluntarios';
import { AdicionarVoluntarioModal } from '@/components/oficinas/adicionar-voluntario-modal';
import { ApiError } from '@/lib/http';
import { atualizarOficina } from '@/services/oficinas/atualizar-oficina';
import { criarOficina } from '@/services/oficinas/criar-oficina';
import { inativarOficina } from '@/services/oficinas/inativar-oficina';
import { listarOficinas } from '@/services/oficinas/listar-oficinas';
import { associarVoluntarioOficina } from '@/services/atuacoes/associar-voluntario-oficina';
import type { CriarOficinaDto, OficinaResponseDto } from '@/services/oficinas/types';
import { useAuth } from '@/contexts/auth-context';

type OficinaFormValues = {
  nome: string;
  descricao: string;
  ano: string;
  dataInicio: string;
  dataFim: string;
};

const emptyForm: OficinaFormValues = {
  nome: '',
  descricao: '',
  ano: String(new Date().getFullYear()),
  dataInicio: '',
  dataFim: ''
};

const toDto = (values: OficinaFormValues): CriarOficinaDto => ({
  nome: values.nome,
  descricao: values.descricao,
  ano: Number(values.ano),
  dataInicio: values.dataInicio,
  ...(values.dataFim ? { dataFim: values.dataFim } : {})
});

const toFormValues = (oficina: OficinaResponseDto): OficinaFormValues => ({
  nome: oficina.nome,
  descricao: oficina.descricao,
  ano: String(oficina.ano),
  dataInicio: oficina.dataInicio,
  dataFim: oficina.dataFim ?? ''
});

const formatDate = (value: string | null) => {
  if (!value) {
    return 'Em andamento';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`));
};

export function OficinasPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<OficinaResponseDto[]>([]);
  const [values, setValues] = useState<OficinaFormValues>(emptyForm);
  const [selected, setSelected] = useState<OficinaResponseDto | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [showAddVoluntario, setShowAddVoluntario] = useState<{ oficinaId: string; oficinaNome: string } | null>(null);

  const isEditing = Boolean(selected);
  const isProfessor = user?.role === 'professor';
  const isCoordenador = user?.role === 'coordenador_geral';

  const load = async () => {
    setIsLoading(true);

    try {
      const data = await listarOficinas();
      setItems(data);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const counters = useMemo(
    () => ({
      total: items.length,
      ativas: items.filter((item) => item.status === 'ativa').length,
      inativas: items.filter((item) => item.status !== 'ativa').length
    }),
    [items]
  );

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);

    try {
      if (selected) {
        await atualizarOficina(selected.id, toDto(values));
      } else {
        await criarOficina(toDto(values));
      }

      setValues(emptyForm);
      setSelected(null);
      await load();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsSaving(false);
    }
  };

  const handleInativar = async (oficina: OficinaResponseDto) => {
    setError(null);

    try {
      await inativarOficina(oficina.id);
      await load();

      if (selected?.id === oficina.id) {
        setSelected(null);
        setValues(emptyForm);
      }
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    }
  };

  const handleAddVoluntario = async (voluntarioId: string) => {
    if (!showAddVoluntario) return;

    await associarVoluntarioOficina(voluntarioId, {
      oficinaId: showAddVoluntario.oficinaId,
      dataInicio: new Date().toISOString().split('T')[0],
    });

    await load();
  };

  return (
    <main className="space-y-6 px-1 py-6 lg:px-2 lg:py-8">
      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <School className="h-5 w-5 text-cyan-700" />
              Gestão de oficinas
            </CardTitle>
            <CardDescription>Cadastre oficinas do projeto, revise o período e faça inativação lógica quando necessário.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="mt-1 text-3xl font-semibold">{counters.total}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Ativas</p>
              <p className="mt-1 text-3xl font-semibold text-emerald-900">{counters.ativas}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
              <p className="text-sm text-slate-700">Inativas</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{counters.inativas}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/85">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">{isEditing ? 'Editar oficina' : 'Nova oficina'}</CardTitle>
              <CardDescription>Preencha os dados mínimos definidos para gestão das oficinas.</CardDescription>
            </div>
            {isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelected(null);
                  setValues(emptyForm);
                }}
              >
                Limpar seleção
              </Button>
            ) : null}
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit();
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="nome" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input
                    id="nome"
                    value={values.nome}
                    disabled={isSaving}
                    onChange={(event) => setValues((current) => ({ ...current, nome: event.target.value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="descricao" className="text-sm font-medium">
                    Descrição
                  </label>
                  <textarea
                    id="descricao"
                    className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={values.descricao}
                    disabled={isSaving}
                    onChange={(event) => setValues((current) => ({ ...current, descricao: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="ano" className="text-sm font-medium">
                    Ano
                  </label>
                  <Input
                    id="ano"
                    type="number"
                    min="2020"
                    max="2100"
                    value={values.ano}
                    disabled={isSaving}
                    onChange={(event) => setValues((current) => ({ ...current, ano: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dataInicio" className="text-sm font-medium">
                    Data de início
                  </label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={values.dataInicio}
                    disabled={isSaving}
                    onChange={(event) => setValues((current) => ({ ...current, dataInicio: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dataFim" className="text-sm font-medium">
                    Data de fim
                  </label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={values.dataFim}
                    disabled={isSaving}
                    onChange={(event) => setValues((current) => ({ ...current, dataFim: event.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={isSaving}>
                  <Plus className="h-4 w-4" />
                  {isSaving ? 'Salvando...' : isEditing ? 'Salvar oficina' : 'Cadastrar oficina'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao processar oficinas</AlertTitle>
          <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="border-white/70 bg-white/85">
        <CardHeader>
          <CardTitle className="text-xl">Oficinas cadastradas</CardTitle>
          <CardDescription>Selecione uma oficina para editar, visualizar o cronograma ou faça a inativação lógica.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando oficinas...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma oficina cadastrada</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden bg-white">
                  <div className="flex items-center justify-between p-4 hover:bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === item.id ? null : item.id)
                          }
                          className="text-slate-600 hover:text-slate-900"
                        >
                          {expandedId === item.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-900">{item.nome}</div>
                          <div className="text-sm text-slate-600">{item.descricao}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <div className="text-slate-600">
                          {formatDate(item.dataInicio)} - {formatDate(item.dataFim)}
                        </div>
                        <div className="text-xs text-slate-500">Ano: {item.ano}</div>
                      </div>
                      <Badge variant={item.status === 'ativa' ? 'success' : 'secondary'}>
                        {item.status === 'ativa' ? 'Ativa' : item.status}
                      </Badge>
                      <div className="flex gap-2">
                        {(isCoordenador || isProfessor) && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelected(item);
                              setValues(toFormValues(item));
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {isCoordenador && item.status === 'ativa' && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleInativar(item)}
                          >
                            <Slash className="h-4 w-4" />
                          </Button>
                        )}
                        {item.status === 'ativa' && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            onClick={() =>
                              setShowAddVoluntario({
                                oficinaId: item.id,
                                oficinaNome: item.nome,
                              })
                            }
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandir detalhes */}
                  {expandedId === item.id && (
                    <div className="border-t bg-slate-50/50 p-4 space-y-6">
                      {/* Professores e Voluntários */}
                      <ProfessoresVoluntarios
                        professores={item.professores}
                        voluntarios={item.voluntarios}
                      />

                      {/* Cronograma */}
                      <CronogramaAtividades atividades={item.atividades} ano={item.ano} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para adicionar voluntário */}
      {showAddVoluntario && (
        <AdicionarVoluntarioModal
          oficinaId={showAddVoluntario.oficinaId}
          oficinaNome={showAddVoluntario.oficinaNome}
          voluntariosAtuais={
            items.find((i) => i.id === showAddVoluntario.oficinaId)?.voluntarios ?? []
          }
          onAdd={handleAddVoluntario}
          onClose={() => setShowAddVoluntario(null)}
        />
      )}
    </main>
  );
}
