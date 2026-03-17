// FC (Function Component) típust importáljuk Reactből
import { FC } from "react";
// React Native UI komponensek importálása
import { Modal, Text, TouchableOpacity, View } from "react-native";

// Props típusdefiníció a DeleteModal komponenshez
type Props = {
  visible: boolean; // Modal láthatósága
  onCancel: () => void; // Callback a Cancel gombra
  onConfirm: () => void; // Callback a Delete gombra
};

// DeleteModal funkcionális komponens
export const DeleteModal: FC<Props> = ({ visible, onCancel, onConfirm }) => (
  // Modal komponens React Native-ből
  <Modal
    transparent // Háttér átlátszó
    animationType="fade" // Animáció típusa: fade in/out
    visible={visible} // Láthatóság a prop alapján
  >
    {/* Sötétített háttér */}
    <View className="flex-1 bg-black/30 justify-center items-center">
      {/* Modal tartalom */}
      <View className="w-3/4 bg-white rounded-xl p-5 shadow-lg">
        {/* Kérdés szöveg */}
        <Text className="text-center text-base font-medium mb-5">
          Are you sure you want to delete this task?
        </Text>

        {/* Gombok sor */}
        <View className="flex-row justify-end space-x-4">
          {/* Cancel gomb */}
          <TouchableOpacity
            onPress={onCancel} // Cancel callback meghívása
            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100"
          >
            <Text className="text-gray-800 font-medium">Cancel</Text>
          </TouchableOpacity>

          {/* Delete gomb */}
          <TouchableOpacity
            onPress={onConfirm} // Confirm callback meghívása
            className="px-4 py-2 rounded-lg bg-red-500"
          >
            <Text className="text-white font-medium">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
export default DeleteModal;
