import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { AppShell } from '@/components/app/app-shell';
import { RouteGuard } from '@/components/app/route-guard';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { AuditoriaPage } from '@/pages/auditoria-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { LoginPage } from '@/pages/login-page';
import { OficinasPage } from '@/pages/oficinas-page';
import { OficinasVisualizacaoPage } from '@/pages/oficinas-visualizacao-page';
import { VoluntarioCadastroPage } from '@/pages/voluntario-cadastro-page';
import { VoluntarioDetalhePage } from '@/pages/voluntario-detalhe-page';
import { VoluntariosListagemPage } from '@/pages/voluntarios-listagem-page';
import { VoluntariosVisualizacaoPage } from '@/pages/voluntarios-visualizacao-page';

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
            {/* Dashboard: acessível para todos autenticados */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Voluntários: diferentes visões por role */}
            {/* Coordenador: gerenciamento completo */}
            <Route
              path="/voluntarios"
              element={
                <RouteGuard allowedRoles={['coordenador_geral', 'professor']}>
                  <Outlet />
                </RouteGuard>
              }
            >
              <Route path="" element={<VoluntariosListagemPage />} />
              <Route path="novo" element={<VoluntarioCadastroPage />} />
            </Route>
            <Route
              path="/voluntarios/:id"
              element={
                <RouteGuard allowedRoles={['coordenador_geral']}>
                  <VoluntarioDetalhePage />
                </RouteGuard>
              }
            />
            {/* Voluntário: visualização apenas das oficinas que participa */}
            <Route
              path="/voluntarios-view"
              element={
                <RouteGuard allowedRoles={['voluntario']}>
                  <VoluntariosVisualizacaoPage />
                </RouteGuard>
              }
            />

            {/* Oficinas: diferentes visões por role */}
            {/* Coordenador e Professor: gerenciamento */}
            <Route
              path="/oficinas"
              element={
                <RouteGuard allowedRoles={['coordenador_geral', 'professor']}>
                  <OficinasPage />
                </RouteGuard>
              }
            />
            {/* Voluntário: visualização apenas */}
            <Route
              path="/oficinas-view"
              element={
                <RouteGuard allowedRoles={['voluntario']}>
                  <OficinasVisualizacaoPage />
                </RouteGuard>
              }
            />

            {/* Auditoria: apenas coordenador_geral */}
            <Route
              path="/auditoria"
              element={
                <RouteGuard allowedRoles={['coordenador_geral']}>
                  <AuditoriaPage />
                </RouteGuard>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
