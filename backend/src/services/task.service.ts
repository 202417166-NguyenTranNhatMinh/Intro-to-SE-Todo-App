import { taskRepo, TaskRepo } from "../repo/task.repo";
import { CreateTaskInput, TaskDto, TaskModel, UpdateTaskInput } from "../models/task";

export class TaskService {
  constructor(private repo: TaskRepo = taskRepo) { }

  private mapToDto(task: TaskModel): TaskDto {
    let dueDate: string | null = null;
    if (task.due_date) {
      dueDate = task.due_date instanceof Date ? task.due_date.toISOString().split("T")[0] : String(task.due_date).split("T")[0];
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate,
      createdAt: task.created_at instanceof Date ? task.created_at.toISOString() : new Date(task.created_at).toISOString(),
      updatedAt: task.updated_at instanceof Date ? task.updated_at.toISOString() : new Date(task.updated_at).toISOString(),
    };
  }

  async getAllTasks(): Promise<TaskDto[]> {
    const tasks = await this.repo.findAll();
    return tasks.map((t) => this.mapToDto(t));
  }

  async getTaskById(id: string): Promise<TaskDto | null> {
    const task = await this.repo.findById(id);
    return task ? this.mapToDto(task) : null;
  }

  async createTask(input: CreateTaskInput): Promise<TaskDto> {
    const task = await this.repo.create(input);
    return this.mapToDto(task);
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<TaskDto | null> {
    const updated = await this.repo.update(id, input);
    return updated ? this.mapToDto(updated) : null;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}

export const taskService = new TaskService();
