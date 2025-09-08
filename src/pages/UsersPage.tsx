import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listUsers } from '@/features/users/api';
import { createUser, isSuperAdmin } from '@/api/usersApi';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, UserPlus, Users, CheckCircle, XCircle } from 'lucide-react';

export function UsersPage() {
  const qc = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
    retry: 3,
    staleTime: 30000
  });

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const create = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setEmail('');
      setValidationError(null);
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!', {
        description: 'The user has been added to the system.'
      });
    },
    onError: (error: any) => {
      console.error('Failed to create user:', error);
      const errorMessage = error?.message || 'Failed to create user';
      setValidationError(errorMessage);
      toast.error('Failed to create user', { description: errorMessage });
    }
  });

  const handleCreateUser = () => {
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    setValidationError(null);
    create.mutate(email.trim());
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Create User Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="user@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={validationError ? 'border-red-500 focus:border-red-500' : ''}
                  disabled={create.isPending}
                />
                {validationError && (
                  <p className="text-red-500 text-sm mt-1">{validationError}</p>
                )}
              </div>
              <Button
                onClick={handleCreateUser}
                disabled={create.isPending || !email.trim()}
                className="px-6"
              >
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {create.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({data?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                Failed to load users.{' '}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => refetch()}
                  className="ml-2 text-red-700 hover:text-red-800 p-0 h-auto"
                >
                  Try again
                </Button>
              </div>
            </div>
          )}

          {data && data.length > 0 && (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left border-b">
                    <th className="p-4 font-semibold text-gray-900">Email</th>
                    <th className="p-4 font-semibold text-gray-900">Display Name</th>
                    <th className="p-4 font-semibold text-gray-900">Status</th>
                    <th className="p-4 font-semibold text-gray-900">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-900">{u.email}</td>
                      <td className="p-4 text-gray-600">{u.displayName || '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {u.approved ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-green-700 font-medium">Approved</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-yellow-500" />
                              <span className="text-yellow-600 font-medium">Pending</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {isSuperAdmin(u) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data && data.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first user above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


