import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnoqrcnjmemajcutxjfm.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indub3FyY25qbWVtYWpjdXR4amZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTM1MTMsImV4cCI6MjA5MjE4OTUxM30.okr91waC3F4QdNwIXpN9SjGao485fGy0gVv8d_8o5JM';

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
