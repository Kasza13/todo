import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  important: boolean;
  onToggleImportant: () => void;
  description?: string;
  onChangeDescription?: (text: string) => void;
  deadline?: string;
  onChangeDeadline?: (date: string) => void;
};

export default function TaskDetails({
  important,
  onToggleImportant,
  description = "",
  onChangeDescription,
  deadline = "",
  onChangeDeadline,
}: Props) {
  const [desc, setDesc] = useState(description);
  const [date, setDate] = useState(deadline);

  return (
    <View style={{ marginTop: 8 }}>
      {/* Important */}
      <TouchableOpacity
        onPress={onToggleImportant}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}
      >
        <Text style={{ fontSize: 14, color: "#555", marginRight: 6 }}>
          {important ? "★" : "☆"} Mark Important
        </Text>
      </TouchableOpacity>

      {/* Description */}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 4,
          fontSize: 14,
          marginBottom: 6,
        }}
        placeholder="Description..."
        value={desc}
        onChangeText={(text) => {
          setDesc(text);
          onChangeDescription?.(text);
        }}
        multiline
      />

      {/* Deadline */}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 4,
          fontSize: 14,
        }}
        placeholder="Deadline (YYYY-MM-DD)"
        value={date}
        onChangeText={(text) => {
          setDate(text);
          onChangeDeadline?.(text);
        }}
      />
    </View>
  );
}
