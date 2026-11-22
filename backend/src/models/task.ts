export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TaskModel {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
}
