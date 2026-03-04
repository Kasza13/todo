import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
      [...prev]
        .map((task) =>
          task.id === id ? { ...task, important: !task.important } : task,
        )
        .sort((a, b) => Number(b.important) - Number(a.important)),
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

  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  );

  const finishedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks],
  );

  return (
    <View className="flex-1 px-6 pt-16">
      <View className="flex-row mb-5">
        <TextInput
          className="flex-1 border border-gray-400 p-3 rounded-lg"
          placeholder="New task..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity
          className="ml-3 bg-black px-4 justify-center rounded-lg"
          onPress={addTask}
        >
          <Text className="text-white font-semibold">Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...activeTasks, ...finishedTasks]}
        keyExtractor={(item) => item.id}
        ListFooterComponent={null}
        renderItem={({ item, index }) => {
          const isFirstFinished =
            finishedTasks.length > 0 && index === activeTasks.length;

          return (
            <>
              {isFirstFinished && (
                <View className="my-6 bg-green-200 rounded-lg p-4 items-center">
                  <Text className="font-semibold">Finished</Text>
                </View>
              )}

              <View
                className={`flex-row justify-between items-center p-3 border border-gray-300 rounded-lg mb-3 ${
                  item.completed ? "opacity-60" : ""
                }`}
              >
                <TouchableOpacity onPress={() => toggleCompleted(item.id)}>
                  <Text
                    className={`text-lg ${
                      item.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="mr-4"
                    onPress={() => toggleImportant(item.id)}
                  >
                    <Text className="text-xl">
                      {item.important ? "⭐" : "☆"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="mr-4"
                    onPress={() => toggleCompleted(item.id)}
                  >
                    <Text className="text-sm">
                      {item.completed ? "Finished ✓" : "Work in progress..."}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => openDeleteModal(item.id)}>
                    <Text className="text-red-500 font-bold">X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          );
        }}
      />

      <Modal transparent animationType="fade" visible={modalVisible}>
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="w-3/4 bg-white p-6 rounded-xl">
            <Text className="text-base mb-5 font-semibold">Delete task?</Text>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="mr-4"
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-black px-4 py-2 rounded-md"
                onPress={confirmDelete}
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
