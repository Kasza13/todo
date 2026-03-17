// FC (Function Component) típust importáljuk Reactből
import { FC } from "react";

// React Native UI elemek importálása
import { Text, TouchableOpacity, View } from "react-native";

// Priority enum importálása a projekt indexéből
import { Priority } from "@/types/Priority";

// TaskDetails komponens és TaskType importálása
import { TaskDetails, TaskType } from "./TaskDetails";

// Subtask típus definiálása
export type Subtask = {
  id: string; // Egyedi azonosító
  text: string; // Feladat szövege
  completed: boolean; // Kész státusz
};

// Task típus definiálása
export type Task = {
  id: string; // Egyedi azonosító
  text: string; // Feladat szövege
  completed: boolean; // Kész státusz
  priority: Priority; // Prioritás szint
  description?: string; // Opcionális leírás
  deadline?: string; // Opcionális határidő
  taskType?: TaskType; // Opcionális típus
  subtasks?: Subtask[]; // Opcionális alfeladatok
};

// Props típusdefiníció a TaskItem komponenshez
type Props = {
  task: Task; // A megjelenítendő feladat
  isExpanded: boolean; // A részletek kinyitva vannak-e
  onToggleExpand: (id: string) => void; // Callback a részletek kinyitására/bezárására
  toggleCompleted: (id: string) => void; // Callback a completed státusz váltására
  openDeleteModal: (id: string) => void; // Callback a törlés megerősítő megnyitására
  onChangeTask: (id: string, updatedTask: Partial<Task>) => void; // Callback a task frissítésére
  showFinishedLabel?: boolean; // Opcionális: "Finished" label megjelenítése
};

// TaskItem funkcionális komponens definiálása
export const TaskItem: FC<Props> = ({
  task,
  isExpanded,
  onToggleExpand,
  toggleCompleted,
  openDeleteModal,
  onChangeTask,
  showFinishedLabel = false, // Alapértelmezett false
}) => {
  return (
    <>
      {/* Finished label - ha showFinishedLabel true */}
      {showFinishedLabel && (
        <View className="my-4">
          <Text className="text-gray-400 text-xs uppercase tracking-widest">
            Finished
          </Text>
        </View>
      )}

      {/* Task card wrapper */}
      <View className="bg-white rounded-xl border border-gray-200 px-4 py-3">
        {/* Header sor */}
        <View className="flex-row justify-between items-center">
          {/* Bal oldali rész - a feladat szövegével és bővítési nyíllal */}
          <TouchableOpacity
            className="flex-row items-center flex-1"
            onPress={() => onToggleExpand(task.id)} // Részletek nyitása/bezárása
          >
            {/* Nyíl ikon - fel/le az állapottól függően */}
            <Text className="mr-2 text-gray-500">{isExpanded ? "▲" : "▼"}</Text>

            {/* Task szöveg, prioritás és completed státusz stílusok */}
            <Text
              className={`text-base font-medium ${
                task.priority === Priority.High
                  ? "text-red-500"
                  : task.priority === Priority.Medium
                    ? "text-yellow-500"
                    : "text-gray-800"
              } ${task.completed ? "line-through text-gray-400" : ""}`} // Kész feladat áthúzva
            >
              {task.text} {/* Feladat szövege */}
              {task.priority === Priority.High ? " ★" : ""}{" "}
              {/* Csillag magas prioritás esetén */}
            </Text>
          </TouchableOpacity>

          {/* Jobb oldali gombok sor */}
          <View className="flex-row items-center space-x-4">
            {/* Completed váltó gomb */}
            <TouchableOpacity onPress={() => toggleCompleted(task.id)}>
              <Text className="text-sm text-gray-500">
                {task.completed ? "Done" : "Active"}
              </Text>
            </TouchableOpacity>

            {/* Delete gomb */}
            <TouchableOpacity onPress={() => openDeleteModal(task.id)}>
              <Text className="text-sm text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Részletek, ha isExpanded true */}
        {isExpanded && (
          <View className="mt-3 border-t border-gray-200 pt-3">
            {/* TaskDetails komponens, a feladat összes részlete */}
            <TaskDetails
              priority={task.priority} // Prioritás
              onChangePriority={
                (level: Priority) => onChangeTask(task.id, { priority: level }) // Prioritás frissítése
              }
              description={task.description} // Leírás
              onChangeDescription={
                (text: string) => onChangeTask(task.id, { description: text }) // Leírás frissítése
              }
              deadline={task.deadline} // Határidő
              onChangeDeadline={
                (date: string) => onChangeTask(task.id, { deadline: date }) // Határidő frissítése
              }
              subtasks={task.subtasks || []} // Alfeladatok
              onChangeSubtasks={
                (updated: Subtask[]) =>
                  onChangeTask(task.id, { subtasks: updated }) // Alfeladatok frissítése
              }
              taskType={task.taskType || ""} // Task típus
              onChangeTaskType={
                (type: TaskType) => onChangeTask(task.id, { taskType: type }) // Task típus frissítése
              }
            />
          </View>
        )}
      </View>
    </>
  );
};
