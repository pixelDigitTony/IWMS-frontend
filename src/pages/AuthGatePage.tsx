import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/config/supabase';
import { getAuthStatus } from '@/features/auth/status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function AuthGatePage() {
  const [state, setState] = useState<'checking'|'verify-email'|'pending-approval'|'ready'>('checking');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshStatus();
  }, [navigate]);

  async function refreshStatus() {
    setState('checking');
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) { navigate('/login', { replace: true }); return; }
    const emailConfirmed = !!session.user.email_confirmed_at;
    if (!emailConfirmed) {
      setState('verify-email');
      setMessage('Please verify your email to continue.');
      return;
    }
    try {
      const status = await getAuthStatus();
      if (!status.approved) {
        setState('pending-approval');
        setMessage('Your account is pending approval by a Super‑Admin.');
        return;
      }
      setState('ready');
      navigate('/dashboard', { replace: true });
    } catch {
      setState('pending-approval');
      setMessage('Unable to determine approval status. Please try again later.');
    }
  }

  async function resendVerification() {
    const user = (await supabase.auth.getUser()).data.user;
    if (user?.email) {
      await supabase.auth.resend({ type: 'signup', email: user.email });
      setMessage('Verification email resent. Check your inbox.');
      toast.message('Verification sent', { description: user.email });
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Account Check</CardTitle>
        </CardHeader>
        <CardContent>
          {state === 'checking' && <div>Checking your account…</div>}
          {state === 'verify-email' && (
            <div className="space-y-3">
              <p>{message}</p>
              <div className="flex gap-3">
                <Button onClick={resendVerification}>Resend verification</Button>
                <Button variant="secondary" onClick={refreshStatus}>Refresh status</Button>
                <Button variant="outline" onClick={async ()=>{ await supabase.auth.signOut(); navigate('/login', { replace: true }); }}>Logout</Button>
              </div>
            </div>
          )}
          {state === 'pending-approval' && (
            <div className="space-y-3">
              <p>{message}</p>
              <div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={refreshStatus}>Refresh status</Button>
                <Button variant="outline" onClick={async ()=>{ await supabase.auth.signOut(); navigate('/login', { replace: true }); }}>Logout</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


