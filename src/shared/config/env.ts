export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  // Prefer new publishable key; fall back to legacy anon key for compatibility
  supabasePublishableKey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string)
    || (import.meta.env.VITE_SUPABASE_ANON_KEY as string),
  r2PublicBaseUrl: (import.meta.env.VITE_R2_PUBLIC_BASE_URL as string) || '',
  orgId: (import.meta.env.VITE_ORG_ID as string) || '',
  warehouseId: (import.meta.env.VITE_WAREHOUSE_ID as string) || '',
};


