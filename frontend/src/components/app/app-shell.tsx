import type { ReactNode } from 'react';
import { ClipboardList, Home, LogOut, School, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Avatar } from '@/components/common/avatar';
import { RoleBadge } from '@/components/common/role-badge';

interface MenuItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const allItems: MenuItem[] = [
  { to: '/dashboard', label: 'Visão geral', icon: Home, roles: ['coordenador_geral', 'professor', 'voluntario'] },
  { to: '/voluntarios', label: 'Voluntários', icon: Users, roles: ['coordenador_geral', 'professor'] },
  { to: '/voluntarios-view', label: 'Voluntários', icon: Users, roles: ['voluntario'] },
  { to: '/oficinas', label: 'Oficinas', icon: School, roles: ['coordenador_geral', 'professor'] },
  { to: '/oficinas-view', label: 'Oficinas', icon: School, roles: ['voluntario'] },
  { to: '/auditoria', label: 'Auditoria', icon: ClipboardList, roles: ['coordenador_geral'] }
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = allItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(18,89,120,0.14),_transparent_32%),linear-gradient(180deg,_#f6fbff_0%,_#eef4f8_48%,_#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 flex-col rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-6 text-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.24)] lg:flex">
          <div className="space-y-3">
            <div className="inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              ELLP
            </div>
            <div>
              <p className="font-serif text-2xl tracking-tight text-white">Controle de Voluntariado</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:bg-white/8 hover:text-white'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 mb-3">
              {user && <Avatar name={user.nome} role={user.role} size="sm" />}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{user?.nome}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>
            {user && (
              <div className="mb-3">
                <RoleBadge role={user.role} />
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              className="w-full justify-center bg-white text-slate-950 hover:bg-slate-100"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">ELLP</p>
                <p className="font-serif text-xl text-slate-950">Controle de Voluntariado</p>
              </div>
              <div className="flex items-center gap-2">
                {user && <Avatar name={user.nome} role={user.role} size="sm" />}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate('/login', { replace: true });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <nav className="mt-4 grid grid-cols-2 gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium',
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </header>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
