import { Priority } from "@/types/Priority";
import { TaskType } from "@/components/TaskDetails";

export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority?: Priority | null;
  description?: string;
  deadline?: string;
  taskType?: TaskType;
  subtasks?: Subtask[];
};
