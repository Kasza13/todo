// Reactből importáljuk az FC (Function Component) típust és a useState hookot
import { FC, useState } from "react";

// React Native UI elemek importálása
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Subtask lista komponens importálása
import { SubtaskList } from "./SubtaskList";

// Task típus kategóriák
// A feladat lehet home, work, other vagy bármilyen egyedi string
export type TaskType = "home" | "work" | "other" | string;

// Subtask típus definiálása
type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

// A komponens Props típusának definiálása
type Props = {
  priority?: string;
  onChangePriority?: (priority: string) => void;

  description?: string;
  onChangeDescription?: (text: string) => void;

  deadline?: string;
  onChangeDeadline?: (date: string) => void;

  subtasks?: Subtask[];
  onChangeSubtasks?: (subtasks: Subtask[]) => void;

  taskType?: TaskType;
  onChangeTaskType?: (type: TaskType) => void;
};

// TaskDetails komponens
export const TaskDetails: FC<Props> = ({
  priority,
  onChangePriority,

  // ha nincs description átadva → üres string
  description = "",
  onChangeDescription,

  // ha nincs deadline → üres string
  deadline = "",
  onChangeDeadline,

  // ha nincs subtasks → üres tömb
  subtasks = [],

  // ha nincs függvény → üres függvény
  onChangeSubtasks = () => {},

  // alapértelmezett taskType
  taskType = "",
  onChangeTaskType = () => {},
}) => {
  // Lokális state a description mezőhöz
  // Ez a TextInput aktuális értékét tárolja
  const [desc, setDesc] = useState(description);

  // Lokális state a deadline mezőhöz
  const [date, setDate] = useState(deadline);

  // Task típus state (home / work / other)
  const [type, setType] = useState<TaskType>(taskType);

  // Egyedi típus state ("other" esetén használjuk)
  const [customType, setCustomType] = useState("");

  // Végső típus meghatározása
  // Ha "other" → customType lesz
  // különben a választott type
  const finalType = type === "other" ? customType : type;

  // JSX render
  return (
    <View className="mt-2 space-y-2">
      {/* Description szövegmező */}
      <TextInput
        className="border border-gray-300 p-2 text-sm rounded"
        placeholder="Description..."
        value={desc}
        onChangeText={(text) => {
          // lokális state frissítése
          setDesc(text);

          // parent komponens értesítése
          onChangeDescription?.(text);
        }}
        multiline
      />

      {/* Deadline mező */}
      <TextInput
        className="border border-gray-300 p-2 text-sm rounded"
        placeholder="Deadline (YYYY-MM-DD)"
        value={date}
        onChangeText={(text) => {
          // lokális state frissítése
          setDate(text);

          // parent frissítése
          onChangeDeadline?.(text);
        }}
      />

      {/* Task típus választó gombok */}
      <View className="flex-row space-x-2">
        {/* home / work / other típusokon végigiterálunk */}
        {["home", "work", "other"].map((t) => (
          <TouchableOpacity
            key={t}
            // gomb megnyomásakor
            onPress={() => {
              // kiválasztott típus mentése
              setType(t);

              // ha other → customType küldése
              // különben maga a típus
              onChangeTaskType(t === "other" ? customType : t);
            }}
            // Tailwind / NativeWind dinamikus stílus
            className={`px-2 py-1 border rounded ${
              type === t
                ? t === "other"
                  ? "bg-purple-400 text-white"
                  : t === "home"
                    ? "bg-green-400 text-black"
                    : "bg-yellow-400 text-black"
                : "bg-gray-200 text-black"
            }`}
          >
            {/* gomb szöveg */}
            <Text className="text-sm font-mono">{t.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ha OTHER van kiválasztva → egyedi típus mező jelenik meg */}
      {type === "other" && (
        <TextInput
          className="border border-gray-300 p-2 text-sm rounded mt-2"
          placeholder="Írd be a saját típust"
          value={customType}
          onChangeText={(text) => {
            // egyedi típus state frissítés
            setCustomType(text);

            // parent komponens frissítése
            onChangeTaskType(text);
          }}
        />
      )}

      {/* Subtask lista komponens */}
      <SubtaskList subtasks={subtasks} onChangeSubtasks={onChangeSubtasks} />
    </View>
  );
};
