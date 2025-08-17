export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  r2PublicBaseUrl: (import.meta.env.VITE_R2_PUBLIC_BASE_URL as string) || '',
  orgId: (import.meta.env.VITE_ORG_ID as string) || '',
  warehouseId: (import.meta.env.VITE_WAREHOUSE_ID as string) || '',
};


