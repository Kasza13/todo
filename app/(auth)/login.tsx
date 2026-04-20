import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
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

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      router.replace("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      console.error("Login error:", err);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />

      <ThemedView className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center px-5">
        {/* TITLE */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 dark:text-white text-center">
            The TODO
          </Text>
          <Text className="text-center text-gray-500 mt-2">
            Sign in to continue
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
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-4 text-gray-900 dark:text-white"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* PASSWORD */}
          <Text className="mb-1 text-gray-900 dark:text-white font-medium">
            Password
          </Text>

          <View className="mb-5 relative">
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 pr-10 text-gray-900 dark:text-white"
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </Pressable>
          </View>

          {/* FORGOT PASSWORD */}
          <Pressable onPress={() => router.push("/(auth)/newpasswd")}>
            <Text className="text-blue-500 font-semibold">
              Forgot password?
            </Text>
          </Pressable>

          <View className="h-5" />

          {/* LOGIN BUTTON */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-xl p-4 ${
              loading ? "bg-blue-300" : "bg-blue-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold">
                Login
              </Text>
            )}
          </Pressable>

          {/* SIGN UP */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
            </Text>

            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-blue-500 font-semibold">Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </>
  );
}
