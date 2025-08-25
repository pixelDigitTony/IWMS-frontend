/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_R2_PUBLIC_BASE_URL?: string;
  readonly VITE_ORG_ID?: string;
  readonly VITE_WAREHOUSE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


