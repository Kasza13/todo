import { Alert } from "react-native";

export const confirmDelete = (onConfirm: () => void) => {
  Alert.alert("Delete task", "Are you sure you want to delete this task?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Delete",
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
};
