import { FC, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SubtaskList } from "./SubtaskList";

type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

type Props = {
  priority: "low" | "medium" | "high";
  onChangePriority: (level: "low" | "medium" | "high") => void;
  description?: string;
  onChangeDescription?: (text: string) => void;
  deadline?: string;
  onChangeDeadline?: (date: string) => void;
  subtasks?: Subtask[];
  onChangeSubtasks?: (updated: Subtask[]) => void;
};

export const TaskDetails: FC<Props> = ({
  priority,
  onChangePriority,
  description = "",
  onChangeDescription,
  deadline = "",
  onChangeDeadline,
  subtasks = [],
  onChangeSubtasks = () => {},
}) => {
  const [desc, setDesc] = useState(description);
  const [date, setDate] = useState(deadline);

  return (
    <View className="mt-2 space-y-2">
      <TextInput
        className="border border-gray-300 p-2 text-sm rounded"
        placeholder="Description..."
        value={desc}
        onChangeText={(text) => {
          setDesc(text);
          onChangeDescription?.(text);
        }}
        multiline
      />

      <TextInput
        className="border border-gray-300 p-2 text-sm rounded"
        placeholder="Deadline (YYYY-MM-DD)"
        value={date}
        onChangeText={(text) => {
          setDate(text);
          onChangeDeadline?.(text);
        }}
      />

      <View className="flex-row space-x-2 mt-2">
        {(["low", "medium", "high"] as const).map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onChangePriority(level)}
            className={`px-2 py-1 border rounded ${
              priority === level
                ? level === "high"
                  ? "bg-red-500 text-white"
                  : level === "medium"
                    ? "bg-yellow-400 text-black"
                    : "bg-green-400 text-black"
                : "bg-gray-200 text-black"
            }`}
          >
            <Text className="text-sm font-mono">{level.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SubtaskList subtasks={subtasks} onChangeSubtasks={onChangeSubtasks} />
    </View>
  );
};
