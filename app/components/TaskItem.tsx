// FC (Function Component) típust importáljuk Reactből
import { FC } from "react";

// React Native UI elemek importálása
import { Text, TouchableOpacity, View } from "react-native";

// Priority enum importálása
import { Priority } from "../index";

// TaskDetails komponens és TaskType importálása
import { TaskDetails, TaskType } from "./TaskDetails";

// Subtask típus definiálása
export type Subtask = {
  id: string; // Egyedi azonosító
  text: string; // Részfeladat szövege
  completed: boolean; // Elkészült-e
};

// Task típus definiálása
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

// TaskItem komponens props típusai
type Props = {
  task: Task; // A megjelenítendő task
  isExpanded: boolean; // Ki van-e bontva
  onToggleExpand: (id: string) => void; // Expand / collapse kezelő
  toggleCompleted: (id: string) => void; // Completed állapot váltása
  openDeleteModal: (id: string) => void; // Törlési modal megnyitása
  onChangeTask: (id: string, updatedTask: Partial<Task>) => void; // Task frissítése
  showFinishedLabel?: boolean; // "Finished" label megjelenítése
};

// TaskItem komponens
export const TaskItem: FC<Props> = ({
  task,
  isExpanded,
  onToggleExpand,
  toggleCompleted,
  openDeleteModal,
  onChangeTask,
  showFinishedLabel = false,
}) => {
  return (
    <>
      {/* Ha ez az első completed task → "Finished" label */}
      {showFinishedLabel && (
        <View className="my-4">
          <Text className="text-gray-500 font-mono">Finished</Text>
        </View>
      )}

      {/* Task blokk */}
      <View className="border-b border-gray-200 py-3">
        {/* Felső sor: cím + gombok */}
        <View className="flex-row justify-between items-center">
          {/* Bal oldal: expand nyíl + task cím */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => onToggleExpand(task.id)}
          >
            {/* Nyíl ikon */}
            <Text className="mr-2">{isExpanded ? "▲" : "▼"}</Text>

            {/* Task szöveg */}
            <Text
              className={`font-mono ${
                task.priority === Priority.High
                  ? "text-red-500"
                  : task.priority === Priority.Medium
                    ? "text-yellow-500"
                    : "text-black"
              }`}
            >
              {task.text}
              {task.priority === Priority.High ? " ★" : ""}
            </Text>
          </TouchableOpacity>

          {/* Jobb oldali gombok */}
          <View className="flex-row items-center space-x-4">
            {/* Completed státusz váltása */}
            <TouchableOpacity onPress={() => toggleCompleted(task.id)}>
              <Text className="text-sm text-gray-500">
                {task.completed ? "Done" : "Active"}
              </Text>
            </TouchableOpacity>

            {/* Törlés gomb */}
            <TouchableOpacity onPress={() => openDeleteModal(task.id)}>
              <Text className="text-sm text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ha ki van bontva → részletek */}
        {isExpanded && (
          <TaskDetails
            // Prioritás
            priority={task.priority}
            onChangePriority={(level: Priority) =>
              onChangeTask(task.id, { priority: level })
            }
            // Description
            description={task.description}
            onChangeDescription={(text: string) =>
              onChangeTask(task.id, { description: text })
            }
            // Deadline
            deadline={task.deadline}
            onChangeDeadline={(date: string) =>
              onChangeTask(task.id, { deadline: date })
            }
            // Subtasks
            subtasks={task.subtasks || []}
            onChangeSubtasks={(updated: Subtask[]) =>
              onChangeTask(task.id, { subtasks: updated })
            }
            // Task típus (home / work / other / custom)
            taskType={task.taskType || ""}
            onChangeTaskType={(type: TaskType) =>
              onChangeTask(task.id, { taskType: type })
            }
          />
        )}
      </View>
    </>
  );
};
