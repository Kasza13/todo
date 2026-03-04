import { FC } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteModal: FC<Props> = ({ visible, onCancel, onConfirm }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View className="flex-1 bg-black/20 justify-center items-center">
      <View className="w-3/4 bg-white p-4">
        <Text className="mb-4">Delete task?</Text>
        <View className="flex-row justify-end space-x-4">
          <TouchableOpacity onPress={onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm}>
            <Text className="text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
