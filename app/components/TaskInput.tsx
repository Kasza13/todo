import { FC } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  taskText: string;
  setTaskText: (text: string) => void;
  addTask: () => void;
};

export const TaskInput: FC<Props> = ({ taskText, setTaskText, addTask }) => (
  <View className="flex-row mb-4">
    <TextInput
      className="flex-1 border border-gray-300 p-2"
      placeholder="New task..."
      value={taskText}
      onChangeText={setTaskText}
    />
    <TouchableOpacity
      className="ml-2 px-3 justify-center border border-gray-300"
      onPress={addTask}
    >
      <Text>Add</Text>
    </TouchableOpacity>
  </View>
);
