'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  nom: string | null;
  prenom: string | null;
  phone: string | null;
  city: string | null;
  wilaya: string | null;
  age: number | null;
  gender: string | null;
  profile_completed: boolean;
  avatar_url: string | null;
  event_preferences: string[] | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (u: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .maybeSingle();

      if (error) return null;
      return data;
    } catch (err) {
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user);
      setProfile(p);
    }
  };

  useEffect(() => {
    // Timeout global de 8 secondes
    const globalTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(globalTimeout);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).then((p) => {
          setProfile(p);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // 2. Écouter les changements d'état
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else if (session?.user) {
          setUser(session.user);
          const p = await fetchProfile(session.user);
          setProfile(p);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(globalTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isAdmin: profile?.role === 'admin',
      signOut,
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
