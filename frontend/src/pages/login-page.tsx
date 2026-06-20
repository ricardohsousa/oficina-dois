import { useState } from 'react';
import { AlertCircle, LockKeyhole, Mail, LogIn } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-8 animate-fadeIn">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Hero Section - Desktop Only */}
        <section className="hidden lg:block animate-slideUp">
          <div className="max-w-2xl space-y-6">
            {/* Logo/Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Projeto ELLP
              </span>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
                Sistema de Controle de Voluntários
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Gerencie oficinas, voluntários e acompanhe todas as atividades do seu projeto ELLP de forma centralizada e organizada.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-sm">Gestão completa de voluntários</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-sm">Controle de oficinas e atividades</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-sm">Auditoria completa de ações</span>
              </div>
            </div>
          </div>
        </section>

        {/* Login Card - Desktop & Mobile */}
        <section className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm mx-auto">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Projeto ELLP
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              Bem-vindo
            </h1>
            <p className="text-sm text-slate-400">
              Acesse o sistema de controle de voluntários
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-8 lg:p-10 shadow-2xl">
            {/* Card Header */}
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl lg:text-3xl font-bold text-white font-serif">
                Entrar no sistema
              </h2>
              <p className="text-sm text-slate-400">
                Use suas credenciais UTFPR para acessar
              </p>
            </div>

            {/* Error Alert */}
            {error ? (
              <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Falha ao entrar</AlertTitle>
                <AlertDescription>{error.problem?.detail ?? error.message}</AlertDescription>
              </Alert>
            ) : null}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  E-mail
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@utfpr.edu.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-12 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="senha" className="block text-sm font-medium text-slate-300">
                  Senha
                </label>
                <div className="relative group">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={isLoading}
                    className="pl-12 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="h-5 w-5" />
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span> Entrando...
                  </>
                ) : (
                  'Entrar no sistema'
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-slate-700" />
                <span className="text-xs text-slate-500">ou</span>
                <div className="h-px flex-1 bg-slate-700" />
              </div>

              {/* Credentials Info */}
              <div className="rounded-lg bg-slate-800/30 border border-slate-700/30 p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Credenciais de teste
                </p>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>
                    <span className="font-mono bg-slate-900/50 px-2 py-1 rounded">coordenador@ellp.com</span>
                  </p>
                  <p>
                    <span className="font-mono bg-slate-900/50 px-2 py-1 rounded">professor@ellp.com</span>
                  </p>
                  <p>
                    <span className="font-mono bg-slate-900/50 px-2 py-1 rounded">voluntario@ellp.com</span>
                  </p>
                  <p className="text-slate-500 mt-2">Senha: Test123!</p>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-700/30 text-center text-xs text-slate-500">
              <p>
                Projeto ELLP - Ensino Lúdico de Lógica e Programação
                <br />
                UTFPR | 2026
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
