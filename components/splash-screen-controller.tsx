import { useAuthContext } from "@/hooks/use-auth-context";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export function SplashScreenController() {
  const { profile } = useAuthContext();

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn("SplashScreen preventAutoHideAsync failed", e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (profile !== undefined) {
      SplashScreen.hideAsync().catch((e) => {
        console.warn("SplashScreen hideAsync failed", e);
      });
    }
  }, [profile]);

  return null;
}
