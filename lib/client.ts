import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zjiwkiafqjmvnhnkwbts.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_5ilGL2l0y80kpeb0XJXEIg_2tbBjG3q';
  return createBrowserClient(supabaseUrl, supabaseKey);
}
