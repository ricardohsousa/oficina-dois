import { CheckCircle, Circle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AtividadeDto } from '@/services/oficinas/types';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const STATUS_ICONS = {
  planejada: Circle,
  em_progresso: Clock,
  concluida: CheckCircle,
  cancelada: XCircle
};

const STATUS_COLORS = {
  planejada: 'text-slate-400',
  em_progresso: 'text-blue-500',
  concluida: 'text-green-500',
  cancelada: 'text-red-500'
};

const STATUS_BADGE = {
  planejada: 'secondary',
  em_progresso: 'default',
  concluida: 'success',
  cancelada: 'destructive'
} as const;

interface CronogramaAtividadesProps {
  atividades?: AtividadeDto[];
  ano: number;
}

export function CronogramaAtividades({ atividades = [], ano }: CronogramaAtividadesProps) {
  if (atividades.length === 0) {
    return (
      <Card className="border-white/70 bg-white/85">
        <CardHeader>
          <CardTitle className="text-lg">Cronograma de Atividades</CardTitle>
          <CardDescription>Nenhuma atividade cadastrada para esta oficina</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Criar mapa de atividades por mês
  const atividadesPorMes: Record<number, AtividadeDto[]> = {};
  for (let mes = 1; mes <= 12; mes++) {
    atividadesPorMes[mes] = [];
  }

  atividades.forEach((atividade) => {
    atividade.meses.forEach((mesItem) => {
      if (!atividadesPorMes[mesItem.mes]) {
        atividadesPorMes[mesItem.mes] = [];
      }
      atividadesPorMes[mesItem.mes].push(atividade);
    });
  });

  return (
    <Card className="border-white/70 bg-white/85">
      <CardHeader>
        <CardTitle className="text-lg">Cronograma de Atividades - {ano}</CardTitle>
        <CardDescription>Visualize as atividades planejadas para cada mês do ano</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline Visual */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-4 min-w-max">
              {MESES.map((mes, index) => {
                const atividadesMes = atividadesPorMes[index + 1] || [];
                const temAtividade = atividadesMes.length > 0;

                return (
                  <div key={mes} className="flex flex-col items-center gap-2">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                        temAtividade
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {mes.slice(0, 3)}
                    </div>
                    {temAtividade && (
                      <div className="text-xs font-semibold text-blue-600">
                        {atividadesMes.length}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista Detalhada por Mês */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MESES.map((mes, index) => {
              const mesNum = index + 1;
              const atividadesMes = atividadesPorMes[mesNum] || [];

              return (
                <div key={mes} className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <h3 className="font-semibold text-sm mb-3">{mes}</h3>

                  {atividadesMes.length === 0 ? (
                    <p className="text-xs text-slate-500">Sem atividades</p>
                  ) : (
                    <div className="space-y-2">
                      {atividadesMes.map((atividade) => {
                        const Icon = STATUS_ICONS[atividade.status];
                        return (
                          <div key={atividade.id} className="text-xs space-y-1">
                            <div className="flex items-start gap-2">
                              <Icon className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${STATUS_COLORS[atividade.status]}`} />
                              <span className="font-medium text-slate-700">{atividade.nome}</span>
                            </div>
                            {atividade.meses.find((m) => m.mes === mesNum)?.descricao && (
                              <p className="text-slate-600 ml-5">
                                {atividade.meses.find((m) => m.mes === mesNum)?.descricao}
                              </p>
                            )}
                            <Badge variant={STATUS_BADGE[atividade.status] as any} className="ml-5 text-xs">
                              {atividade.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            {Object.entries(STATUS_ICONS).map(([status, Icon]) => (
              <div key={status} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`} />
                <span className="text-xs text-slate-600 capitalize">{status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
