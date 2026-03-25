import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // csak navigáció (fake login)
    router.replace("/");
  };

  return (
    <View className="flex-1 justify-center px-8 bg-gray-100">
      <View className="bg-white p-6 rounded-3xl shadow-md">
        <Text className="text-3xl font-bold text-center mb-2">Welcome</Text>

        <Text className="text-gray-500 text-center mb-6">
          Sign in to continue
        </Text>

        <Text className="text-gray-600 mb-1">Email</Text>
        <TextInput
          placeholder="your@email.com"
          className="border border-gray-300 rounded-xl p-3 mb-4"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-gray-600 mb-1">Password</Text>
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          className="border border-gray-300 rounded-xl p-3 mb-6"
          value={password}
          onChangeText={setPassword}
        />

        <Pressable onPress={handleLogin} className="bg-blue-500 p-4 rounded-xl">
          <Text className="text-white text-center font-semibold text-lg">
            Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
