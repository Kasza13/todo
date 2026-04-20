import { useAuthContext } from "@/hooks/use-auth-context";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export function SplashScreenController() {
  const { isReady } = useAuthContext();

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
    if (isReady) {
      SplashScreen.hideAsync().catch((e) => {
        console.warn("SplashScreen hideAsync failed", e);
      });
    }
  }, [isReady]);

  return null;
}
