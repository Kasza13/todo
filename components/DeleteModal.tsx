// Import the FC (Function Component) type from React
import { FC } from "react";
// Import React Native UI components
import { Modal, Text, TouchableOpacity, View } from "react-native";

// Props type definition for the DeleteModal component
type Props = {
  visible: boolean; // Modal visibility
  onCancel: () => void; // Callback for the Cancel button
  onConfirm: () => void; // Callback for the Delete button
};

// DeleteModal functional component
export const DeleteModal: FC<Props> = ({ visible, onCancel, onConfirm }) => (
  // Modal component from React Native
  <Modal
    transparent // Transparent background
    animationType="fade" // Animation type: fade in/out
    visible={visible} // Visibility controlled by prop
  >
    {/* Dimmed background overlay */}
    <View className="flex-1 bg-black/30 justify-center items-center">
      {/* Modal content */}
      <View className="w-3/4 bg-white rounded-xl p-5 shadow-lg">
        {/* Confirmation message */}
        <Text className="text-center text-base font-medium mb-5">
          Are you sure you want to delete this task?
        </Text>

        {/* Buttons row */}
        <View className="flex-row justify-end space-x-4">
          {/* Cancel button */}
          <TouchableOpacity
            style={{ pointerEvents: "auto" }}
            onPress={onCancel} // Call cancel callback
            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100"
          >
            <Text className="text-gray-800 font-medium">Cancel</Text>
          </TouchableOpacity>

          {/* Delete button */}
          <TouchableOpacity
            style={{ pointerEvents: "auto" }}
            onPress={onConfirm} // Call confirm callback
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
