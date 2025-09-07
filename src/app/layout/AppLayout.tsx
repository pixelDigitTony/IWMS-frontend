import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAuthStatus, isSuperAdmin } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { supabase } from '@/shared/config/supabase';

export function AppLayout() {
  const navigate = useNavigate();
  const { data: status } = useQuery({ queryKey: ['authStatus'], queryFn: getAuthStatus });

  async function logout() {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
      <aside className="row-span-2 bg-gray-900 text-white p-4">
        <div className="text-lg font-semibold mb-4">IWMS</div>
        <nav className="space-y-1 text-sm">
          <NavItem to="/dashboard" label="Dashboard" />
          {status && isSuperAdmin(status) && <NavItem to="/admin/approvals" label="Approval Queue" />}
          <NavItem to="/users" label="Users" />
        </nav>
      </aside>
      <header className="col-start-2 flex items-center justify-between px-4 border-b bg-white">
        <div className="font-medium">Inter‑Warehouse Management</div>
        <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
      </header>
      <main className="col-start-2 p-4 bg-gray-50 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded px-3 py-2 hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
      }
    >
      {label}
    </NavLink>
  );
}


