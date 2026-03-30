import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.replace("/");
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
            className="bg-blue-500 rounded-xl p-4 mt-2"
          >
            <Text className="text-white text-center font-semibold text-base">
              Login
            </Text>
          </Pressable>
        </View>
      </ThemedView>
    </>
  );
}
