import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/shared/config/supabase';
import { useQueryClient } from '@tanstack/react-query';

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
      // Invalidate auth-related caches
      qc.invalidateQueries({ queryKey: ['authStatus'] });

      if (event === 'SIGNED_OUT') {
        if (!location.pathname.startsWith('/login')) navigate('/login', { replace: true });
      }
      if (event === 'SIGNED_IN') {
        navigate('/gate', { replace: true });
      }
      if (event === 'TOKEN_REFRESHED') {
        // keep app running; tokens rotate silently
      }
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [navigate, location.pathname, qc]);

  return <>{children}</>;
}


