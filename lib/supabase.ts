import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

function requireEnv(value: string | undefined, variableName: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }

  return value;
}

export function createSupabasePublicClient() {
  return createClient(
    requireEnv(env.supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(env.supabaseAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        persistSession: false,
      },
    },
  );
}

export function createSupabaseServiceRoleClient() {
  return createClient(
    requireEnv(env.supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(env.supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
      },
    },
  );
}
