import { Priority } from "@/types/Priority";
import { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TaskDetails, TaskType } from "./TaskDetails";

export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  description?: string;
  deadline?: string;
  taskType?: TaskType;
  subtasks?: Subtask[];
};

// Props for the TaskItem component
type Props = {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  toggleCompleted: (id: string) => void;
  openDeleteModal: (id: string) => void;
  onChangeTask: (id: string, updatedTask: Partial<Task>) => void;
  showFinishedLabel?: boolean;
};

// TaskItem component
export const TaskItem: FC<Props> = ({
  task,
  isExpanded,
  onToggleExpand,
  toggleCompleted,
  openDeleteModal,
  onChangeTask,
  showFinishedLabel = false,
}) => {
  // Returns the text color based on priority
  const getPriorityColor = () => {
    switch (task.priority) {
      case Priority.High:
        return "text-red-500";
      case Priority.Medium:
        return "text-yellow-500";
      default:
        return "text-gray-800";
    }
  };

  return (
    <View className="mb-3">
      {/* Label shown above the first finished task */}
      {showFinishedLabel && (
        <Text className="mb-2 text-gray-400 text-xs uppercase tracking-widest">
          Finished
        </Text>
      )}

      <View className="bg-white rounded-xl border border-gray-200 p-3">
        {/* Header section */}
        <View className="flex-row justify-between items-center">
          {/* Task text + expand toggle */}
          <TouchableOpacity
            style={{ pointerEvents: "auto" }}
            className="flex-row items-center flex-1"
            onPress={() => onToggleExpand(task.id)}
          >
            <Text className="mr-2 text-gray-500">{isExpanded ? "▲" : "▼"}</Text>
            <Text
              className={`${getPriorityColor()} text-base font-medium ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.text}
              {/* High priority indicator */}
              {task.priority === Priority.High ? " ★" : ""}
            </Text>
          </TouchableOpacity>

          {/* Right-side action buttons */}
          <View className="flex-row items-center space-x-4">
            {/* Toggle completed status */}
            <TouchableOpacity
              style={{ pointerEvents: "auto" }}
              onPress={() => toggleCompleted(task.id)}
            >
              <Text className="text-sm text-gray-500">
                {task.completed ? "Done" : "Active"}
              </Text>
            </TouchableOpacity>

            {/* Delete task */}
            <TouchableOpacity
              style={{ pointerEvents: "auto" }}
              onPress={() => openDeleteModal(task.id)}
            >
              <Text className="text-sm text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Task details section */}
        {isExpanded && (
          <View className="mt-3 border-t border-gray-200 pt-3">
            <TaskDetails
              priority={task.priority}
              description={task.description}
              deadline={task.deadline}
              subtasks={task.subtasks || []}
              taskType={task.taskType || ""}
              onChange={(updatedFields) => onChangeTask(task.id, updatedFields)}
            />
          </View>
        )}
      </View>
    </View>
  );
};
