// Importáljuk a React és szükséges hookokat
import React, { useEffect, useState } from "react";
// Importáljuk a React Native UI komponenseket
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Importáljuk a Priority és Task típusokat a projekt index fájljából
import { Priority } from "@/types/Priority";
import { Task } from "./app/index";

// Props típusdefiníció a SearchBar komponenshez
type Props = {
  tasks: Task[]; // A szűrendő feladatok tömbje
  onFilter: (filtered: Task[]) => void; // Callback a szűrt lista visszaküldésére
  onShowDetails?: (show: boolean) => void; // Opcionális callback a részletes szűrők állapotára
};

// A SearchBar funkcionális komponens deklarációja
export const SearchBar: React.FC<Props> = ({
  tasks, // Az összes task
  onFilter, // Callback a szűrt listára
  onShowDetails, // Callback a részletek megjelenítésére
}) => {
  // Állapotok a szűrőkhöz
  const [textFilter, setTextFilter] = useState(""); // Keresőmező szövege
  const [categoryFilter, setCategoryFilter] = useState<string>("all"); // Kategória szűrő
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all"); // Prioritás szűrő
  const [deadlineOnly, setDeadlineOnly] = useState(false); // Határidős szűrő állapota
  const [detailsFilter, setDetailsFilter] = useState(false); // Részletes szűrő gomb állapota

  // useEffect a szűrés és callback-ek kezelésére
  useEffect(() => {
    // Szűrt lista létrehozása
    const filtered = tasks.filter((task) => {
      // Szöveg egyezés ellenőrzése
      const textMatch = task.text
        .toLowerCase()
        .includes(textFilter.toLowerCase());

      // Kategória egyezés ellenőrzése
      const categoryMatch =
        categoryFilter === "all" || // "all" esetén minden kategória engedélyezett
        (typeof task.taskType === "string" &&
          task.taskType.toLowerCase() === categoryFilter);

      // Prioritás egyezés ellenőrzése
      const priorityMatch =
        priorityFilter === "all" || task.priority === priorityFilter;

      // Határidős szűrő ellenőrzése
      const deadlineMatch = !deadlineOnly || !!task.deadline;

      // Csak azokat a taskokat engedjük át, amelyek minden feltételnek megfelelnek
      return textMatch && categoryMatch && priorityMatch && deadlineMatch;
    });

    // Visszaküldjük a szülő komponensnek a szűrt listát
    onFilter(filtered);

    // Ha a detailsFilter be van kapcsolva, jelezzük a szülőnek
    onShowDetails?.(detailsFilter);
  }, [
    textFilter, // Függőségek: szöveg
    categoryFilter, // Függőség: kategória
    priorityFilter, // Függőség: prioritás
    deadlineOnly, // Függőség: határidős
    tasks, // Függőség: taskok
    detailsFilter, // Függőség: részletek gomb
  ]);

  // JSX visszaadása
  return (
    <View className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      {/* SEARCH INPUT - keresőmező */}
      <TextInput
        placeholder="Search tasks..." // Helykitöltő szöveg
        value={textFilter} // Beviteli mező értéke a state-ből
        onChangeText={setTextFilter} // Változás esetén frissítjük a state-et
        className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 mb-3"
      />

      {/* DETAILS FILTER BUTTON - részletes szűrő gomb */}
      <TouchableOpacity
        className={`px-4 py-2 rounded-xl border self-start mb-3 ${
          detailsFilter
            ? "bg-blue-600 border-blue-600" // Aktív állapot stílusa
            : "bg-white border-gray-300" // Inaktív állapot stílusa
        }`}
        onPress={() => setDetailsFilter(!detailsFilter)} // Gomb lenyomásra váltja az állapotot
      >
        <Text
          className={`text-sm ${
            detailsFilter ? "text-white" : "text-gray-700" // Szöveg színe az állapottól függ
          }`}
        >
          Filter Details
        </Text>
      </TouchableOpacity>

      {/* A többi szűrő csak akkor jelenik meg, ha a Filter Details be van kapcsolva */}
      {detailsFilter && (
        <>
          {/* CATEGORY FILTER - kategória szűrő */}
          <Text className="text-xs text-gray-500 mb-1">Category</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {["all", "work", "home", "other"].map((cat) => (
              <TouchableOpacity
                key={cat} // Egyedi kulcs a listában
                className={`px-3 py-2 rounded-xl border ${
                  categoryFilter === cat
                    ? "bg-blue-500 border-blue-500" // Aktív gomb stílusa
                    : "bg-white border-gray-300" // Inaktív gomb stílusa
                }`}
                onPress={() => setCategoryFilter(cat)} // Kattintásra frissítjük az állapotot
              >
                <Text
                  className={`text-sm ${
                    categoryFilter === cat ? "text-white" : "text-gray-700"
                  }`}
                >
                  {/* Kategória szöveg nagybetűvel */}
                  {cat === "all"
                    ? "All"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PRIORITY FILTER - prioritás szűrő */}
          <Text className="text-xs text-gray-500 mb-1">Priority</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {["all", "low", "medium", "high"].map((p) => (
              <TouchableOpacity
                key={p}
                className={`px-3 py-2 rounded-xl border ${
                  priorityFilter === p
                    ? "bg-green-500 border-green-500" // Aktív gomb
                    : "bg-white border-gray-300" // Inaktív gomb
                }`}
                onPress={() =>
                  setPriorityFilter(p === "all" ? "all" : (p as Priority))
                } // Állapot frissítése
              >
                <Text
                  className={`text-sm ${
                    priorityFilter === p ? "text-white" : "text-gray-700"
                  }`}
                >
                  {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DEADLINE FILTER - határidős szűrő */}
          <TouchableOpacity
            className={`px-4 py-2 rounded-xl border self-start ${
              deadlineOnly
                ? "bg-purple-500 border-purple-500"
                : "bg-white border-gray-300"
            }`}
            onPress={() => setDeadlineOnly(!deadlineOnly)}
          >
            <Text
              className={`text-sm ${deadlineOnly ? "text-white" : "text-gray-700"}`}
            >
              {deadlineOnly ? "Deadline only" : "All tasks"}{" "}
              {/* a {" "} eltávolítva */}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
