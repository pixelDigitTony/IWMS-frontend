import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPassword } from '@/features/auth/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
      toast.success('Signed in');
      navigate('/gate');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
            <Button className="w-full" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="text-sm">No account? <Link className="underline" to="/register">Register</Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


