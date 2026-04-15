import { FC, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

type Props = {
  subtasks?: Subtask[];
  onChangeSubtasks: (updated: Subtask[]) => void;
  onAddSuccess?: () => void;
};

export const SubtaskList: FC<Props> = ({
  subtasks = [],
  onChangeSubtasks = () => {},
  onAddSuccess,
}) => {
  const [newSubtask, setNewSubtask] = useState("");

  const addSubtask = () => {
    if (newSubtask.trim() === "") return;

    const sub: Subtask = {
      id: Date.now().toString(),
      text: newSubtask,
      completed: false,
    };

    onChangeSubtasks([...subtasks, sub]);
    setNewSubtask("");

    onAddSuccess?.();
  };

  const toggleCompleted = (id: string) => {
    onChangeSubtasks(
      subtasks.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s,
      ),
    );
  };

  const deleteSubtask = (id: string) => {
    onChangeSubtasks(subtasks.filter((s) => s.id !== id));
  };

  return (
    <View className="mt-2 space-y-2">
      {subtasks.map((s) => (
        <View key={s.id} className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => toggleCompleted(s.id)}>
            <Text className={s.completed ? "line-through text-gray-400" : ""}>
              {s.text}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteSubtask(s.id)}>
            <Text className="text-red-500">X</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add new subtask */}
      <View className="flex-row mt-2">
        <TextInput
          className="flex-1 border p-2"
          placeholder="Add subtask..."
          value={newSubtask}
          onChangeText={setNewSubtask}
          onSubmitEditing={addSubtask}
        />

        <TouchableOpacity className="ml-2 p-2 border" onPress={addSubtask}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
