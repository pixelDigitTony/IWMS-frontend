import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/shared/config/supabase';
import { bootstrapRoles } from '@/features/auth/status';
import { Button } from '@/shared/ui/Button';

export function AuthRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setInfo(null);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      try { await bootstrapRoles(); } catch {}
      if (!data.session) {
        setInfo('Check your email to verify your account, then sign in.');
      } else {
        navigate('/gate');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <Button className="w-full" disabled={busy}>Create account</Button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {info && <div className="text-green-700 text-sm">{info}</div>}
      </form>
      <div className="mt-4 text-sm">Already have an account? <Link className="underline" to="/login">Sign in</Link></div>
    </div>
  );
}


