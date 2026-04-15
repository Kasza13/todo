import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";

import { DeleteModal } from "@/components/DeleteModal";
import { SearchBar } from "@/components/SearchBar";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";
import { supabase } from "@/utils/supabase";

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
      .insert([
        {
          title: taskText,
          completed: false,
        },
      ])
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          className="absolute bottom-0 left-0 w-[290px] h-[178px]"
        />
      }
    >
      {/* TOAST */}
      {showToast && (
        <View className="absolute top-10 left-0 right-0 items-center z-50">
          <View className="bg-green-500 px-4 py-2 rounded shadow">
            <Text className="text-white font-bold">Task added!</Text>
          </View>
        </View>
      )}

      {/* HEADER */}
      <View className="mb-6">
        <ThemedView className="flex-row items-center gap-2 mb-3">
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>

        <View className="bg-white/80 dark:bg-black/20 p-4 rounded-2xl border border-gray-200">
          <ThemedText type="subtitle" className="mb-2">
            Account
          </ThemedText>

          <ThemedText>Username: {profile?.username}</ThemedText>
          <ThemedText>Full name: {profile?.full_name}</ThemedText>
        </View>

        <Pressable
          className="self-end mt-3 bg-red-500 px-4 py-2 rounded-lg"
          onPress={logout}
        >
          <ThemedText lightColor="#fff">Logout</ThemedText>
        </Pressable>
      </View>

      {/* ADD TASK */}
      <View className="mb-6">
        <ThemedText type="subtitle" className="mb-2">
          Add new task
        </ThemedText>

        <TaskInput
          taskText={taskText}
          setTaskText={setTaskText}
          addTask={addTask}
        />
      </View>

      {/* SEARCH */}
      <View className="mb-6">
        <ThemedText type="subtitle" className="mb-2">
          Search tasks
        </ThemedText>

        <SearchBar tasks={tasks} onFilter={setFilteredTasks} />
      </View>

      {/* TASK LIST */}
      <View>
        <View className="flex-row items-center justify-between mb-3">
          <ThemedText type="subtitle">Tasks</ThemedText>
          <ThemedText>
            {finishedTasks.length} / {tasks.length} done
          </ThemedText>
        </View>

        <FlatList
          data={displayedTasks}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
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
      </View>

      {/* DELETE MODAL */}
      <DeleteModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </ParallaxScrollView>
  );
}
