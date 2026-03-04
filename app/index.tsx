import { useState } from "react";
import { FlatList, View } from "react-native";
import "../global.css";

import { DeleteModal } from "./components/DeleteModal";
import { TaskInput } from "./components/TaskInput";
import { TaskItem } from "./components/TaskItem";

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

  const onChangeTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)),
    );
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
      <TaskInput
        taskText={taskText}
        setTaskText={setTaskText}
        addTask={addTask}
      />

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isExpanded = expandedId === item.id;
          const isFirstFinished =
            finishedTasks.length > 0 &&
            index === sortedTasks.findIndex((t) => t.completed);

          return (
            <TaskItem
              task={item}
              isExpanded={isExpanded}
              onToggleExpand={(id) => setExpandedId(isExpanded ? null : id)}
              toggleCompleted={toggleCompleted}
              openDeleteModal={openDeleteModal}
              onChangeTask={onChangeTask}
              showFinishedLabel={isFirstFinished}
            />
          );
        }}
      />

      <DeleteModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}
