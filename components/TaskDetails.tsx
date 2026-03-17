// FC (Function Component) típust importáljuk Reactből
import { FC, useState } from "react";
// React Native UI komponensek importálása
import { Text, TextInput, TouchableOpacity, View } from "react-native";
// SubtaskList komponens importálása az alfeladatok kezeléséhez
import { SubtaskList } from "./SubtaskList";

// TaskType típus definiálása: előre definiált vagy bármilyen string
export type TaskType = "home" | "work" | "other" | string;

// Subtask típus definiálása
type Subtask = {
  id: string; // Egyedi azonosító
  text: string; // Alfeladat szövege
  completed: boolean; // Kész státusz
};

// Props típusdefiníció a TaskDetails komponenshez
type Props = {
  priority?: string; // Feladat prioritása
  onChangePriority?: (priority: string) => void; // Callback prioritás változtatásra
  description?: string; // Feladat leírása
  onChangeDescription?: (text: string) => void; // Callback leírás változtatásra
  deadline?: string; // Feladat határideje
  onChangeDeadline?: (date: string) => void; // Callback határidő változtatásra
  subtasks?: Subtask[]; // Alfeladatok
  onChangeSubtasks?: (subtasks: Subtask[]) => void; // Callback alfeladatok frissítésére
  taskType?: TaskType; // Feladat típusa
  onChangeTaskType?: (type: TaskType) => void; // Callback típustípus változtatásra
  onSave?: (task: {
    description: string;
    deadline: string;
    taskType: TaskType;
    priority?: string;
    subtasks: Subtask[];
  }) => void; // Callback mentésre
};

// TaskDetails funkcionális komponens
export const TaskDetails: FC<Props> = ({
  priority,
  onChangePriority,
  description = "", // Alapértelmezett üres leírás
  onChangeDescription,
  deadline = "", // Alapértelmezett üres dátum
  onChangeDeadline,
  subtasks = [], // Alapértelmezett üres alfeladat lista
  onChangeSubtasks = () => {}, // Alapértelmezett üres függvény
  taskType = "", // Alapértelmezett üres típus
  onChangeTaskType = () => {}, // Alapértelmezett üres függvény
  onSave,
}) => {
  // Lokális state-ek a beviteli mezők kezelésére
  const [desc, setDesc] = useState(description); // Leírás state
  const [date, setDate] = useState(deadline); // Határidő state
  const [type, setType] = useState<TaskType>(
    taskType === "home" || taskType === "work" ? taskType : "other", // Alapértelmezett típus
  );
  const [customType, setCustomType] = useState(
    taskType !== "home" && taskType !== "work" ? taskType : "", // Egyedi típus
  );

  // Végső típus: ha "other", akkor a felhasználó által megadott egyedi típus
  const finalType = type === "other" ? customType : type;

  // Mentés gomb kezelése
  const handleSave = () => {
    const taskData = {
      description: desc,
      deadline: date,
      taskType: finalType,
      priority,
      subtasks,
    };
    onSave?.(taskData); // Ha van onSave callback, meghívjuk
  };

  return (
    <View className="mt-2 space-y-3">
      {/* Description input */}
      <TextInput
        className="border border-gray-300 rounded-xl p-3 text-sm bg-white text-gray-800"
        placeholder="Description..."
        value={desc}
        onChangeText={(text) => {
          setDesc(text); // Lokális state frissítése
          onChangeDescription?.(text); // Szülő értesítése
        }}
        multiline
      />

      {/* Deadline input */}
      <TextInput
        className="border border-gray-300 rounded-xl p-3 text-sm bg-white text-gray-800"
        placeholder="Deadline (YYYY-MM-DD)"
        value={date}
        onChangeText={(text) => {
          setDate(text); // Lokális state frissítése
          onChangeDeadline?.(text); // Szülő értesítése
        }}
      />

      {/* TaskType választó gombok */}
      <View className="flex-row space-x-2">
        {["home", "work", "other"].map((t) => (
          <TouchableOpacity
            key={t} // Egyedi kulcs
            onPress={() => {
              setType(t); // Lokális state frissítése
              onChangeTaskType(t); // Szülő értesítése
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

      {/* Custom type input, csak ha "other" típus */}
      {type === "other" && (
        <TextInput
          className="border border-gray-300 rounded-xl p-3 text-sm bg-white text-gray-800 mt-2"
          placeholder="Enter custom type"
          value={customType}
          onChangeText={(text) => {
            setCustomType(text); // Lokális state frissítése
            onChangeTaskType(text); // Szülő értesítése
          }}
        />
      )}

      {/* Subtask lista komponens */}
      <SubtaskList subtasks={subtasks} onChangeSubtasks={onChangeSubtasks} />

      {/* Mentés gomb */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-blue-500 rounded-xl p-3 mt-3 items-center"
      >
        <Text className="text-white font-bold text-sm">SAVE TASK</Text>
      </TouchableOpacity>
    </View>
  );
};
