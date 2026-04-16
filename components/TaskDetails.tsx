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
  const [showToast, setShowToast] = useState(false);

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

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
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
      {/* DESCRIPTION */}
      <View>
        <Text className="text-xs text-black uppercase tracking-wider mb-1">
          Description
        </Text>
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
      </View>

      {/* DEADLINE */}
      <View>
        <Text className="text-xs text-black uppercase tracking-wider mb-1">
          Deadline
        </Text>

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
      </View>

      {/* PRIORITY */}
      <View>
        <Text className="text-xs text-black uppercase tracking-wider mb-1">
          Priority
        </Text>
        <View className="flex-row space-x-2">
          {[Priority.Low, Priority.Medium, Priority.High].map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => onChange?.({ priority: p })}
              className={`px-3 py-2 rounded-xl border ${
                priority === p
                  ? p === Priority.Low
                    ? "bg-green-400 border-green-400"
                    : p === Priority.Medium
                      ? "bg-yellow-400 border-yellow-400"
                      : "bg-red-400 border-red-400"
                  : "bg-gray-200 border-gray-200"
              }`}
            >
              <Text className="text-sm font-mono text-center">
                {p.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* TYPE */}
      <View>
        <Text className="text-xs text-black uppercase tracking-wider mb-1">
          Type
        </Text>

        <View className="flex-row space-x-2">
          {["home", "work", "other"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setType(t as TaskType);
                onChange?.({
                  taskType: t === "other" ? customType : t,
                });
              }}
              className={`px-3 py-2 rounded-xl border ${
                type === t
                  ? t === "home"
                    ? "bg-green-400 border-green-400"
                    : t === "work"
                      ? "bg-yellow-400 border-yellow-400"
                      : "bg-purple-400 border-purple-400"
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
      </View>
      {/* TOAST */}
      {showToast && (
        <View className="absolute top-10 left-0 right-0 items-center z-50">
          <View className="bg-green-500 px-4 py-2 rounded shadow">
            <Text className="text-white font-bold">Task saved!</Text>
          </View>
        </View>
      )}

      {/* SAVE BUTTON */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-blue-500 rounded-xl p-3 mt-3 items-center"
      >
        <Text className="text-white font-bold text-sm">SAVE TASK</Text>
      </TouchableOpacity>
    </View>
  );
};
