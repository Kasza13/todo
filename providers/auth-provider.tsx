import { supabase } from "@/utils/supabase";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export type Profile = {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
};

export type AuthContextType = {
  isLoggedIn: boolean;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Failed to load profile:", error);
        setProfile(null);
        return;
      }

      setProfile({
        id: data.id,
        email: data.email,
        username: data.username,
        full_name: data.full_name,
      });
    };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadProfile(data.session.user.id);
      }
    });

    const listener = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener.data?.subscription?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const value: AuthContextType = {
    isLoggedIn: !!profile,
    profile,
    setProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
