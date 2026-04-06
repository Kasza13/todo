import { ThemedText } from "@/components/themed-text";
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

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      if (error) {
        throw new Error(error.message);
      }

      router.push("/");
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

      <ThemedView className="flex-1 justify-center px-6 bg-gray-50">
        <View className="bg-white p-6 rounded-3xl shadow-md">
          <ThemedText
            type="title"
            className="text-center mb-2 text-2xl font-bold"
          >
            Welcome
          </ThemedText>

          <ThemedText className="text-center mb-5 text-gray-500">
            Sign in to continue
          </ThemedText>

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
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            className="border border-gray-300 rounded-xl p-3 mb-5"
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-xl p-4 mt-2 ${
              loading ? "bg-blue-300" : "bg-blue-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Login
              </Text>
            )}
          </Pressable>
        </View>
      </ThemedView>
    </>
  );
}
