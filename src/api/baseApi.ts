import axios from 'axios';
import { env } from '@/shared/config/env';
import { supabase } from '@/shared/config/supabase';

export const http = axios.create({ baseURL: env.apiBaseUrl });

http.interceptors.request.use(async (config) => {
  const session = (await supabase.auth.getSession()).data.session;
  if (session?.access_token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  if (env.orgId) config.headers!['X-Org-Id'] = env.orgId;
  if (env.warehouseId) config.headers!['X-Warehouse-Id'] = env.warehouseId;
  return config;
});


