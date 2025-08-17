import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPassword } from '@/features/auth/api';
import { Button } from '@/shared/ui/Button';

export function AuthLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await signInWithPassword(email, password);
      navigate('/gate');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <Button className="w-full" disabled={busy}>Sign in</Button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
      <div className="mt-4 text-sm">No account? <Link className="underline" to="/register">Register</Link></div>
    </div>
  );
}


