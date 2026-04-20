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

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      alert("Registration successful! Please check your email.");
      router.push("/"); // vagy /login ha oda akarod visszadobni
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      console.error("Register error:", err);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Register" }} />

      <ThemedView className="flex-1 justify-center px-6 bg-gray-50">
        <View className="bg-white p-6 rounded-3xl shadow-md">
          <Text className="text-center mb-2 text-2xl text-black font-bold">
            Create account
          </Text>

          <Text className="text-center mb-5 text-black">
            Sign up to get started
          </Text>

          <Text className="mb-1 text-gray-700 font-medium">Email</Text>
          <TextInput
            placeholder="your@email.com"
            className="border border-gray-300 rounded-xl p-3 mb-4"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="mb-1 text-gray-700 font-medium">Password</Text>

          <View className="mb-5 relative">
            <TextInput
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              className="border border-gray-300 rounded-xl p-3 pr-10"
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </Pressable>
          </View>

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            className={`rounded-xl p-4 mt-2 ${
              loading ? "bg-blue-300" : "bg-blue-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Register
              </Text>
            )}
          </Pressable>

          <View className="h-5" />

          <Text className="text-black text-left font-semibold text-base">
            Already have an account?{" "}
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-blue-500 text-left font-semibold text-base">
                Sign in!
              </Text>
            </Pressable>
          </Text>
        </View>
      </ThemedView>
    </>
  );
}
