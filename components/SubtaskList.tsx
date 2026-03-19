import { FC, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Subtask type
type Subtask = {
  id: string; // unique identifier
  text: string; // subtask text
  completed: boolean; // completion status
};

// Props received by the component
type Props = {
  // Data that a React component receives from outside
  subtasks?: Subtask[]; // list of subtasks (optional)
  onChangeSubtasks: (updated: Subtask[]) => void; // function to update the list
};

// SubtaskList component
export const SubtaskList: FC<Props> = ({
  subtasks = [], // if not provided → empty list
  onChangeSubtasks = () => {}, // default empty function
}) => {
  // Local state for the new subtask text
  const [newSubtask, setNewSubtask] = useState("");

  // Add a new subtask
  const addSubtask = () => {
    // If empty or only spaces → do nothing
    if (newSubtask.trim() === "") return;

    // Create a new subtask object
    const sub: Subtask = {
      id: Date.now().toString(), // unique ID
      text: newSubtask, // subtask text
      completed: false, // not completed by default
    };

    // Update the parent state with the new subtask
    onChangeSubtasks([...subtasks, sub]);

    // Clear the input field
    setNewSubtask("");
  };

  // Toggle subtask completed state
  const toggleCompleted = (id: string) => {
    onChangeSubtasks(
      subtasks.map(
        (s) =>
          // If the ID matches → toggle completed value
          s.id === id ? { ...s, completed: !s.completed } : s, // ...s copies all fields from the original object
      ),
    );
  };

  // Delete a subtask
  const deleteSubtask = (id: string) => {
    // Filter: keep everything except the one to delete
    onChangeSubtasks(subtasks.filter((s) => s.id !== id));
  };

  return (
    // Container
    <View className="mt-2 space-y-2">
      {/* Subtask list */}
      {subtasks.map((s) => (
        <View
          key={s.id} // React key
          className="flex-row justify-between items-center"
        >
          {/* Subtask text + completed toggle */}
          <TouchableOpacity
            onPress={() => toggleCompleted(s.id)}
            style={{ pointerEvents: "auto" }}
          >
            <Text className={s.completed ? "line-through text-gray-400" : ""}>
              {s.text}
            </Text>
          </TouchableOpacity>

          {/* Delete button */}
          <TouchableOpacity
            onPress={() => deleteSubtask(s.id)}
            style={{ pointerEvents: "auto" }}
          >
            <Text className="text-red-500">X</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add new subtask */}
      <View className="flex-row mt-2">
        {/* Input field */}
        <TextInput
          className="flex-1 border p-2"
          placeholder="Add subtask..."
          value={newSubtask}
          onChangeText={setNewSubtask} // update state while typing
        />

        {/* Add button */}
        <TouchableOpacity
          style={{ pointerEvents: "auto" }}
          className="ml-2 p-2 border"
          onPress={addSubtask}
        >
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
