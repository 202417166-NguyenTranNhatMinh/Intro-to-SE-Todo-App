import {
  insertTask,
  findTasksByUser,
  findTaskByIdForUser,
  updateTaskForUser,
  deleteTaskForUser,
  type Task,
  type UpdateTaskInput,
} from "../repo/taskRepo";


export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export function validateTaskTitle(title: unknown): string {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new TaskValidationError("Task title is required");
  }

  return title.trim();
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export function validateTaskStatus(status: unknown): TaskStatus {
  if (status === undefined) {
    return "TODO";
  }

  if (
    status === "TODO" ||
    status === "IN_PROGRESS" ||
    status === "DONE"
  ) {
    return status;
  }

  throw new TaskValidationError("Invalid task status");
}

export function validateTaskDescription(
  description: unknown
): string | null {
  if (description === undefined || description === null) {
    return null;
  }

  if (typeof description !== "string") {
    throw new TaskValidationError("Invalid task description");
  }

  return description;
}

export function validateTaskDueDate(
  dueDate: unknown
): string | null {
  if (dueDate === undefined || dueDate === null) {
    return null;
  }

  if (
    typeof dueDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)
  ) {
    throw new TaskValidationError("Invalid task dueDate");
  }

  const date = new Date(`${dueDate}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== dueDate
  ) {
    throw new TaskValidationError("Invalid task dueDate");
  }

  return dueDate;
}

export async function createTaskForUser(
  userId: string,
  body: unknown
): Promise<Task> {
  // 1. Kiểm tra dữ liệu đầu vào có phải object hay không
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    throw new TaskValidationError("Invalid task data");
  }

  const data = body as Record<string, unknown>;

  // 2. Kiểm tra từng trường theo API Specification
  const title = validateTaskTitle(data.title);
  const description = validateTaskDescription(data.description);
  const status = validateTaskStatus(data.status);
  const dueDate = validateTaskDueDate(data.dueDate);

  // 3. Lưu task vào PostgreSQL
  const task = await insertTask({
    userId,
    title,
    description,
    status,
    dueDate,
  });

  // 4. Trả về task vừa tạo
  return task;
}
export async function getTasksForUser(
  userId: string
): Promise<Task[]> {
  return await findTasksByUser(userId);
}

export async function getTaskByIdForUser(
  taskId: string,
  userId: string
): Promise<Task | null> {
  // Kiểm tra định dạng UUID trước khi truy vấn PostgreSQL
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(taskId)) {
    throw new TaskValidationError("Invalid task ID");
  }

  // Lấy Task theo ID và người sở hữu
  return await findTaskByIdForUser(taskId, userId);
}


export function validateTaskPatch(
  body: unknown
): UpdateTaskInput {
  // 1. Kiểm tra request body
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    throw new TaskValidationError("Invalid task data");
  }

  const data = body as Record<string, unknown>;

  // 2. Chỉ cho phép cập nhật 4 trường
  const allowedFields = [
    "title",
    "description",
    "status",
    "dueDate",
  ];

  const fields = Object.keys(data);

  if (fields.length === 0) {
    throw new TaskValidationError("No fields to update");
  }

  for (const field of fields) {
    if (!allowedFields.includes(field)) {
      throw new TaskValidationError(
        `Field ${field} cannot be updated`
      );
    }

    if (data[field] === undefined) {
      throw new TaskValidationError(
        `Invalid task field: ${field}`
      );
    }
  }

  // 3. Chỉ thêm những trường được gửi lên
  const updates: UpdateTaskInput = {};

  if ("title" in data) {
    updates.title = validateTaskTitle(data.title);
  }

  if ("description" in data) {
    updates.description =
      validateTaskDescription(data.description);
  }

  if ("status" in data) {
    updates.status = validateTaskStatus(data.status);
  }

  if ("dueDate" in data) {
    updates.dueDate = validateTaskDueDate(data.dueDate);
  }

  return updates;
}

export async function patchTaskForUser(
  taskId: string,
  userId: string,
  body: unknown
): Promise<Task | null> {
  // 1. Kiểm tra định dạng Task ID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(taskId)) {
    throw new TaskValidationError("Invalid task ID");
  }

  // 2. Kiểm tra và chuẩn hóa dữ liệu cập nhật
  const updates = validateTaskPatch(body);

  // 3. Gọi Repository để cập nhật PostgreSQL
  return await updateTaskForUser(
    taskId,
    userId,
    updates
  );
}

export async function deleteTaskByIdForUser(
  taskId: string,
  userId: string
): Promise<boolean> {
  // 1. Kiểm tra định dạng Task ID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(taskId)) {
    throw new TaskValidationError("Invalid task ID");
  }

  // 2. Gọi Repository để xóa Task
  return await deleteTaskForUser(taskId, userId);
}
