export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
}

export type UpdateTaskRequest = Partial<CreateTaskRequest>;

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
