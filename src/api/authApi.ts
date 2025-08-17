import { supabase } from '@/shared/config/supabase';
import { http } from './baseApi';

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  return (await supabase.auth.getSession()).data.session;
}

export type AuthStatus = { approved: boolean; roles?: string[]; permissions?: string[] };
export async function getAuthStatus() {
  const { data } = await http.get<AuthStatus>('/auth/status');
  return data;
}

export async function bootstrapRoles() {
  await http.post('/auth/bootstrap', {});
}


