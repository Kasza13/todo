import { FC } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// A komponens által kapott propsok típusa
type Props = {
  taskText: string; // Az input mező aktuális szövege
  setTaskText: (text: string) => void; // Függvény az input szöveg frissítésére
  addTask: () => void; // Függvény új task hozzáadására
};

// TaskInput komponens
export const TaskInput: FC<Props> = ({ taskText, setTaskText, addTask }) => (
  // Konténer: egy sorban jelenik meg az input és a gomb
  <View className="flex-row mb-4">
    {/* Szövegbeviteli mező új taskhoz */}
    <TextInput
      className="flex-1 border border-gray-300 p-2" // kitölti a rendelkezésre álló helyet
      placeholder="New task..." // placeholder szöveg
      value={taskText} // az aktuális input érték
      onChangeText={setTaskText} // amikor a user gépel → frissíti az állapotot
    />

    {/* Task hozzáadó gomb */}
    <TouchableOpacity
      className="ml-2 px-3 justify-center border border-gray-300"
      onPress={addTask} // gomb megnyomásakor új task jön létre
    >
      <Text>Add</Text>
    </TouchableOpacity>
  </View>
);
