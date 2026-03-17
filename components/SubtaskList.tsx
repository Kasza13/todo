import { FC, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Subtask (részfeladat) típusa
type Subtask = {
  id: string; // egyedi azonosító
  text: string; // részfeladat szövege
  completed: boolean; // kész van-e
};

// A komponens által kapott propsok
type Props = {
  // adatok amelyeket egy React komponens kívülről kap.
  subtasks?: Subtask[]; // részfeladatok listája (opcionális)
  onChangeSubtasks: (updated: Subtask[]) => void; // függvény a lista frissítésére
};

// SubtaskList komponens
export const SubtaskList: FC<Props> = ({
  subtasks = [], // ha nincs átadva → üres lista
  onChangeSubtasks = () => {}, // alapértelmezett üres függvény
}) => {
  // Lokális state az új subtask szövegéhez
  const [newSubtask, setNewSubtask] = useState("");

  // Új subtask hozzáadása
  const addSubtask = () => {
    // Ha üres vagy csak szóköz → nem csinál semmit
    if (newSubtask.trim() === "") return;

    // Új subtask objektum létrehozása
    const sub: Subtask = {
      id: Date.now().toString(), // egyedi ID
      text: newSubtask, // subtask szöveg
      completed: false, // alapból nincs kész
    };

    // Frissítjük a parent state-et az új subtaskkal
    onChangeSubtasks([...subtasks, sub]);

    // Input mező kiürítése
    setNewSubtask("");
  };

  // Subtask completed állapotának váltása
  const toggleCompleted = (id: string) => {
    onChangeSubtasks(
      subtasks.map(
        (s) =>
          // Ha az ID egyezik → completed érték megfordítása
          s.id === id ? { ...s, completed: !s.completed } : s, //...s, az eredeti objektum minden mezőjét átmásolja
      ),
    );
  };

  // Subtask törlése
  const deleteSubtask = (id: string) => {
    // Szűrés: minden marad, kivéve a törlendő
    onChangeSubtasks(subtasks.filter((s) => s.id !== id));
  };

  return (
    // Konténer
    <View className="mt-2 space-y-2">
      {/* Subtask lista */}
      {subtasks.map((s) => (
        <View
          key={s.id} // React kulcs
          className="flex-row justify-between items-center"
        >
          {/* Subtask szöveg + completed toggle */}
          <TouchableOpacity onPress={() => toggleCompleted(s.id)}>
            <Text
              className={
                s.completed
                  ? "line-through text-gray-400" // ha kész → áthúzott szöveg
                  : ""
              }
            >
              {s.text}
            </Text>
          </TouchableOpacity>

          {/* Törlés gomb */}
          <TouchableOpacity onPress={() => deleteSubtask(s.id)}>
            <Text className="text-red-500">X</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Új subtask hozzáadása */}
      <View className="flex-row mt-2">
        {/* Input mező */}
        <TextInput
          className="flex-1 border p-2"
          placeholder="Add subtask..."
          value={newSubtask}
          onChangeText={setNewSubtask} // gépeléskor state frissítés
        />

        {/* Add gomb */}
        <TouchableOpacity className="ml-2 p-2 border" onPress={addSubtask}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
