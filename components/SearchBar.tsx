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
    // Create filtered list
    const filtered = tasks.filter((task) => {
      // Check text match
      const textMatch = task.text
        .toLowerCase()
        .includes(textFilter.toLowerCase());

      // Check category match
      const categoryMatch =
        categoryFilter === "all" || // Allow all categories if "all" is selected
        (typeof task.taskType === "string" &&
          task.taskType.toLowerCase() === categoryFilter);

      // Check priority match
      const priorityMatch =
        priorityFilter === "all" || task.priority === priorityFilter;

      // Check deadline filter
      const deadlineMatch = !deadlineOnly || !!task.deadline;

      // Only include tasks that match all conditions
      return textMatch && categoryMatch && priorityMatch && deadlineMatch;
    });

    // Send filtered list back to the parent component
    onFilter(filtered);

    // If the detailsFilter is enabled, notify the parent
    onShowDetails?.(detailsFilter);
  }, [
    textFilter, // Dependency: text
    categoryFilter, // Dependency: category
    priorityFilter, // Dependency: priority
    deadlineOnly, // Dependency: deadline filter
    tasks, // Dependency: tasks
    detailsFilter, // Dependency: details button
  ]);

  // Return JSX
  return (
    <View className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      {/* SEARCH INPUT */}
      <TextInput
        placeholder="Search tasks..." // Placeholder text
        value={textFilter} // Input value from state
        onChangeText={setTextFilter} // Update state on change
        className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 mb-3"
      />

      {/* DETAILS FILTER BUTTON */}
      <TouchableOpacity
        style={{ pointerEvents: "auto" }}
        className={`px-4 py-2 rounded-xl border self-start mb-3 ${
          detailsFilter
            ? "bg-blue-600 border-blue-600" // Active state style
            : "bg-white border-gray-300" // Inactive state style
        }`}
        onPress={() => setDetailsFilter(!detailsFilter)} // Toggle state on press
      >
        <Text
          className={`text-sm ${
            detailsFilter ? "text-white" : "text-gray-700" // Text color depends on state
          }`}
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
                style={{ pointerEvents: "auto" }}
                key={cat} // Unique key in the list
                className={`px-3 py-2 rounded-xl border ${
                  categoryFilter === cat
                    ? "bg-blue-500 border-blue-500" // Active button style
                    : "bg-white border-gray-300" // Inactive button style
                }`}
                onPress={() => setCategoryFilter(cat)} // Update state on press
              >
                <Text
                  className={`text-sm ${
                    categoryFilter === cat ? "text-white" : "text-gray-700"
                  }`}
                >
                  {/* Capitalize category text */}
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
                style={{ pointerEvents: "auto" }}
                key={p}
                className={`px-3 py-2 rounded-xl border ${
                  priorityFilter === p
                    ? "bg-green-500 border-green-500" // Active button
                    : "bg-white border-gray-300" // Inactive button
                }`}
                onPress={() =>
                  setPriorityFilter(p === "all" ? "all" : (p as Priority))
                } // Update state
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

          {/* DEADLINE FILTER */}
          <TouchableOpacity
            style={{ pointerEvents: "auto" }}
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
              {/* removed the {" "} note */}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
