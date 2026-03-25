<<<<<<< HEAD
// Import the Stack navigator from Expo Router
import { Stack } from "expo-router";

// This is the main layout component of the app
export default function RootLayout() {
  // Render the Stack navigation system
  // It manages navigation between screens like a stack
  // Files in the app folder automatically become screens
  return <Stack />;
=======
import { Stack } from "expo-router";
import { AuthProvider } from "../utils/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
>>>>>>> 0c63222 (push fix)
}
