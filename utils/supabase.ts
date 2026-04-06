import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL. Add it to your .env (e.g. https://xyz.supabase.co).",
  );
}

if (!supabaseAnonKey || supabaseAnonKey.length < 60) {

  throw new Error(
    "Missing or invalid EXPO_PUBLIC_SUPABASE_ANON_KEY. Paste the full anon key from Supabase project settings > API.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
