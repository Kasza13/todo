// importáljuk a Stack navigátort az Expo Routerből
import { Stack } from "expo-router";

// Ez az alkalmazás fő layout komponense
export default function RootLayout() {
  // A Stack navigációs rendszert rendereljük
  // Ez kezeli a képernyők közötti navigációt (mint egy verem / stack)
  // Az app mappában lévő fájlok automatikusan képernyők lesznek
  return <Stack />;
}

//Stack

//Mit csinál?
