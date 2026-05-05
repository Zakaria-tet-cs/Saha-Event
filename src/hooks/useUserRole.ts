"use client";

import { useAuth } from "@/context/AuthContext";

export interface UserProfile {
  id: string;
  email: string | null;
  nom: string | null;
  prenom: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
  event_preferences: string[] | null;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

interface UseUserRoleReturn {
  profile: any | null; // Keep flexible for compatibility
  role: "admin" | "user" | null;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useUserRole(): UseUserRoleReturn {
  const { profile, loading, refreshProfile } = useAuth();

  return {
    profile,
    role: (profile?.role as "admin" | "user") ?? null,
    isAdmin: profile?.role === "admin",
    isUser: profile?.role === "user",
    loading,
    refetch: refreshProfile,
  };
}
