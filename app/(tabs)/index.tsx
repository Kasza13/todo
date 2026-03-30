import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";

import { DeleteModal } from "@/components/DeleteModal";
import { SearchBar } from "@/components/SearchBar";
import { TaskItem } from "@/components/TaskItem";
import { supabase } from "@/utils/supabase";

import "@/global.css";

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

const priorityOrder: Record<Priority, number> = {
  [Priority.High]: 3,
  [Priority.Medium]: 2,
  [Priority.Low]: 1,
};

const sortTasks = (a: Task, b: Task) => {
  if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }
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

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  useEffect(() => {
    const loadTasks = async () => {
      const { data, error } = await supabase.from("todos").select("*");
      if (error) {
        console.error("Error fetching tasks:", error);
        return;
      }
      if (data) setTasks(data as Task[]);
    };
    loadTasks();
  }, []);

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
    await supabase.from("todos").update(updatedTask).eq("id", id);
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
      {/* PROFILE SECTION */}
      <ThemedView className="flex-row items-center gap-2 mb-4">
        <ThemedText type="title" lightColor="#11181C" darkColor="#ECEDEE">
          Welcome!
        </ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView className="gap-2 mb-4">
        <ThemedText type="subtitle" lightColor="#11181C" darkColor="#ECEDEE">
          Username
        </ThemedText>
        <ThemedText lightColor="#11181C" darkColor="#ECEDEE">
          {profile?.username}
        </ThemedText>

        <ThemedText type="subtitle" lightColor="#11181C" darkColor="#ECEDEE">
          Full name
        </ThemedText>
        <ThemedText lightColor="#11181C" darkColor="#ECEDEE">
          {profile?.full_name}
        </ThemedText>
      </ThemedView>

      {/* LOGOUT */}
      <Pressable
        className="self-end bg-red-500 px-4 py-2 rounded-lg mb-4"
        onPress={logout}
      >
        <ThemedText lightColor="#fff" darkColor="#fff">
          Logout
        </ThemedText>
      </Pressable>

      {/* SEARCH */}
      <ThemedText
        type="subtitle"
        className="mb-2"
        lightColor="#11181C"
        darkColor="#ECEDEE"
      >
        Search Tasks
      </ThemedText>
      <SearchBar tasks={tasks} onFilter={setFilteredTasks} />

      {/* TASK LIST */}
      <ThemedText
        type="subtitle"
        className="mt-4 mb-2"
        lightColor="#11181C"
        darkColor="#ECEDEE"
      >
        Task List
      </ThemedText>

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

      <DeleteModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </ParallaxScrollView>
  );
}
