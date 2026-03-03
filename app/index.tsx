import { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import "../global.css";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  important: boolean;
};

export default function Index() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addTask = () => {
    if (taskText.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      important: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskText("");
  };

  const toggleCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const toggleImportant = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, important: !task.important } : task,
      ),
    );
  };

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      setTasks((prev) => prev.filter((task) => task.id !== selectedId));
    }
    setModalVisible(false);
    setSelectedId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="New task..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={{ color: "white" }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <TouchableOpacity onPress={() => toggleCompleted(item.id)}>
              <Text
                style={[styles.taskText, item.completed && styles.completed]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleImportant(item.id)}>
                <Text style={{ marginRight: 15 }}>
                  {item.important ? "⭐" : "☆"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openDeleteModal(item.id)}>
                <Text style={styles.delete}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Delete task?</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmDelete}
              >
                <Text style={{ color: "white" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "black",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  delete: {
    color: "red",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "75%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    marginRight: 15,
  },
  confirmBtn: {
    backgroundColor: "black",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
});*/

/* tailwind (kész), completed/done button elkészítése  , a lista legyen külön komponens. a delete kapjon alertet -> külön komponens (kész)*/
