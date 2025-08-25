import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/shared/config/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { registerSelf } from '@/api/usersApi';

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
      // Hit public /users/register with email to seed user_info based on auth.users
      
      if (data.user && data.user.email) {
        try { await registerSelf(data.user.email); } catch {}
        toast.message('Verification email sent', { description: 'Please verify your email to continue.' });
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
            <Button className="w-full" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {info && <div className="text-green-700 text-sm">{info}</div>}
            <div className="text-sm">Already have an account? <Link className="underline" to="/login">Sign in</Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


