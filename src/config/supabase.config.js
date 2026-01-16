import dotenv from 'dotenv';
dotenv.config();

import { createClient } from "@supabase/supabase-js";

/**
 * 🔐 USER SCOPED CLIENT (RLS enforced)
 * Used with Authorization token
 */
export const getSupabaseClient = (accessToken) => {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  );
};

/**
 * 🧨 ADMIN CLIENT (RLS bypass)
 * Backend only
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
