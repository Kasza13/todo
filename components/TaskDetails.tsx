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
  onChange?: (data: any) => void;
  onSave?: (task: any) => void;
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
  const [desc, setDesc] = useState(description);
  const [date, setDate] = useState(deadline);
  const [showPicker, setShowPicker] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [type, setType] = useState<TaskType>(
    taskType === "home" || taskType === "work" ? taskType : "other",
  );
  const [customType, setCustomType] = useState(
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
    setTimeout(() => setShowToast(false), 2000);
  };

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date ? new Date(date) : new Date(),
        mode: "date",
        onChange: (_, selectedDate) => {
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
    <View className="mt-3 bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm">
      {/* DESCRIPTION */}
      <View className="mb-5">
        <Text className="text-xs text-gray-400 mb-2">Description</Text>
        <TextInput
          placeholder="Write something..."
          placeholderTextColor="#9CA3AF"
          value={desc}
          onChangeText={(text) => {
            setDesc(text);
            onChange?.({ description: text });
          }}
          multiline
          className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 text-base text-gray-900 dark:text-white"
        />
      </View>

      {/* DEADLINE */}
      <View className="mb-5">
        <Text className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
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
              padding: 14,
              borderRadius: 16,
              border: "none",
              backgroundColor: "#f3f4f6",
              width: "100%",
            }}
          />
        ) : (
          <>
            <TouchableOpacity
              onPress={openDatePicker}
              className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-4 shadow-sm flex-row items-center justify-between"
            >
              <Text className="text-gray-900 dark:text-white">
                {date ? date : "No deadline set"}
              </Text>

              <Text className="text-gray-400">📅</Text>
            </TouchableOpacity>

            {Platform.OS === "ios" && showPicker && (
              <DateTimePicker
                value={date ? new Date(date) : new Date()}
                mode="date"
                display="compact"
                onChange={(_, selectedDate) => {
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
      <View className="mb-5">
        <Text className="text-xs text-gray-400 mb-2">Priority</Text>
        <View className="flex-row gap-2">
          {[Priority.Low, Priority.Medium, Priority.High].map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => onChange?.({ priority: p })}
              className={`px-4 py-2 rounded-full ${
                priority === p
                  ? p === Priority.Low
                    ? "bg-green-500"
                    : p === Priority.Medium
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Text
                className={`text-sm ${
                  priority === p
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* TYPE */}
      <View className="mb-5">
        <Text className="text-xs text-gray-400 mb-2">Type</Text>

        <View className="flex-row gap-2">
          {["home", "work", "other"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setType(t as TaskType);
                onChange?.({
                  taskType: t === "other" ? customType : t,
                });
              }}
              className={`px-4 py-2 rounded-full ${
                type === t ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Text
                className={`text-sm ${
                  type === t ? "text-white" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {type === "other" && (
          <TextInput
            placeholder="Custom type..."
            placeholderTextColor="#9CA3AF"
            value={customType}
            onChangeText={(text) => {
              setCustomType(text);
              onChange?.({ taskType: text });
            }}
            className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 mt-3 text-gray-900 dark:text-white"
          />
        )}
      </View>

      {/* TOAST */}
      {showToast && (
        <View className="absolute top-5 left-5 right-5">
          <View className="bg-black/80 px-4 py-3 rounded-2xl">
            <Text className="text-white text-center">Saved</Text>
          </View>
        </View>
      )}

      {/* SAVE BUTTON */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-green-600 rounded-2xl py-4 items-center mt-2 active:opacity-80"
      >
        <Text className="text-white font-semibold tracking-wide">
          Save Task
        </Text>
      </TouchableOpacity>
    </View>
  );
};
