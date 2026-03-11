// Reactből importáljuk az FC (Function Component) típust és a useState hookot
import { FC, useState } from "react";

// React Native UI elemek
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// A subtaskok megjelenítéséért és kezeléséért felelős komponens
import { SubtaskList } from "./SubtaskList";

// A feladat típusa lehet három előre definiált érték vagy bármilyen egyedi string
export type TaskType = "home" | "work" | "other" | string;

// Egy subtask (részfeladat) struktúrája
type Subtask = {
  id: string; // egyedi azonosító
  text: string; // a részfeladat szövege
  completed: boolean; // jelzi hogy kész van-e
};

// A komponens által fogadott props típus
type Props = {
  // Feladat prioritása (nem kötelező)
  priority?: string;

  // Callback ha a priority változik
  onChangePriority?: (priority: string) => void;

  // Feladat leírása
  description?: string;

  // Callback ha a description változik
  onChangeDescription?: (text: string) => void;

  // Feladat határideje
  deadline?: string;

  // Callback ha a határidő változik
  onChangeDeadline?: (date: string) => void;

  // Subtask lista
  subtasks?: Subtask[];

  // Callback ha a subtask lista változik
  onChangeSubtasks?: (subtasks: Subtask[]) => void;

  // Feladat típusa
  taskType?: TaskType;

  // Callback ha a típus változik
  onChangeTaskType?: (type: TaskType) => void;

  // Mentési callback
  // A parent komponens itt kapja vissza a teljes task adatot
  onSave?: (task: {
    description: string;
    deadline: string;
    taskType: TaskType;
    priority?: string;
    subtasks: Subtask[];
  }) => void;
};

// A TaskDetails komponens definíciója
export const TaskDetails: FC<Props> = ({
  // Props destrukturálása
  priority,
  onChangePriority,

  // Ha nincs description átadva → üres string
  description = "",
  onChangeDescription,

  // Ha nincs deadline → üres string
  deadline = "",
  onChangeDeadline,

  // Ha nincs subtasks → üres lista
  subtasks = [],
  onChangeSubtasks = () => {},

  // Ha nincs taskType → üres string
  taskType = "",
  onChangeTaskType = () => {},

  onSave,
}) => {
  // Lokális state a description mezőhöz
  const [desc, setDesc] = useState(description);

  // Lokális state a deadline mezőhöz
  const [date, setDate] = useState(deadline);

  // A kiválasztott task típus state
  // Ha a taskType nem "home" és nem "work", akkor automatikusan "other"
  const [type, setType] = useState<TaskType>(
    taskType === "home" || taskType === "work" ? taskType : "other",
  );

  // Az "other" esetén megadott egyedi típus
  // Ha a taskType egy custom érték volt, akkor ide töltjük vissza
  const [customType, setCustomType] = useState(
    taskType !== "home" && taskType !== "work" ? taskType : "",
  );

  // A végleges task type meghatározása
  // Ha "other" van kiválasztva → customType
  // különben a kiválasztott type
  const finalType = type === "other" ? customType : type;

  // Mentés kezelése
  const handleSave = () => {
    // Összegyűjtjük az aktuális task adatokat
    const taskData = {
      description: desc,
      deadline: date,
      taskType: finalType,
      priority,
      subtasks,
    };

    // Ha létezik onSave callback → meghívjuk
    onSave?.(taskData);
  };

  // JSX render rész
  return (
    <View className="mt-2 space-y-2">
      {/* Description input mező */}
      <TextInput
        className="border border-gray-300 p-2 text-sm rounded"
        placeholder="Description..."
        value={desc}
        onChangeText={(text) => {
          // Frissítjük a lokális state-et
          setDesc(text);

          // Értesítjük a parent komponenst
          onChangeDescription?.(text);
        }}
        multiline
      />

      {/* Deadline input mező */}
      <TextInput
        className="border border-gray-300 p-2 text-sm rounded"
        placeholder="Deadline (YYYY-MM-DD)"
        value={date}
        onChangeText={(text) => {
          // Lokális state frissítés
          setDate(text);

          // Parent értesítése
          onChangeDeadline?.(text);
        }}
      />

      {/* Task típus választó gombok */}
      <View className="flex-row space-x-2">
        {/* A három típuson végig iterálunk */}
        {["home", "work", "other"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => {
              // Új típus beállítása
              setType(t);

              // Parent értesítése
              onChangeTaskType(t);
            }}
            // Dinamikus stílus a kiválasztott gombhoz
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
            {/* Gomb szövege */}
            <Text className="text-sm font-mono">{t.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ha "other" van kiválasztva → custom input jelenik meg */}
      {type === "other" && (
        <TextInput
          className="border border-gray-300 p-2 text-sm rounded mt-2"
          placeholder="Enter custom type"
          value={customType}
          onChangeText={(text) => {
            // Egyedi típus state frissítése
            setCustomType(text);

            // Parent értesítése
            onChangeTaskType(text);
          }}
        />
      )}

      {/* Subtask lista komponens */}
      <SubtaskList subtasks={subtasks} onChangeSubtasks={onChangeSubtasks} />

      {/* Mentés gomb */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-blue-500 p-3 rounded mt-3 items-center"
      >
        <Text className="text-white font-bold">SAVE TASK</Text>
      </TouchableOpacity>
    </View>
  );
};
