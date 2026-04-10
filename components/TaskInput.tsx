import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  taskText: string;
  setTaskText: (text: string) => void;
  addTask: () => void;
};

export const TaskInput = ({ taskText, setTaskText, addTask }: Props) => {
  return (
    <View className="flex-row items-center gap-2 mb-4">
      <TextInput
        value={taskText}
        onChangeText={setTaskText}
        placeholder="Add new task..."
        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 bg-white"
      />

      <Pressable onPress={addTask} className="bg-blue-500 px-4 py-2 rounded-xl">
        <Text className="text-white font-semibold">Add</Text>
      </Pressable>
    </View>
  );
};
