import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnoqrcnjmemajcutxjfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indub3FyY25qbWVtYWpjdXR4amZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTM1MTMsImV4cCI6MjA5MjE4OTUxM30.okr91waC3F4QdNwIXpN9SjGao485fGy0gVv8d_8o5JM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});