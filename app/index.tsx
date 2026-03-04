import { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../global.css";
import TaskDetails from "./components/TaskDetails";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  description?: string;
  deadline?: string;
};

export default function Index() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addTask = () => {
    if (taskText.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      priority: "low",
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

  const activeTasks = tasks.filter((task) => !task.completed);
  const finishedTasks = tasks.filter((task) => task.completed);

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[b.priority] - priorityOrder[a.priority] !== 0) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <View className="flex-1 px-6 pt-16">
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 border border-gray-300 p-2"
          placeholder="New task..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity
          className="ml-2 px-3 justify-center border border-gray-300"
          onPress={addTask}
        >
          <Text>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isFirstFinished =
            finishedTasks.length > 0 &&
            index === sortedTasks.findIndex((t) => t.completed);

          const isExpanded = expandedId === item.id;

          return (
            <>
              {isFirstFinished && (
                <View className="my-4">
                  <Text className="text-gray-500 font-mono">Finished</Text>
                </View>
              )}

              <View className="border-b border-gray-200 py-3">
                <View className="flex-row justify-between items-center">
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <Text className="mr-2">{isExpanded ? "▲" : "▼"}</Text>
                    <Text
                      className={`font-mono ${
                        item.priority === "high"
                          ? "text-red-500"
                          : item.priority === "medium"
                            ? "text-yellow-500"
                            : "text-gray-400"
                      }`}
                    >
                      {item.text} {item.priority === "high" ? "★" : ""}
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row items-center space-x-4">
                    <TouchableOpacity onPress={() => toggleCompleted(item.id)}>
                      <Text className="text-sm text-gray-500">
                        {item.completed ? "Done" : "Active"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openDeleteModal(item.id)}>
                      <Text className="text-sm text-red-500">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {isExpanded && (
                  <TaskDetails
                    priority={item.priority}
                    onChangePriority={(level) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === item.id ? { ...t, priority: level } : t,
                        ),
                      )
                    }
                    description={item.description}
                    onChangeDescription={(text) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === item.id ? { ...t, description: text } : t,
                        ),
                      )
                    }
                    deadline={item.deadline}
                    onChangeDeadline={(date) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === item.id ? { ...t, deadline: date } : t,
                        ),
                      )
                    }
                  />
                )}
              </View>
            </>
          );
        }}
      />

      <Modal transparent animationType="fade" visible={modalVisible}>
        <View className="flex-1 bg-black/20 justify-center items-center">
          <View className="w-3/4 bg-white p-4">
            <Text className="mb-4">Delete task?</Text>

            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmDelete}>
                <Text className="text-red-500">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
