import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
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
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hydrateProfile = (nextSession: Session | null) => {
      const user = nextSession?.user;

      if (!user) {
        setProfile(null);
        return;
      }

      const metadata = user.user_metadata ?? {};

      setProfile({
        id: user.id,
        email: user.email ?? "",
        username:
          metadata.username ??
          metadata.user_name ??
          metadata.name ??
          user.email?.split("@")[0],
        full_name: metadata.full_name ?? metadata.name,
      });
    };

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        hydrateProfile(data.session);
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
      hydrateProfile(session);
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
