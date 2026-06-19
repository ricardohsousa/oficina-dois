import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { AppShell } from '@/components/app/app-shell';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { AuditoriaPage } from '@/pages/auditoria-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { LoginPage } from '@/pages/login-page';
import { OficinasPage } from '@/pages/oficinas-page';
import { VoluntarioCadastroPage } from '@/pages/voluntario-cadastro-page';
import { VoluntarioDetalhePage } from '@/pages/voluntario-detalhe-page';
import { VoluntariosListagemPage } from '@/pages/voluntarios-listagem-page';

function ProtectedLayout() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        Carregando sessão...
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/voluntarios" element={<VoluntariosListagemPage />} />
            <Route path="/voluntarios/novo" element={<VoluntarioCadastroPage />} />
            <Route path="/voluntarios/:id" element={<VoluntarioDetalhePage />} />
            <Route path="/oficinas" element={<OficinasPage />} />
            <Route path="/auditoria" element={<AuditoriaPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
