// React importálása
// useState -> komponens állapot tárolása
// useEffect -> mellékhatások kezelése (pl. szűrés minden változásnál)
import React, { useEffect, useState } from "react";

// React Native UI elemek
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// A Priority enum és Task típus importálása a fő index fájlból
import { Priority, Task } from "../index";

// Props típus definiálása
// Ez határozza meg, hogy milyen adatokat kap a SearchBar komponens
type Props = {
  tasks: Task[]; // a teljes task lista
  onFilter: (filtered: Task[]) => void; // callback a szűrt lista visszaküldésére
};

// SearchBar komponens
export const SearchBar: React.FC<Props> = ({ tasks, onFilter }) => {
  // Szöveg alapú keresés állapota
  const [textFilter, setTextFilter] = useState("");

  // Kategória szűrő állapota
  // alapból "all"
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Prioritás szűrő
  // lehet Priority enum vagy "all"
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  // Csak határidős taskok megjelenítése
  const [deadlineOnly, setDeadlineOnly] = useState(false);

  // useEffect akkor fut le,
  // amikor valamelyik dependency megváltozik
  useEffect(() => {
    // Task lista szűrése
    const filtered = tasks.filter((task) => {
      // Szöveg alapú keresés
      // kisbetűsítés azért kell hogy case-insensitive legyen
      const textMatch = task.text
        .toLowerCase()
        .includes(textFilter.toLowerCase());

      // Kategória ellenőrzése
      // ha "all" -> minden megfelel
      const categoryMatch =
        categoryFilter === "all" ||
        (task.taskType || "").toLowerCase() === categoryFilter;

      // Prioritás ellenőrzése
      const priorityMatch =
        priorityFilter === "all" || task.priority === priorityFilter;

      // Határidő ellenőrzése
      // ha deadlineOnly true -> csak határidős taskok
      const deadlineMatch = !deadlineOnly || !!task.deadline;

      // Task akkor kerül bele a listába
      // ha minden feltétel igaz
      return textMatch && categoryMatch && priorityMatch && deadlineMatch;
    });

    // A szűrt lista visszaküldése a parent komponensnek
    onFilter(filtered);
  }, [textFilter, categoryFilter, priorityFilter, deadlineOnly, tasks]);

  // JSX render
  return (
    // Fő konténer
    <View className="mb-4 space-y-2">
      {/* Szöveg alapú kereső mező */}
      <TextInput
        placeholder="Search..."
        value={textFilter}
        // Ha változik a szöveg
        // frissítjük az állapotot
        onChangeText={setTextFilter}
        className="border border-gray-300 rounded-lg p-3"
      />

      {/* Kategória szűrő gombok */}
      <View className="flex-row space-x-2">
        {/* Kategóriák listája */}
        {["all", "work", "home", "other"].map((cat) => (
          <TouchableOpacity
            key={cat}
            // Dinamikus stílus
            className={`px-3 py-1 rounded-lg border ${
              categoryFilter === cat
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300"
            }`}
            // Kategória kiválasztása
            onPress={() => setCategoryFilter(cat)}
          >
            <Text
              className={categoryFilter === cat ? "text-white" : "text-black"}
            >
              {/* Szöveg formázása */}
              {cat === "all"
                ? "All"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Prioritás szűrő gombok */}
      <View className="flex-row space-x-2">
        {["all", "low", "medium", "high"].map((p) => (
          <TouchableOpacity
            key={p}
            className={`px-3 py-1 rounded-lg border ${
              priorityFilter === p
                ? "bg-green-500 border-green-500"
                : "border-gray-300"
            }`}
            // Prioritás beállítása
            onPress={() =>
              setPriorityFilter(p === "all" ? "all" : (p as Priority))
            }
          >
            <Text
              className={priorityFilter === p ? "text-white" : "text-black"}
            >
              {p === "all"
                ? "All priority"
                : p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Határidő szűrő gomb */}
      <TouchableOpacity
        className={`px-3 py-1 rounded-lg border ${
          deadlineOnly ? "bg-purple-500 border-purple-500" : "border-gray-300"
        }`}
        // Deadline szűrő ki/be kapcsolása
        onPress={() => setDeadlineOnly(!deadlineOnly)}
      >
        <Text className={deadlineOnly ? "text-white" : "text-black"}>
          {deadlineOnly ? "Deadline only" : "All"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
