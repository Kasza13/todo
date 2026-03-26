import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // később ide jön majd a Supabase login
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />

      <ThemedView style={styles.container}>
        <View style={styles.card}>
          <ThemedText type="title" style={styles.title}>
            Welcome
          </ThemedText>

          <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="your@email.com"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 24,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.7,
  },
  label: {
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
