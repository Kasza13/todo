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

  // Load todos from database
  const loadTodos = async () => {
    const { data, error } = await supabase.from("todos").select("*");
    if (error) console.error("Error loading todos:", error);
    else if (data) setTodos(data as Todo[]);
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: newTodo, completed: false }])
      .select();

    if (error) console.error("Error adding todo:", error);
    else if (data) setTodos((prev) => [...prev, ...(data as Todo[])]);

    setNewTodo("");
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="mb-4 flex-row">
        <TextInput
          className="border border-gray-300 p-2 flex-1 rounded"
          placeholder="New todo"
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
