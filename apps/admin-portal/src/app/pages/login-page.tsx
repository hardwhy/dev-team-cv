import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@dev-team-cv/auth';
import { Button, Input } from '@dev-team-cv/ui';
import { ThemeToggle } from '@dev-team-cv/ui';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--surface)] p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            dev<span className="text-[var(--text-muted)]">team</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Sign in to the admin dashboard</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
            <Button type="submit" loading={loading} className="w-full">Sign In</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
