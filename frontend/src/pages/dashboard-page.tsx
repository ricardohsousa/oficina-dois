import { useEffect, useState } from 'react';
import { Activity, FileStack, School, Users } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { listarRegistrosAuditoria } from '@/services/auditoria/listar-registros-auditoria';
import { listarOficinas } from '@/services/oficinas/listar-oficinas';
import { listarVoluntarios } from '@/services/voluntarios/listar-voluntarios';

const metrics = [
  { key: 'voluntariosAtivos', label: 'Voluntários ativos', icon: Users },
  { key: 'voluntariosInativos', label: 'Voluntários inativos', icon: Users },
  { key: 'oficinasAtivas', label: 'Oficinas ativas', icon: School },
  { key: 'auditoriasRecentes', label: 'Auditorias recentes', icon: Activity }
] as const;

type DashboardState = Record<(typeof metrics)[number]['key'], number>;

export function DashboardPage() {
  const [state, setState] = useState<DashboardState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listarVoluntarios(), listarOficinas(), listarRegistrosAuditoria()])
      .then(([voluntarios, oficinas, auditorias]) => {
        setState({
          voluntariosAtivos: voluntarios.filter((item) => item.ativo).length,
          voluntariosInativos: voluntarios.filter((item) => !item.ativo).length,
          oficinasAtivas: oficinas.filter((item) => item.status === 'ativa').length,
          auditoriasRecentes: auditorias.length
        });
        setError(null);
      })
      .catch((caughtError: Error) => {
        setError(caughtError.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="space-y-6 px-1 py-6 lg:px-2 lg:py-8">
      <section className="rounded-[32px] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">Dashboard</p>
          <h1 className="font-serif text-4xl tracking-tight text-slate-950">Resumo do sistema</h1>
          <p className="text-sm leading-7 text-slate-600">Acompanhe os principais números e acesse os módulos pelo menu.</p>
        </div>
      </section>

      {error ? (
        <Alert variant="destructive">
          <FileStack className="h-4 w-4" />
          <AlertTitle>Falha ao carregar painel</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.key} className="border-white/70 bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="text-3xl">
                    {isLoading || !state ? <Skeleton className="h-8 w-16" /> : state[metric.key]}
                  </CardTitle>
                </div>
                <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <Card className="border-white/70 bg-white/80">
        <CardHeader>
          <CardTitle className="text-xl">Resumo</CardTitle>
          <CardDescription>Visão rápida do que está sendo acompanhado no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
          <p>
            O sistema centraliza o cadastro de voluntários, o controle das oficinas e o acompanhamento das ações
            registradas no projeto.
          </p>
          <p>
            As atuações e os termos de voluntariado ficam vinculados ao cadastro de cada voluntário, enquanto a
            auditoria reúne o histórico das alterações mais importantes.
          </p>
        </CardContent>
      </Card>

    </main>
  );
}
