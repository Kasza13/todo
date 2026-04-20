import { ThemedView } from "@/components/themed-view";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../utils/supabase";

export default function NewPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "your-app-scheme://reset-password",
      });

      if (error) throw new Error(error.message);

      alert("Password reset email sent!");
      router.replace("/(auth)/login");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      console.error("Reset password error:", err);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Reset Password" }} />

      <ThemedView className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center px-5">
        {/* HEADER */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 dark:text-white text-center">
            The TODO
          </Text>
          <Text className="text-center text-gray-500 mt-2">Reset password</Text>
          <Text className="text-center text-gray-500 mt-2">
            Enter your email to receive a reset link
          </Text>
        </View>

        {/* CARD */}
        <View className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm">
          {/* EMAIL */}
          <Text className="mb-1 text-gray-900 dark:text-white font-medium">
            Email
          </Text>

          <TextInput
            placeholder="your@email.com"
            placeholderTextColor="#9ca3af"
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-5 text-gray-900 dark:text-white"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* SEND BUTTON */}
          <Pressable
            onPress={handleResetPassword}
            disabled={loading}
            className={`rounded-xl p-4 ${
              loading ? "bg-blue-300" : "bg-blue-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold">
                Send reset link
              </Text>
            )}
          </Pressable>

          {/* BACK TO LOGIN */}
          <View className="mt-6 flex-row justify-center">
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-blue-500 font-semibold">Back to login</Text>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </>
  );
}
