import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/config/supabase';

type Props = { children: ReactNode; requiredPermission?: string };

export function RequireAuth({ children, requiredPermission }: Props) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        navigate('/login', { replace: true, state: { from: location.pathname } });
        return;
      }
      if (!requiredPermission) {
        if (mounted) { setAllowed(true); setLoading(false); }
        return;
      }
      const perms = (session.user.user_metadata?.permissions as string[]) || [];
      const roles = (session.user.user_metadata?.roles as string[]) || [];
      const has = perms.includes(requiredPermission) || roles.includes('SUPER_ADMIN');
      if (mounted) { setAllowed(has); setLoading(false); }
      if (!has) navigate('/');
    })();
    return () => { mounted = false; };
  }, [requiredPermission, navigate, location.pathname]);

  if (loading) return <div className="p-6">Checking session…</div>;
  return allowed ? <>{children}</> : null;
}


