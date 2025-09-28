import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listUsers } from '@/features/users/api';
import { createUser, deleteUser, isSuperAdmin, updateUser, type UserDto } from '@/api/usersApi';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { CheckCircle, Edit3, Loader2, MoreVertical, Trash2, UserPlus, Users, XCircle } from 'lucide-react';

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
  const [activeActionUserId, setActiveActionUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [editApproved, setEditApproved] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const roleOptions = useMemo(
    () => [
      'SUPER_ADMIN',
      'ORG_ADMIN',
      'WAREHOUSE_MANAGER',
      'INVENTORY_CONTROLLER',
      'OPERATOR',
      'VIEWER',
      'AUDITOR'
    ],
    []
  );

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

  const edit = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UserDto> }) =>
      updateUser(id, payload),
    onSuccess: () => {
      toast.success('User updated successfully', {
        description: 'Changes saved and user information refreshed.'
      });
      qc.invalidateQueries({ queryKey: ['users'] });
      resetEditState();
    },
    onError: (mutationError: any) => {
      console.error('Failed to update user:', mutationError);
      const errorMessage = mutationError?.message || 'Unable to update user';
      setEditError(errorMessage);
      toast.error('Failed to update user', { description: errorMessage });
    }
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully', {
        description: 'The user has been removed from the system.'
      });
      qc.invalidateQueries({ queryKey: ['users'] });
      closeDeleteDialog();
    },
    onError: (mutationError: any) => {
      console.error('Failed to delete user:', mutationError);
      const errorMessage = mutationError?.message || 'Unable to delete user';
      toast.error('Failed to delete user', { description: errorMessage });
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

  const openEditDialog = (user: UserDto) => {
    setSelectedUser(user);
    setEditEmail(user.email || '');
    setEditDisplayName(user.displayName || '');
    setEditCompanyName(user.companyName || '');
    setEditRoles(user.roles ?? []);
    setEditApproved(Boolean(user.approved));
    setEditError(null);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setEditError(null);
  };

  const handleEditSubmit = () => {
    if (!selectedUser) return;
    if (!editEmail.trim()) {
      setEditError('Email is required');
      return;
    }
    if (!validateEmail(editEmail.trim())) {
      setEditError('Please provide a valid email address');
      return;
    }

    edit.mutate({
      id: selectedUser.id,
      payload: {
        email: editEmail.trim(),
        displayName: editDisplayName.trim() || undefined,
        companyName: editCompanyName.trim() || undefined,
        roles: editRoles,
        approved: editApproved
      }
    });
  };

  const resetEditState = () => {
    closeEditDialog();
  };

  const openDeleteDialog = (user: UserDto) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const toggleRole = (role: string, checked: boolean) => {
    setEditRoles(prev => {
      if (checked) {
        if (prev.includes(role)) return prev;
        return [...prev, role];
      }
      return prev.filter(r => r !== role);
    });
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
                    <th className="p-4 font-semibold text-gray-900 text-right">Actions</th>
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
                      <td className="p-4 text-right">
                        <Popover
                          open={activeActionUserId === u.id}
                          onOpenChange={(open) =>
                            setActiveActionUserId(open ? u.id : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open actions</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 space-y-2 p-3">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                setActiveActionUserId(null);
                                openEditDialog(u);
                              }}
                            >
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit user
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setActiveActionUserId(null);
                                openDeleteDialog(u);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete user
                            </Button>
                          </PopoverContent>
                        </Popover>
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

      {/* Edit User Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog();
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details, roles, and approval status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={editEmail}
                onChange={(event) => {
                  setEditEmail(event.target.value);
                  if (editError) setEditError(null);
                }}
                placeholder="user@example.com"
                disabled={edit.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-display-name">Display name</Label>
              <Input
                id="edit-display-name"
                value={editDisplayName}
                onChange={(event) => setEditDisplayName(event.target.value)}
                placeholder="Jane Doe"
                disabled={edit.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company-name">Company name</Label>
              <Input
                id="edit-company-name"
                value={editCompanyName}
                onChange={(event) => setEditCompanyName(event.target.value)}
                placeholder="Acme Corp"
                disabled={edit.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roleOptions.map(role => {
                  const checked = editRoles.includes(role);
                  return (
                    <label
                      key={role}
                      className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-gray-700"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleRole(role, value === true)
                        }
                        disabled={edit.isPending}
                      />
                      <span className="uppercase tracking-wide text-xs font-semibold text-gray-600">
                        {role.replace(/_/g, ' ')}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <Label htmlFor="edit-approved">Approved</Label>
                <p className="text-sm text-gray-500">
                  Approved users can access the system.
                </p>
              </div>
              <Switch
                id="edit-approved"
                checked={editApproved}
                onCheckedChange={(value) => setEditApproved(value)}
                disabled={edit.isPending}
              />
            </div>
            {editError && (
              <p className="text-sm text-red-600">{editError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeEditDialog}
              disabled={edit.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEditSubmit}
              disabled={edit.isPending}
            >
              {edit.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog();
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The user will lose access immediately.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-medium">{selectedUser?.email}</span>?
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={remove.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (!selectedUser) return;
                remove.mutate(selectedUser.id);
              }}
              disabled={remove.isPending}
            >
              {remove.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


