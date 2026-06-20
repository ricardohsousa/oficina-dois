import { Mail, Phone, Users, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ProfessorDto, VoluntarioDto } from '@/services/oficinas/types';

interface ProfessoresVoluntariosProps {
  professores?: ProfessorDto[];
  voluntarios?: VoluntarioDto[];
}

export function ProfessoresVoluntarios({ professores = [], voluntarios = [] }: ProfessoresVoluntariosProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Professores */}
      <Card className="border-white/70 bg-white/85">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            Professores Responsáveis
          </CardTitle>
          <CardDescription>{professores.length} professor(es) associado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {professores.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum professor associado a esta oficina</p>
          ) : (
            <div className="space-y-3">
              {professores.map((professor) => (
                <div key={professor.id} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{professor.nome}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Mail className="h-3 w-3" />
                        {professor.email}
                      </div>
                    </div>
                    <Badge className="bg-blue-600 text-white">Professor</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voluntários */}
      <Card className="border-white/70 bg-white/85">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            Voluntários Participantes
          </CardTitle>
          <CardDescription>{voluntarios.length} voluntário(s) inscrito(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {voluntarios.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum voluntário associado a esta oficina</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {voluntarios.map((voluntario) => (
                <div
                  key={voluntario.id}
                  className={`rounded-lg border p-3 ${
                    voluntario.ativo
                      ? 'border-emerald-100 bg-emerald-50'
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{voluntario.nomeCompleto}</p>
                      {!voluntario.ativo && (
                        <Badge variant="secondary" className="text-xs">
                          Inativo
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {voluntario.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {voluntario.telefone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
