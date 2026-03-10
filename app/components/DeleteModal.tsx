import { FC } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

// A komponens által kapott propsok
type Props = {
  visible: boolean; // Meghatározza, hogy a modal látható-e
  onCancel: () => void; // Függvény, ami a Cancel gomb megnyomásakor fut
  onConfirm: () => void; // Függvény, ami a Delete gomb megnyomásakor fut
};

// DeleteModal komponens
export const DeleteModal: FC<Props> = ({ visible, onCancel, onConfirm }) => (
  // React Native Modal komponens
  <Modal
    transparent // háttér átlátszó
    animationType="fade" // megjelenési animáció
    visible={visible} // a modal láthatósága
  >
    {/* Sötétített háttér */}
    <View className="flex-1 bg-black/20 justify-center items-center">
      {/* Modal tartalom doboz */}
      <View className="w-3/4 bg-white p-4">
        {/* Kérdés szöveg */}
        <Text className="mb-4">Delete task?</Text>

        {/* Gombok konténere */}
        <View className="flex-row justify-end space-x-4">
          {/* Cancel gomb */}
          <TouchableOpacity onPress={onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>

          {/* Delete gomb */}
          <TouchableOpacity onPress={onConfirm}>
            <Text className="text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
