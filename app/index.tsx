import { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import "../global.css";

import { DeleteModal } from "../components/DeleteModal";
import { SearchBar } from "../components/SearchBar";
import { TaskInput } from "../components/TaskInput";
import { TaskItem } from "../components/TaskItem";

import { supabase } from "../utils/supabase"; // Supabase client

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  description?: string;
  deadline?: string;
  taskType?: string;
  subtasks?: { id: string; text: string; completed: boolean }[];
};

export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

const sortTasks = (a: Task, b: Task) => {
  if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }

  if (!a.deadline) return 1;
  if (!b.deadline) return -1;

  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
};

export default function Index() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // --- Load tasks from Supabase on component mount
  useEffect(() => {
    const loadTasks = async () => {
      const { data, error } = await supabase.from("todos").select("*");
      console.log(data)
      if (error) console.error("Error fetching tasks:", error);
      else if (data) setTasks(data as Task[]);
    };
    loadTasks();
  }, []);

  // --- Add a new task
  const addTask = async () => {
    if (taskText.trim() === "") return;

    const newTask: Partial<Task> = {
      title: taskText,
      completed: false,
      priority: Priority.Low,
    };

    const { data, error } = await supabase
      .from("todos")
      .insert([newTask])
      .select();

    if (error) console.error("Error inserting task:", error);
    else if (data) {
      setTasks((prev) => [...prev, ...(data as Task[])]);
      setTaskText("");
    }
  };

  // --- Toggle task completion
  const toggleCompleted = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { data, error } = await supabase
      .from("todos")
      .update({ completed: !task.completed })
      .eq("id", id)
      .select();

    if (error) console.error("Error updating task:", error);
    else if (data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    }
  };

  // --- Open delete modal
  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  // --- Confirm deletion
  const confirmDelete = async () => {
    if (!selectedId) return;

    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", selectedId);
    if (error) console.error("Error deleting task:", error);
    else setTasks((prev) => prev.filter((t) => t.id !== selectedId));

    setModalVisible(false);
    setSelectedId(null);
  };

  // --- Update a task partially
  const onChangeTask = async (id: string, updatedTask: Partial<Task>) => {
    const { data, error } = await supabase
      .from("todos")
      .update(updatedTask)
      .eq("id", id)
      .select();

    if (error) console.error("Error updating task:", error);
    else if (data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)),
      );
    }
  };

  const finishedTasks = useMemo(
    () => tasks.filter((t) => t.completed),
    [tasks],
  );

  const displayedTasks = useMemo(() => {
    const source = filteredTasks.length > 0 ? filteredTasks : tasks;
    return [...source].sort(sortTasks);
  }, [tasks, filteredTasks]);

  return (
    <View className="flex-1 bg-gray-100 px-5 pt-16">
      <SearchBar tasks={tasks} onFilter={setFilteredTasks} />
      <TaskInput
        taskText={taskText}
        setTaskText={setTaskText}
        addTask={addTask}
      />

      <FlatList
        data={displayedTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <TaskItem
              task={item}
              isExpanded={expandedId === item.id}
              onToggleExpand={(id) =>
                setExpandedId(expandedId === id ? null : id)
              }
              toggleCompleted={toggleCompleted}
              openDeleteModal={openDeleteModal}
              onChangeTask={onChangeTask}
              showFinishedLabel={
                finishedTasks.findIndex((t) => t.id === item.id) === 0
              }
            />
          </View>
        )}
      />

      <DeleteModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}
