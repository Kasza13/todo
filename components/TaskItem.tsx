import { Priority } from "@/types/Priority";
import { FC, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { TaskDetails, TaskType } from "./TaskDetails";

export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  description?: string;
  deadline?: string;
  taskType?: TaskType;
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
}) => {
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

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

  const handleRename = () => {
    onChangeTask(task.id, { title: newTitle.trim() || task.title });
    setRenameModalVisible(false);
  };

  return (
    <View className="mb-3">
      {showFinishedLabel && (
        <Text className="mb-2 text-gray-400 text-xs uppercase tracking-widest">
          Finished
        </Text>
      )}

      <View className="bg-white rounded-xl border border-gray-200 p-3">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-row items-center flex-1"
            onPress={() => onToggleExpand(task.id)}
          >
            <Text className="mr-2 text-gray-500">{isExpanded ? "▲" : "▼"}</Text>

            <Text
              className={`${getPriorityColor()} text-base font-medium ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
              {task.priority === Priority.High ? " ★" : ""}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center space-x-3">
            <TouchableOpacity onPress={() => toggleCompleted(task.id)}>
              <Text className="text-sm text-gray-500">
                {task.completed ? "Done" : "Active"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setRenameModalVisible(true)}>
              <Text className="text-sm text-blue-500">Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openDeleteModal(task.id)}>
              <Text className="text-sm text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

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

      {/* RENAME MODAL */}
      <Modal visible={renameModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-80 p-4 rounded-xl">
            <Text className="text-lg font-bold mb-3">Rename task</Text>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              className="border border-gray-300 rounded-xl p-3 mb-3"
              placeholder="New title..."
            />

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity onPress={() => setRenameModalVisible(false)}>
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRename}>
                <Text className="text-blue-500 font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
