import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/config/supabase';
import { getAuthStatus } from '@/features/auth/status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, RefreshCw, LogOut, Mail } from 'lucide-react';

export function AuthGatePage() {
  const [state, setState] = useState<'checking'|'verify-email'|'pending-approval'|'ready'>('checking');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    refreshStatus();
  }, [navigate]);

  async function refreshStatus() {
    setLoading(true);
    setError(null);
    setState('checking');

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }

      const emailConfirmed = !!session.user.email_confirmed_at;
      if (!emailConfirmed) {
        setState('verify-email');
        setMessage('Please verify your email to continue.');
        return;
      }

      const status = await getAuthStatus();
      if (!status.approved) {
        setState('pending-approval');
        setMessage('Your account is pending approval by a Super Admin.');
        return;
      }

      setState('ready');
      toast.success('Welcome!', { description: 'Access granted.' });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Auth status check failed:', err);
      setError('Unable to verify your account status. Please try again.');
      setState('pending-approval');
      setMessage('Unable to determine approval status. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user?.email) {
        await supabase.auth.resend({ type: 'signup', email: user.email });
        setMessage('Verification email resent. Check your inbox.');
        toast.success('Verification email sent!', {
          description: `Check your inbox at ${user.email}`
        });
      }
    } catch (err: any) {
      console.error('Failed to resend verification:', err);
      setError('Failed to send verification email. Please try again.');
      toast.error('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Account Check</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          {state === 'checking' && (
            <div className="text-center space-y-4">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Checking your account status...</p>
            </div>
          )}

          {state === 'verify-email' && (
            <div className="space-y-4">
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 text-yellow-500 mb-2" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Verification Required</h3>
                <p className="text-gray-600">{message}</p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={resendVerification} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Sending...' : 'Resend verification'}
                </Button>
                <Button variant="secondary" onClick={refreshStatus} disabled={loading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh status
                </Button>
                <Button
                  variant="outline"
                  onClick={async ()=>{ await supabase.auth.signOut(); navigate('/login', { replace: true }); }}
                  disabled={loading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}

          {state === 'pending-approval' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Pending Approval</h3>
                <p className="text-gray-600">{message}</p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="secondary" onClick={refreshStatus} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {loading ? 'Checking...' : 'Refresh status'}
                </Button>
                <Button
                  variant="outline"
                  onClick={async ()=>{ await supabase.auth.signOut(); navigate('/login', { replace: true }); }}
                  disabled={loading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


