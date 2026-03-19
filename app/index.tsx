// Import React and React Native hooks
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

// Import global styles
import "../global.css";

// Import components
import { DeleteModal } from "../components/DeleteModal";
import { SearchBar } from "../components/SearchBar";
import { TaskInput } from "../components/TaskInput";
import { TaskItem } from "../components/TaskItem";

// Define Task type
export type Task = {
  id: string; // Unique identifier
  text: string; // Task text
  completed: boolean; // Completed status
  priority: Priority; // Priority level
  description?: string; // Optional description
  deadline?: string; // Optional deadline
  taskType?: string; // Optional type
  subtasks?: { id: string; text: string; completed: boolean }[]; // Optional subtasks
};

// Priority enum
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

// Priority weighting for sorting
const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

// Task sorting function
const sortTasks = (a: Task, b: Task) => {
  // First sort by priority
  if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }

  // If there is no deadline
  if (!a.deadline) return 1;
  if (!b.deadline) return -1;

  // Sort by deadline in ascending order
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
};

// Main component
export default function Index() {
  // Local states
  const [taskText, setTaskText] = useState(""); // Input field
  const [tasks, setTasks] = useState<Task[]>([]); // All tasks
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Filtered tasks
  const [modalVisible, setModalVisible] = useState(false); // Delete modal visibility
  const [selectedId, setSelectedId] = useState<string | null>(null); // Task ID to delete
  const [expandedId, setExpandedId] = useState<string | null>(null); // Expanded task ID

  // Add new task
  const addTask = () => {
    if (taskText.trim() === "") return; // Empty text is not allowed

    const newTask: Task = {
      id: Date.now().toString(), // Unique ID
      text: taskText,
      completed: false,
      priority: Priority.Low, // Default priority
    };

    setTasks((prev) => [...prev, newTask]); // Add task
    setTaskText(""); // Clear input
  };

  // Toggle completed status
  const toggleCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Open delete modal
  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedId) {
      setTasks((prev) => prev.filter((task) => task.id !== selectedId));
    }

    setModalVisible(false);
    setSelectedId(null);
  };

  // Update task
  const onChangeTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    );
  };

  // Finished tasks
  const finishedTasks = useMemo(
    () => tasks.filter((t) => t.completed),
    [tasks],
  );

  // Tasks to display: filtered or all, sorted
  const displayedTasks = useMemo(() => {
    const source = filteredTasks.length > 0 ? filteredTasks : tasks;
    return [...source].sort(sortTasks);
  }, [tasks, filteredTasks]);

  return (
    <View className="flex-1 bg-gray-100 px-5 pt-16">
      {/* Search bar component */}
      <SearchBar tasks={tasks} onFilter={setFilteredTasks} />

      {/* Task input component */}
      <TaskInput
        taskText={taskText}
        setTaskText={setTaskText}
        addTask={addTask}
      />

      {/* Task list */}
      <FlatList
        data={displayedTasks} // Tasks to display
        keyExtractor={(item) => item.id} // Unique key
        contentContainerStyle={{ paddingBottom: 120 }} // Bottom padding
        ItemSeparatorComponent={() => <View className="h-3" />} // Space between items
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <TaskItem
              task={item} // Task data
              isExpanded={expandedId === item.id} // Expanded state
              onToggleExpand={(id) =>
                setExpandedId(expandedId === id ? null : id)
              } // Toggle expand
              toggleCompleted={toggleCompleted} // Toggle completed status
              openDeleteModal={openDeleteModal} // Open delete modal
              onChangeTask={onChangeTask} // Update task
              showFinishedLabel={
                finishedTasks.findIndex((t) => t.id === item.id) === 0
              } // "Finished" label for the first completed task
            />
          </View>
        )}
      />

      {/* Delete modal */}
      <DeleteModal
        visible={modalVisible} // Visibility
        onCancel={() => setModalVisible(false)} // Cancel callback
        onConfirm={confirmDelete} // Confirm callback
      />
    </View>
  );
}
