// React hookok importálása
// useState -> állapot tárolása komponensen belül
// useMemo -> számítás cache-elése, hogy ne fusson újra minden rendernél
import { useMemo, useState } from "react";

// React Native komponensek
// FlatList -> nagy listák hatékony megjelenítésére
// View -> alap konténer komponens
import { FlatList, View } from "react-native";

// Globális stílus (pl. NativeWind / Tailwind)
import "../global.css";

// Saját komponensek importálása
import { DeleteModal } from "./components/DeleteModal"; // törlés megerősítő modal
import { SearchBar } from "./components/SearchBar"; // kereső mező
import { TaskInput } from "./components/TaskInput"; // új task hozzáadása
import { TaskItem } from "./components/TaskItem"; // egy task megjelenítése

// Task típus definiálása TypeScriptben
// Ez határozza meg, hogy egy feladat objektum milyen mezőket tartalmaz
export type Task = {
  id: string; // egyedi azonosító
  text: string; // a feladat szövege
  completed: boolean; // elkészült-e
  priority: Priority; // prioritás
  description?: string; // optional description
  deadline?: string; // optional deadline
  taskType?: string; // optional category
  subtasks?: { id: string; text: string; completed: boolean }[]; // optional subtasks
};

// Prioritás enum
// Segít fix értékek használatában stringek helyett
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

// Prioritási sorrend meghatározása
// Ez segít a rendezésnél
const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

// Task rendező függvény
// Ezt fogjuk használni mindenhol a lista rendezésére
const sortTasks = (a: Task, b: Task) => {
  // Először prioritás szerint rendezünk
  // Magas prioritás kerül előre
  if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }

  // Ha az egyik tasknak nincs határideje
  // akkor az hátrébb kerül
  if (!a.deadline) return 1;
  if (!b.deadline) return -1;

  // Ha mindkettőnek van határideje
  // akkor dátum szerint rendezzük
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
};

// Fő komponens
export default function Index() {
  // Az input mező aktuális szövege
  const [taskText, setTaskText] = useState("");

  // A teljes task lista
  const [tasks, setTasks] = useState<Task[]>([]);

  // Keresés után megjelenített taskok
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Törlés megerősítő modal állapota
  const [modalVisible, setModalVisible] = useState(false);

  // A törlésre kiválasztott task ID
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Melyik task van éppen kibontva
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Új task hozzáadása
  const addTask = () => {
    // Ha az input üres vagy csak szóköz
    // akkor nem adunk hozzá taskot
    if (taskText.trim() === "") return;

    // Új task objektum létrehozása
    const newTask: Task = {
      id: Date.now().toString(), // timestamp alapú ID
      text: taskText, // feladat szövege
      completed: false, // alapból nincs kész
      priority: Priority.Low, // alap prioritás
    };

    // Task hozzáadása a listához
    setTasks((prev) => [...prev, newTask]);

    // Input mező törlése
    setTaskText("");
  };

  // Task completed állapotának váltása
  const toggleCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        // Ha az ID egyezik
        // akkor megfordítjuk a completed értéket
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Törlés modal megnyitása
  const openDeleteModal = (id: string) => {
    // Kiválasztott task mentése
    setSelectedId(id);

    // Modal megjelenítése
    setModalVisible(true);
  };

  // Task törlés megerősítése
  const confirmDelete = () => {
    if (selectedId) {
      // A kiválasztott task eltávolítása
      setTasks((prev) => prev.filter((task) => task.id !== selectedId));
    }

    // Modal bezárása
    setModalVisible(false);

    // Kiválasztás törlése
    setSelectedId(null);
  };

  // Task adatainak frissítése
  const onChangeTask = (id: string, updatedTask: Partial<Task>) => {
    // Partial<Task> azt jelenti
    // hogy nem kell minden mezőt átadni

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    );
  };

  // Befejezett taskok kiszűrése
  // useMemo azért kell
  // hogy csak akkor számolódjon újra
  // ha a tasks lista változik
  const finishedTasks = useMemo(
    () => tasks.filter((t) => t.completed),
    [tasks],
  );

  // Megjelenítendő taskok listája
  // Ha van keresési eredmény -> filteredTasks
  // különben -> tasks
  const displayedTasks = useMemo(() => {
    const source = filteredTasks.length > 0 ? filteredTasks : tasks;

    // Másolat készítése és rendezése
    return [...source].sort(sortTasks);
  }, [tasks, filteredTasks]);

  // JSX render
  return (
    // Fő konténer
    <View className="flex-1 px-6 pt-16">
      {/* Kereső sáv */}
      <SearchBar tasks={tasks} onFilter={setFilteredTasks} />

      {/* Task hozzáadó mező */}
      <TaskInput
        taskText={taskText}
        setTaskText={setTaskText}
        addTask={addTask}
      />

      {/* Task lista megjelenítése */}
      <FlatList
        // A lista adatai
        data={displayedTasks}
        // Kulcs generálása minden elemhez
        keyExtractor={(item) => item.id}
        // Egy lista elem renderelése
        renderItem={({ item, index }) => (
          <TaskItem
            task={item}
            // Kibontott task ellenőrzése
            isExpanded={expandedId === item.id}
            // Expand / collapse kezelése
            onToggleExpand={(id) =>
              setExpandedId(expandedId === id ? null : id)
            }
            // Completed állapot váltása
            toggleCompleted={toggleCompleted}
            // Törlés modal megnyitása
            openDeleteModal={openDeleteModal}
            // Task frissítése
            onChangeTask={onChangeTask}
            // Befejezett label megjelenítése
            showFinishedLabel={
              finishedTasks.findIndex((t) => t.id === item.id) === 0
            }
          />
        )}
      />

      {/* Törlés megerősítő modal */}
      <DeleteModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}


