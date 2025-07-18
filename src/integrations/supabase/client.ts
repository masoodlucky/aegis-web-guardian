// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ouycybzppuzdbplsxklc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91eWN5YnpwcHV6ZGJwbHN4a2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzczMzksImV4cCI6MjA2NzAxMzMzOX0.uN3QLleduJ-Nv15eE8ycl5yju-m1vDtiB2sC-skl2ZM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});