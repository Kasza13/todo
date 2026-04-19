import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { Priority } from "@/types/Priority";
import { Task } from "../app/(tabs)/index";

type Props = {
  tasks: Task[];
  onFilter: (filtered: Task[]) => void;
  onShowDetails?: (show: boolean) => void;
};

export const SearchBar: React.FC<Props> = ({
  tasks,
  onFilter,
  onShowDetails,
}) => {
  const [textFilter, setTextFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [deadlineOnly, setDeadlineOnly] = useState(false);
  const [detailsFilter, setDetailsFilter] = useState(false);

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
    <View className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm">
      {/* SEARCH INPUT */}
      <TextInput
        placeholder="Search tasks..."
        placeholderTextColor="#9CA3AF"
        value={textFilter}
        onChangeText={setTextFilter}
        className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-base mb-3 text-gray-900 dark:text-white"
      />

      {/* DETAILS BUTTON */}
      <TouchableOpacity
        onPress={() => setDetailsFilter(!detailsFilter)}
        className={`self-start px-4 py-2 rounded-full ${
          detailsFilter
            ? "bg-gray-900 dark:bg-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            detailsFilter
              ? "text-white dark:text-black"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          Filters
        </Text>
      </TouchableOpacity>

      {/* FILTERS */}
      {detailsFilter && (
        <View className="mt-4">
          {/* CATEGORY */}
          <Text className="text-xs text-gray-400 mb-2">Category</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {["all", "work", "home", "other"].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full ${
                  categoryFilter === cat
                    ? "bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <Text
                  className={`text-sm ${
                    categoryFilter === cat
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {cat === "all"
                    ? "All"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PRIORITY */}
          <Text className="text-xs text-gray-400 mb-2">Priority</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {["all", "low", "medium", "high"].map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() =>
                  setPriorityFilter(p === "all" ? "all" : (p as Priority))
                }
                className={`px-4 py-2 rounded-full ${
                  priorityFilter === p
                    ? "bg-red-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <Text
                  className={`text-sm ${
                    priorityFilter === p
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DEADLINE */}
          <TouchableOpacity
            onPress={() => setDeadlineOnly(!deadlineOnly)}
            className={`self-start px-4 py-2 rounded-full ${
              deadlineOnly ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`text-sm ${
                deadlineOnly ? "text-white" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Deadline only
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
