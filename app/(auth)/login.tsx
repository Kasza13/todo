import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/utils/supabase";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      router.replace("/(tabs)/index");
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
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
            placeholder="********"
            secureTextEntry
            className="border border-gray-300 rounded-xl p-3 mb-5"
            value={password}
            onChangeText={setPassword}
          />

          {errorMessage ? (
            <Text className="text-red-500 text-sm mb-3">{errorMessage}</Text>
          ) : null}

          <Pressable
            onPress={handleLogin}
            disabled={isSubmitting}
            className={`rounded-xl p-4 mt-2 ${
              isSubmitting ? "bg-blue-300" : "bg-blue-500"
            }`}
          >
            <Text className="text-white text-center font-semibold text-base">
              {isSubmitting ? "Logging in..." : "Login"}
            </Text>
          </Pressable>
        </View>
      </ThemedView>
    </>
  );
}
