// FC (Function Component) típus importálása Reactből
import { FC } from "react";
// React Native UI komponensek importálása
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Props típusdefiníció a TaskInput komponenshez
type Props = {
  taskText: string; // A beviteli mező értéke
  setTaskText: (text: string) => void; // Callback a szöveg frissítésére
  addTask: () => void; // Callback új task hozzáadására
};

// TaskInput funkcionális komponens definiálása
export const TaskInput: FC<Props> = ({ taskText, setTaskText, addTask }) => (
  // Fő wrapper: sorba rendezett elemek (input és gomb)
  <View className="flex-row items-center mb-4">
    {/* Input mező */}
    <TextInput
      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800" // Stílus
      placeholder="New task..." // Helykitöltő szöveg
      placeholderTextColor="#9ca3af" // Szürke helykitöltő szín
      value={taskText} // Input értéke a state-ből
      onChangeText={setTaskText} // Input változásakor frissítjük a state-et
    />

    {/* Add gomb */}
    <TouchableOpacity
      onPress={addTask}
      style={{
        marginLeft: 12, // ml-3
        backgroundColor: "#3B82F6", // bg-blue-500
        paddingHorizontal: 16, // px-4
        paddingVertical: 12, // py-3
        borderRadius: 12, // rounded-xl
        pointerEvents: "auto",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "500" }}>Add</Text>
    </TouchableOpacity>
  </View>
);
