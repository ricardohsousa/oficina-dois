import { useState } from 'react';
import { AlertCircle, LockKeyhole, Mail } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/http';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await login(email, senha);
      navigate(redirectTo ?? '/dashboard', { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError : new ApiError(0));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.18),_transparent_28%),linear-gradient(140deg,_#02131d_0%,_#0f172a_38%,_#f8fafc_38%,_#edf4f7_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
              Projeto ELLP
            </div>
            <h1 className="font-serif text-5xl leading-tight tracking-tight text-cyan-300">
              Sistema de Controle de Voluntários
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              Faça login para acessar o sistema.
            </p>
          </div>
        </section>

        <section className="lg:hidden">
          <div className="mb-6 space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Projeto ELLP</p>
            <h1 className="font-serif text-4xl tracking-tight text-slate-950">Sistema de Controle de Voluntários</h1>
            <p className="text-sm text-slate-600">Faça login para acessar o sistema.</p>
          </div>
        </section>

        <Card className="border-transparent bg-white/92 shadow-[0_20px_80px_rgba(15,23,42,0.24)]">
          <CardHeader className="space-y-3">
            <CardTitle className="font-serif text-3xl text-slate-950">Acessar sistema</CardTitle>
            <CardDescription>Entre com o e-mail e a senha cadastrados para continuar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Falha no login</AlertTitle>
                <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
              </Alert>
            ) : null}

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit();
              }}
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    placeholder="admin@ellp.com"
                    value={email}
                    disabled={isLoading}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="senha" className="text-sm font-medium text-slate-700">
                  Senha
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="senha"
                    type="password"
                    className="pl-9"
                    placeholder="Sua senha"
                    value={senha}
                    disabled={isLoading}
                    onChange={(event) => setSenha(event.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-slate-950 hover:bg-slate-800" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
