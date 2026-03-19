import { FC, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Priority } from "../types/Priority";
import { SubtaskList } from "./SubtaskList";

export type TaskType = "home" | "work" | "other" | string;

type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

type Props = {
  priority?: Priority;
  description?: string;
  deadline?: string;
  subtasks?: Subtask[];
  taskType?: TaskType;

  onChange?: (
    data: Partial<{
      priority: Priority;
      description: string;
      deadline: string;
      subtasks: Subtask[];
      taskType: TaskType;
    }>,
  ) => void;

  onSave?: (task: {
    description: string;
    deadline: string;
    taskType: TaskType;
    priority?: Priority;
    subtasks: Subtask[];
  }) => void;
};

// TaskDetails component
export const TaskDetails: FC<Props> = ({
  priority,
  description = "",
  deadline = "",
  subtasks = [],
  taskType = "",
  onChange,
  onSave,
}) => {
  // Local state for description
  const [desc, setDesc] = useState(description);

  // Local state for deadline
  const [date, setDate] = useState(deadline);

  // Selected task type (home, work, other)
  const [type, setType] = useState<TaskType>(
    taskType === "home" || taskType === "work" ? taskType : "other",
  );

  // Custom type if "other" is selected
  const [customType, setCustomType] = useState(
    taskType !== "home" && taskType !== "work" ? taskType : "",
  );

  // Final resolved type
  const finalType = type === "other" ? customType : type;

  // Save handler
  const handleSave = () => {
    onSave?.({
      description: desc,
      deadline: date,
      taskType: finalType,
      priority,
      subtasks,
    });
  };

  return (
    <View className="mt-2 space-y-3">
      {/* Description input */}
      <TextInput
        className="border border-gray-300 rounded-xl p-3 text-sm bg-white text-gray-800"
        placeholder="Description..."
        value={desc}
        onChangeText={(text) => {
          setDesc(text);
          onChange?.({ description: text });
        }}
        multiline
      />

      {/* Deadline input */}
      <TextInput
        className="border border-gray-300 rounded-xl p-3 text-sm bg-white text-gray-800"
        placeholder="Deadline (YYYY-MM-DD)"
        value={date}
        onChangeText={(text) => {
          setDate(text);
          onChange?.({ deadline: text });
        }}
      />

      {/* Task type selector */}
      <View className="flex-row space-x-2">
        {["home", "work", "other"].map((t) => (
          <TouchableOpacity
            style={{ pointerEvents: "auto" }}
            key={t}
            onPress={() => {
              setType(t);
              onChange?.({ taskType: t });
            }}
            className={`px-3 py-2 rounded-xl border ${
              type === t
                ? t === "other"
                  ? "bg-purple-400 border-purple-400"
                  : t === "home"
                    ? "bg-green-400 border-green-400"
                    : "bg-yellow-400 border-yellow-400"
                : "bg-gray-200 border-gray-200"
            }`}
          >
            <Text className="text-sm font-mono text-center">
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom task type input */}
      {type === "other" && (
        <TextInput
          className="border border-gray-300 rounded-xl p-3 text-sm bg-white text-gray-800 mt-2"
          placeholder="Enter custom type"
          value={customType}
          onChangeText={(text) => {
            setCustomType(text);
            onChange?.({ taskType: text });
          }}
        />
      )}

      {/* Subtasks section */}
      <SubtaskList
        subtasks={subtasks}
        onChangeSubtasks={(updated) => onChange?.({ subtasks: updated })}
      />

      {/* Save button */}
      <TouchableOpacity
        style={{ pointerEvents: "auto" }}
        onPress={handleSave}
        className="bg-blue-500 rounded-xl p-3 mt-3 items-center"
      >
        <Text className="text-white font-bold text-sm">SAVE TASK</Text>
      </TouchableOpacity>
    </View>
  );
};
