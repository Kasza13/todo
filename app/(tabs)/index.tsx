import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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
    router.replace("/login");
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
          style={styles.reactLogo}
        />
      }
    >
      {/* PROFILE SECTION */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Username</ThemedText>
        <ThemedText>{profile?.username}</ThemedText>

        <ThemedText type="subtitle">Full name</ThemedText>
        <ThemedText>{profile?.full_name}</ThemedText>
      </ThemedView>

      {/* LOGOUT */}
      <Pressable onPress={logout} style={styles.logoutButton}>
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>

      {/* SEARCH */}
      <Text className="text-gray-700 text-lg font-semibold mb-2">
        Search Tasks
      </Text>
      <SearchBar tasks={tasks} onFilter={setFilteredTasks} />

      {/* TASK LIST */}
      <Text className="text-gray-700 text-lg font-semibold mt-4 mb-2">
        Task List
      </Text>

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

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  logoutButton: {
    alignSelf: "flex-end",
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
  },
});
