import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listUsers } from '@/features/users/api';
import { createUser } from '@/api/usersApi';
import { useState } from 'react';
import { Button } from '@/shared/ui/Button';

export function UsersPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['users'], queryFn: listUsers });
  const [email, setEmail] = useState('');
  const create = useMutation({
    mutationFn: createUser,
    onSuccess: () => { setEmail(''); qc.invalidateQueries({ queryKey: ['users'] }); }
  });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <div className="mb-4 flex items-center gap-2">
        <input className="border rounded p-2 text-sm" placeholder="user@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <Button size="sm" onClick={() => email && create.mutate(email)} disabled={create.isPending}>Create</Button>
      </div>
      {isLoading && <div>Loading…</div>}
      {error && <div className="text-red-600">Failed to load</div>}
      <div className="overflow-x-auto border rounded bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Email</th>
              <th className="p-2">Approved</th>
              <th className="p-2">Super Admin</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.approved ? 'Yes' : 'No'}</td>
                <td className="p-2">{u.superAdmin ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


