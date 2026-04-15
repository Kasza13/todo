import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { FC, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
    description: string | null;
    deadline: string | null;
    type: string | null;
    priority: number;
    subtasks: Subtask[];
  }) => void;
};

const priorityMap: Record<Priority, number> = {
  [Priority.Low]: 1,
  [Priority.Medium]: 2,
  [Priority.High]: 3,
};

export const TaskDetails: FC<Props> = ({
  priority = Priority.Low,
  description = "",
  deadline = "",
  subtasks = [],
  taskType = "",
  onChange,
  onSave,
}) => {
  const [desc, setDesc] = useState<string>(description);
  const [date, setDate] = useState<string>(deadline);
  const [showPicker, setShowPicker] = useState(false);

  const [type, setType] = useState<TaskType>(
    taskType === "home" || taskType === "work" ? taskType : "other",
  );
  const [customType, setCustomType] = useState<string>(
    taskType !== "home" && taskType !== "work" ? taskType : "",
  );

  const finalType = type === "other" ? customType : type;

  const handleSave = () => {
    onSave?.({
      description: desc.trim() || null,
      deadline: date.trim() || null,
      type: finalType.trim() || null,
      priority: priorityMap[priority],
      subtasks,
    });
  };

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date ? new Date(date) : new Date(),
        mode: "date",
        onChange: (event, selectedDate) => {
          if (selectedDate) {
            const formatted = selectedDate.toISOString().split("T")[0];
            setDate(formatted);
            onChange?.({ deadline: formatted });
          }
        },
      });
    } else {
      setShowPicker(true);
    }
  };

  return (
    <View className="mt-2 space-y-3">
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

      {Platform.OS === "web" ? (
        <input
          type="date"
          value={date}
          onChange={(e) => {
            const val = e.target.value;
            setDate(val);
            onChange?.({ deadline: val });
          }}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={openDatePicker}
            className="border border-gray-300 rounded-xl p-3 bg-white"
          >
            <Text className="text-sm text-gray-800">
              {date ? date : "Select deadline"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && showPicker && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  const formatted = selectedDate.toISOString().split("T")[0];
                  setDate(formatted);
                  onChange?.({ deadline: formatted });
                }
              }}
            />
          )}
        </>
      )}

      <View className="flex-row space-x-2">
        {["home", "work", "other"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => {
              setType(t as TaskType);
              onChange?.({ taskType: t as TaskType });
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

      <SubtaskList
        subtasks={subtasks}
        onChangeSubtasks={(updated) => onChange?.({ subtasks: updated })}
      />

      <TouchableOpacity
        onPress={handleSave}
        className="bg-blue-500 rounded-xl p-3 mt-3 items-center"
      >
        <Text className="text-white font-bold text-sm">SAVE TASK</Text>
      </TouchableOpacity>
    </View>
  );
};
