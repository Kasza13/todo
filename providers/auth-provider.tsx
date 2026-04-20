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
  isReady: boolean;
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
  const [session, setSession] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (data) {
          setProfile({
            id: data.id,
            email: data.email,
            username: data.username,
            full_name: data.full_name,
          });
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        setSession(data.session);

        if (data.session?.user) {
          await loadProfile(data.session.user.id);
        } else {
          setProfile(null);
        }

        setIsReady(true);
      })
      .catch((error) => {
        console.error("Failed to restore session", error);
        setSession(null);
        setProfile(null);
        setIsReady(true);
      });

    const listener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }

      setIsReady(true);
    });

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  };

  const value: AuthContextType = {
    isLoggedIn: !!session,
    isReady,
    profile,
    setProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
