import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  taskText: string;
  setTaskText: (text: string) => void;
  addTask: () => void;
};

export const TaskInput = ({ taskText, setTaskText, addTask }: Props) => {
  return (
    <View className="flex-row items-center bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-sm">
      <TextInput
        value={taskText}
        onChangeText={setTaskText}
        placeholder="Add new task..."
        placeholderTextColor="#9CA3AF"
        className="flex-1 px-4 py-3 text-base text-gray-900 dark:text-white"
      />

      <Pressable
        onPress={addTask}
        className="bg-green-600 px-5 py-3 rounded-2xl active:opacity-80"
      >
        <Text className="text-white font-semibold">Add</Text>
      </Pressable>
    </View>
  );
};
