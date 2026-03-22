import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { supabase } from "./utils/supabase";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Bejelentkezés teszt felhasználóval
  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "@email.com",
      password: "",
    });
    if (error) console.error(error);
    else console.log("Logged in:", data);
  };

  // Todos lekérése
  const loadTodos = async () => {
    const { data, error } = await supabase.from("todos").select("*");
    if (error) console.error(error);
    else if (data) setTodos(data as Todo[]);
  };

  // Új todo hozzáadása
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: newTodo, completed: false }])
      .select();
    if (error) console.error(error);
    else if (data) setTodos([...todos, ...(data as Todo[])]);
    setNewTodo("");
  };

  useEffect(() => {
    login();
    loadTodos();
  }, []);

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="mb-4 flex-row">
        <TextInput
          className="border border-gray-300 p-2 flex-1 rounded"
          placeholder="Új todo"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <View className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <Text className="font-bold mb-1 text-base">{item.title}</Text>
            <Text className="text-gray-700">
              {item.completed ? "✅ Completed" : "❌ Pending"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
