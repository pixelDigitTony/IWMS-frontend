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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setBusy(true);
    setErrors({});
    setSuccess(false);

    try {
      await signInWithPassword(email, password);
      setSuccess(true);
      toast.success('Welcome back!', {
        description: 'You have been successfully signed in.'
      });

      // Navigate after a short delay to show success state
      setTimeout(() => {
        navigate('/gate');
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
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
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-4xl">✓</div>
              <h3 className="text-lg font-semibold text-green-700">Welcome back!</h3>
              <p className="text-sm text-gray-600">
                You have been successfully signed in.
              </p>
              <p className="text-xs text-gray-500">
                Redirecting...
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                  disabled={busy}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  className={errors.password ? 'border-red-500 focus:border-red-500' : ''}
                  disabled={busy}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              <Button className="w-full" disabled={busy} type="submit">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {busy ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="text-sm text-center">
                No account?{' '}
                <Link
                  className="underline text-blue-600 hover:text-blue-800"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


