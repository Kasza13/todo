import { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TaskDetails } from "./TaskDetails";

type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  description?: string;
  deadline?: string;
  subtasks?: Subtask[];
};

type Props = {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  toggleCompleted: (id: string) => void;
  openDeleteModal: (id: string) => void;
  onChangeTask: (id: string, updatedTask: Partial<Task>) => void;
  showFinishedLabel?: boolean;
};

export const TaskItem: FC<Props> = ({
  task,
  isExpanded,
  onToggleExpand,
  toggleCompleted,
  openDeleteModal,
  onChangeTask,
  showFinishedLabel = false,
}) => (
  <>
    {showFinishedLabel && (
      <View className="my-4">
        <Text className="text-gray-500 font-mono">Finished</Text>
      </View>
    )}
    <View className="border-b border-gray-200 py-3">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => onToggleExpand(task.id)}
        >
          <Text className="mr-2">{isExpanded ? "▲" : "▼"}</Text>
          <Text
            className={`font-mono ${
              task.priority === "high"
                ? "text-red-500"
                : task.priority === "medium"
                  ? "text-yellow-500"
                  : "text-black"
            }`}
          >
            {task.text} {task.priority === "high" ? "★" : ""}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => toggleCompleted(task.id)}>
            <Text className="text-sm text-gray-500">
              {task.completed ? "Done" : "Active"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openDeleteModal(task.id)}>
            <Text className="text-sm text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isExpanded && (
        <TaskDetails
          priority={task.priority}
          onChangePriority={(level) =>
            onChangeTask(task.id, { priority: level })
          }
          description={task.description}
          onChangeDescription={(text) =>
            onChangeTask(task.id, { description: text })
          }
          deadline={task.deadline}
          onChangeDeadline={(date) => onChangeTask(task.id, { deadline: date })}
          subtasks={task.subtasks || []}
          onChangeSubtasks={(updated) =>
            onChangeTask(task.id, { subtasks: updated })
          }
        />
      )}
    </View>
  </>
);
