import { Priority } from "@/types/Priority";
import { Task } from "@/types/task";
import { FC, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { TaskDetails } from "./TaskDetails";

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

  const handleRename = () => {
    onChangeTask(task.id, { title: newTitle.trim() || task.title });
    setRenameModalVisible(false);
  };

  const priorityDot =
    task.priority === Priority.High
      ? "bg-red-500"
      : task.priority === Priority.Medium
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <View className="mb-4">
      {showFinishedLabel && (
        <Text className="mb-2 text-gray-400 text-xs tracking-widest uppercase">
          Finished
        </Text>
      )}

      {/* CARD */}
      <View className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm">
        {/* HEADER */}
        <View className="flex-row items-center justify-between">
          {/* LEFT */}
          <TouchableOpacity
            className="flex-row items-center flex-1"
            onPress={() => onToggleExpand(task.id)}
          >
            <View className={`w-2 h-2 rounded-full mr-3 ${priorityDot}`} />

            <Text
              className={`text-base font-medium flex-1 ${
                task.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {task.title}
            </Text>

            <Text className="text-gray-400 ml-2">{isExpanded ? "▾" : "▸"}</Text>
          </TouchableOpacity>

          {/* ACTIONS */}
          <View className="flex-row gap-2 ml-3">
            <TouchableOpacity
              onPress={() => toggleCompleted(task.id)}
              className={`px-3 py-2 rounded-full ${
                task.completed ? "bg-gray-200 dark:bg-gray-700" : "bg-green-500"
              }`}
            >
              <Text className="text-xs text-white">
                {task.completed ? "Done" : "Active"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRenameModalVisible(true)}
              className="px-3 py-2 rounded-full bg-blue-500"
            >
              <Text className="text-xs text-white">Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openDeleteModal(task.id)}
              className="px-3 py-2 rounded-full bg-red-500"
            >
              <Text className="text-xs text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* EXPANDED */}
        {isExpanded && (
          <View className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
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
          <View className="bg-white dark:bg-gray-800 w-80 p-5 rounded-3xl">
            <Text className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Rename task
            </Text>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="New title..."
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 mb-4 text-gray-900 dark:text-white"
            />

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setRenameModalVisible(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700"
              >
                <Text className="text-gray-700 dark:text-gray-200">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRename}
                className="px-4 py-2 rounded-xl bg-green-600"
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
