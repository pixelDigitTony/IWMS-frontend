import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/api/baseApi';
import { Button } from '@/components/ui/button';

type PendingUser = { id: string; email: string };

async function listPending() {
  const { data } = await http.get<PendingUser[]>('/admin/pending-users');
  return data;
}

async function approveUser(id: string) {
  await http.post(`/admin/pending-users/${id}/approve`, {});
}

export function AdminApprovalsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['pendingUsers'], queryFn: listPending });
  const approve = useMutation({
    mutationFn: approveUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pendingUsers'] })
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Approval Queue</h1>
      {isLoading && <div>Loading…</div>}
      <div className="space-y-2">
        {data?.map(u => (
          <div key={u.id} className="bg-white border rounded p-3 flex items-center justify-between">
            <div>{u.email}</div>
            <Button size="sm" onClick={() => approve.mutate(u.id)} disabled={approve.isPending}>Approve</Button>
          </div>
        ))}
        {data && data.length === 0 && <div className="text-sm text-gray-600">No pending users</div>}
      </div>
    </div>
  );
}


