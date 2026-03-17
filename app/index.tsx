// React és React Native hook-ok importálása
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

// Globális stílusok importálása
import "../global.css";

// Komponensek importálása
import { DeleteModal } from "../components/DeleteModal";
import { SearchBar } from "../components/SearchBar";
import { TaskInput } from "../components/TaskInput";
import { TaskItem } from "../components/TaskItem";

// Task típus definiálása
export type Task = {
  id: string; // Egyedi azonosító
  text: string; // Feladat szövege
  completed: boolean; // Kész státusz
  priority: Priority; // Prioritás szint
  description?: string; // Opcionális leírás
  deadline?: string; // Opcionális határidő
  taskType?: string; // Opcionális típus
  subtasks?: { id: string; text: string; completed: boolean }[]; // Opcionális alfeladatok
};

// Prioritás enum
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

// Prioritás súlyozás a rendezéshez
const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

// Task rendező függvény
const sortTasks = (a: Task, b: Task) => {
  // Először prioritás alapján
  if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }

  // Ha nincs határidő
  if (!a.deadline) return 1;
  if (!b.deadline) return -1;

  // Határidő szerint növekvő sorrend
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
};

// Fő komponens
export default function Index() {
  // Lokális állapotok
  const [taskText, setTaskText] = useState(""); // Input mező
  const [tasks, setTasks] = useState<Task[]>([]); // Összes task
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Szűrt taskok
  const [modalVisible, setModalVisible] = useState(false); // Delete modal láthatósága
  const [selectedId, setSelectedId] = useState<string | null>(null); // Törlendő task ID
  const [expandedId, setExpandedId] = useState<string | null>(null); // Kibővített task ID

  // Új task hozzáadása
  const addTask = () => {
    if (taskText.trim() === "") return; // Üres szöveg nem engedélyezett

    const newTask: Task = {
      id: Date.now().toString(), // Egyedi ID
      text: taskText,
      completed: false,
      priority: Priority.Low, // Alapértelmezett prioritás
    };

    setTasks((prev) => [...prev, newTask]); // Task hozzáadása
    setTaskText(""); // Input törlése
  };

  // Completed státusz váltása
  const toggleCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Delete modal megnyitása
  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  // Delete megerősítés
  const confirmDelete = () => {
    if (selectedId) {
      setTasks((prev) => prev.filter((task) => task.id !== selectedId));
    }

    setModalVisible(false);
    setSelectedId(null);
  };

  // Task frissítése
  const onChangeTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    );
  };

  // Befejezett taskok
  const finishedTasks = useMemo(
    () => tasks.filter((t) => t.completed),
    [tasks],
  );

  // Megjelenítendő taskok: szűrt vagy összes, rendezve
  const displayedTasks = useMemo(() => {
    const source = filteredTasks.length > 0 ? filteredTasks : tasks;
    return [...source].sort(sortTasks);
  }, [tasks, filteredTasks]);

  return (
    <View className="flex-1 bg-gray-100 px-5 pt-16">
      {/* Search bar komponens */}
      <SearchBar tasks={tasks} onFilter={setFilteredTasks} />

      {/* Task input komponens */}
      <TaskInput
        taskText={taskText}
        setTaskText={setTaskText}
        addTask={addTask}
      />

      {/* Task lista */}
      <FlatList
        data={displayedTasks} // Megjelenítendő taskok
        keyExtractor={(item) => item.id} // Egyedi kulcs
        contentContainerStyle={{ paddingBottom: 120 }} // Alul padding
        ItemSeparatorComponent={() => <View className="h-3" />} // Elem közötti távolság
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <TaskItem
              task={item} // Task adatai
              isExpanded={expandedId === item.id} // Kibővítés állapota
              onToggleExpand={(id) =>
                setExpandedId(expandedId === id ? null : id)
              } // Kibővítés váltása
              toggleCompleted={toggleCompleted} // Completed státusz váltása
              openDeleteModal={openDeleteModal} // Delete modal megnyitása
              onChangeTask={onChangeTask} // Task frissítése
              showFinishedLabel={
                finishedTasks.findIndex((t) => t.id === item.id) === 0
              } // "Finished" label az első kész tasknál
            />
          </View>
        )}
      />

      {/* Delete modal */}
      <DeleteModal
        visible={modalVisible} // Láthatóság
        onCancel={() => setModalVisible(false)} // Cancel callback
        onConfirm={confirmDelete} // Confirm callback
      />
    </View>
  );
}
