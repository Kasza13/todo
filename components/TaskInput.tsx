// Import the FC (Function Component) type from React
import { FC } from "react";
// Import React Native UI components
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Props type definition for the TaskInput component
type Props = {
  taskText: string; // Value of the input field
  setTaskText: (text: string) => void; // Callback to update the text
  addTask: () => void; // Callback to add a new task
};

// TaskInput functional component
export const TaskInput: FC<Props> = ({ taskText, setTaskText, addTask }) => (
  // Main wrapper: elements arranged in a row (input and button)
  <View className="flex-row items-center mb-4">
    {/* Input field */}
    <TextInput
      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
      placeholder="New task..."
      value={taskText}
      onChangeText={setTaskText}
    />

    {/* Add button */}
    <TouchableOpacity
      onPress={addTask}
      className="ml-3 bg-blue-500 px-4 py-3 rounded-xl"
    >
      <Text className="text-white font-medium">Add</Text>
    </TouchableOpacity>
  </View>
);
