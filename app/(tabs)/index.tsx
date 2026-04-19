import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/utils/supabase";

import { DeleteModal } from "@/components/DeleteModal";
import { SearchBar } from "@/components/SearchBar";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";

import "@/global.css";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority?: Priority | null;
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

const priorityToNumber = (p?: Priority | null) => {
  switch (p) {
    case Priority.Low:
      return 1;
    case Priority.Medium:
      return 2;
    case Priority.High:
      return 3;
    default:
      return null;
  }
};

const sortTasks = (a: Task, b: Task) => {
  if (!a.deadline) return 1;
  if (!b.deadline) return -1;
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
};

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuthContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [taskText, setTaskText] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showGlobalToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    const loadTasks = async () => {
      const { data, error } = await supabase.from("todos").select("*");
      if (error) return console.error(error);
      if (data) setTasks(data as Task[]);
    };

    loadTasks();
  }, []);

  const addTask = async () => {
    if (!taskText.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: taskText, completed: false }])
      .select();

    if (error) return console.error(error);

    if (data) {
      setTasks((prev) => [...prev, ...(data as Task[])]);
      showGlobalToast();
    }

    setTaskText("");
  };

  const toggleCompleted = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    await supabase
      .from("todos")
      .update({ completed: !task.completed })
      .eq("id", id);

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    await supabase.from("todos").delete().eq("id", selectedId);

    setTasks((prev) => prev.filter((t) => t.id !== selectedId));
    setModalVisible(false);
    setSelectedId(null);
  };

  const onChangeTask = async (id: string, updatedTask: Partial<Task>) => {
    const dbUpdate: any = { ...updatedTask };

    if (updatedTask.priority !== undefined) {
      dbUpdate.priority = priorityToNumber(updatedTask.priority);
    }

    await supabase.from("todos").update(dbUpdate).eq("id", id);

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)),
    );
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
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-5 pt-10 pb-10">
        {/* TOAST */}
        {showToast && (
          <View className="absolute top-16 left-5 right-5 z-50">
            <View className="bg-black/80 px-5 py-3 rounded-2xl">
              <Text className="text-white text-center font-medium">
                Task added
              </Text>
            </View>
          </View>
        )}

        {/* TITLE */}
        <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          The TODO
        </Text>

        {/* HEADER */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome 👋
              </Text>
              <Text className="text-gray-500">{profile?.username}</Text>
            </View>

            <Pressable
              onPress={logout}
              className="bg-red-900 px-4 py-2 rounded-xl shadow-sm active:opacity-80"
            >
              <Text className="text-white font-medium">Logout</Text>
            </Pressable>
          </View>

          <View className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm">
            <Text className="text-gray-400 text-sm mb-1">Full name</Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              {profile?.full_name}
            </Text>
          </View>
        </View>

        {/* ADD TASK */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            New Task
          </Text>

          <View className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm">
            <TaskInput
              taskText={taskText}
              setTaskText={setTaskText}
              addTask={addTask}
            />
          </View>
        </View>

        {/* SEARCH */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Search
          </Text>

          <View className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm">
            <SearchBar tasks={tasks} onFilter={setFilteredTasks} />
          </View>
        </View>

        {/* TASK LIST */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks
            </Text>

            <Text className="text-gray-500">
              {finishedTasks.length} / {tasks.length}
            </Text>
          </View>

          <FlatList
            data={displayedTasks}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item }) => (
              <View className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm">
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
        </View>

        {/* DELETE MODAL */}
        <DeleteModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onConfirm={confirmDelete}
        />
      </View>
    </ScrollView>
  );
}
