import { FC, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SubtaskList } from "./SubtaskList";

export type TaskType = "home" | "work" | "other" | string;

type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

type Props = {
  priority?: string;
  description?: string;
  deadline?: string;
  subtasks?: Subtask[];
  taskType?: TaskType;

  onChange?: (
    data: Partial<{
      priority: string;
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
    priority?: string;
    subtasks: Subtask[];
  }) => void;
};

export const TaskDetails: FC<Props> = ({
  priority,
  description = "",
  deadline = "",
  subtasks = [],
  taskType = "",
  onChange,
  onSave,
}) => {
  const [desc, setDesc] = useState(description);
  const [date, setDate] = useState(deadline);

  const [type, setType] = useState<TaskType>(
    taskType === "home" || taskType === "work" ? taskType : "other",
  );

  const [customType, setCustomType] = useState(
    taskType !== "home" && taskType !== "work" ? taskType : "",
  );

  const finalType = type === "other" ? customType : type;

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
      {/* Description */}
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

      {/* Deadline */}
      <TextInput
        className="border border-gray-300 rounded-xl p-3 text-sm bg-white text-gray-800"
        placeholder="Deadline (YYYY-MM-DD)"
        value={date}
        onChangeText={(text) => {
          setDate(text);
          onChange?.({ deadline: text });
        }}
      />

      {/* Task Type */}
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

      {/* Custom type */}
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

      {/* Subtasks */}
      <SubtaskList
        subtasks={subtasks}
        onChangeSubtasks={(updated) => onChange?.({ subtasks: updated })}
      />

      {/* Save */}
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
