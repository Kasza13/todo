// Import React and the required hooks
import React, { useEffect, useState } from "react";
// Import React Native UI components
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// Import Priority and Task types from the project
import { Priority } from "@/types/Priority";
import { Task } from "../app/index";

// Props type definition for the SearchBar component
type Props = {
  tasks: Task[]; // Array of tasks to filter
  onFilter: (filtered: Task[]) => void; // Callback to return the filtered list
  onShowDetails?: (show: boolean) => void; // Optional callback for the detailed filters state
};

// SearchBar functional component
export const SearchBar: React.FC<Props> = ({
  tasks, // All tasks
  onFilter, // Callback for the filtered list
  onShowDetails, // Callback to show/hide details
}) => {
  // Filter states
  const [textFilter, setTextFilter] = useState(""); // Search input text
  const [categoryFilter, setCategoryFilter] = useState<string>("all"); // Category filter
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all"); // Priority filter
  const [deadlineOnly, setDeadlineOnly] = useState(false); // Deadline-only filter state
  const [detailsFilter, setDetailsFilter] = useState(false); // Detailed filter button state

  // useEffect to handle filtering and callbacks
  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const textMatch = (task.title ?? "")
        .toLowerCase()
        .includes(textFilter.toLowerCase());

      const categoryMatch =
        categoryFilter === "all" ||
        (typeof task.taskType === "string" &&
          task.taskType.toLowerCase() === categoryFilter);

      const priorityMatch =
        priorityFilter === "all" || task.priority === priorityFilter;

      const deadlineMatch = !deadlineOnly || !!task.deadline;

      return textMatch && categoryMatch && priorityMatch && deadlineMatch;
    });

    onFilter(filtered);
    onShowDetails?.(detailsFilter);
  }, [
    textFilter,
    categoryFilter,
    priorityFilter,
    deadlineOnly,
    tasks,
    detailsFilter,
    onFilter,
    onShowDetails,
  ]);

  return (
    <View className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      {/* SEARCH INPUT */}
      <TextInput
        placeholder="Search tasks..."
        value={textFilter}
        onChangeText={setTextFilter}
        className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 mb-3"
      />

      {/* DETAILS FILTER BUTTON */}
      <TouchableOpacity
        className={`px-4 py-2 rounded-xl border self-start mb-3 ${
          detailsFilter
            ? "bg-blue-600 border-blue-600"
            : "bg-white border-gray-300"
        }`}
        onPress={() => setDetailsFilter(!detailsFilter)}
      >
        <Text
          className={`text-sm ${detailsFilter ? "text-white" : "text-gray-700"}`}
        >
          Filter Details
        </Text>
      </TouchableOpacity>

      {/* Other filters appear only when Filter Details is enabled */}
      {detailsFilter && (
        <>
          {/* CATEGORY FILTER */}
          <Text className="text-xs text-gray-500 mb-1">Category</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {["all", "work", "home", "other"].map((cat) => (
              <TouchableOpacity
                key={cat}
                className={`px-3 py-2 rounded-xl border ${
                  categoryFilter === cat
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
                onPress={() => setCategoryFilter(cat)}
              >
                <Text
                  className={`text-sm ${categoryFilter === cat ? "text-white" : "text-gray-700"}`}
                >
                  {cat === "all"
                    ? "All"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PRIORITY FILTER */}
          <Text className="text-xs text-gray-500 mb-1">Priority</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {["all", "low", "medium", "high"].map((p) => (
              <TouchableOpacity
                key={p}
                className={`px-3 py-2 rounded-xl border ${
                  priorityFilter === p
                    ? "bg-green-500 border-green-500"
                    : "bg-white border-gray-300"
                }`}
                onPress={() =>
                  setPriorityFilter(p === "all" ? "all" : (p as Priority))
                }
              >
                <Text
                  className={`text-sm ${priorityFilter === p ? "text-white" : "text-gray-700"}`}
                >
                  {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DEADLINE FILTER */}
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
              {deadlineOnly ? "Deadline only" : "All tasks"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
