import { useAuth } from '@/contexts/auth-context';
import { CoordenadorDashboard } from '@/components/dashboards/coordenador-dashboard';
import { ProfessorDashboard } from '@/components/dashboards/professor-dashboard';
import { VoluntarioDashboard } from '@/components/dashboards/voluntario-dashboard';

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'coordenador_geral':
      return <CoordenadorDashboard />;
    case 'professor':
      return <ProfessorDashboard />;
    case 'voluntario':
      return <VoluntarioDashboard />;
    default:
      return <VoluntarioDashboard />;
  }
}
