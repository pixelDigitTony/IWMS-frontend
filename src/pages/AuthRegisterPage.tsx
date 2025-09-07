import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/shared/config/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { registerSelf, RegisterRequest } from '@/api/usersApi';

export function AuthRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Display name validation (optional but if provided, should be reasonable)
    if (displayName && displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    // Company name validation (optional but if provided, should be reasonable)
    if (companyName && companyName.length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
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
      // Sign up with Supabase, including metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || null,
          }
        }
      });
      if (error) throw error;

      // Hit public /users/register with additional data to seed user_info
      if (data.user && data.user.email) {
        const registerRequest: RegisterRequest = {
          email: data.user.email,
          displayName: displayName || undefined,
          companyName: companyName || undefined,
        };
        try {
          await registerSelf(registerRequest);
        } catch (registerError: any) {
          console.warn('Failed to register user info:', registerError);
          // Don't fail the whole registration for this
        }

        setSuccess(true);
        toast.success('Registration successful!', {
          description: 'Please check your email for verification instructions.'
        });

        // Navigate after a short delay to show success state
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
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
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-4xl">✓</div>
              <h3 className="text-lg font-semibold text-green-700">Registration Successful!</h3>
              <p className="text-sm text-gray-600">
                Please check your email for verification instructions.
              </p>
              <p className="text-xs text-gray-500">
                Redirecting to login page...
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

              {/* Display Name Field */}
              <div className="space-y-1">
                <Input
                  placeholder="Display Name (optional)"
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (errors.displayName) {
                      setErrors(prev => ({ ...prev, displayName: '' }));
                    }
                  }}
                  className={errors.displayName ? 'border-red-500 focus:border-red-500' : ''}
                  disabled={busy}
                />
                {errors.displayName && (
                  <p className="text-red-500 text-xs">{errors.displayName}</p>
                )}
              </div>

              {/* Company Name Field */}
              <div className="space-y-1">
                <Input
                  placeholder="Company Name (optional)"
                  type="text"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errors.companyName) {
                      setErrors(prev => ({ ...prev, companyName: '' }));
                    }
                  }}
                  className={errors.companyName ? 'border-red-500 focus:border-red-500' : ''}
                  disabled={busy}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-xs">{errors.companyName}</p>
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

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }
                  }}
                  className={errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}
                  disabled={busy}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                )}
              </div>

              <Button className="w-full" disabled={busy} type="submit">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {busy ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-sm text-center">
                Already have an account?{' '}
                <Link
                  className="underline text-blue-600 hover:text-blue-800"
                  to="/login"
                >
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


