import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/config/supabase';

type Props = { children: ReactNode };

export function PublicRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = (await supabase.auth.getSession()).data.session;
      if (!mounted) return;
      if (session) {
        setHasSession(true);
        // Already logged in; send to dashboard (spec)
        navigate('/dashboard', { replace: true, state: { from: location.pathname } });
      } else {
        setHasSession(false);
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [navigate, location.pathname]);

  if (loading) return <div className="p-6">Loading…</div>;
  return hasSession ? null : <>{children}</>;
}


