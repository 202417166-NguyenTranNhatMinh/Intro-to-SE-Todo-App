import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { createTaskForUser, getTasksForUser, getTaskByIdForUser, patchTaskForUser, deleteTaskByIdForUser } from "../services/taskService";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/response";

function taskId(req: AuthenticatedRequest): string {
  if (typeof req.params.id !== "string") throw AppError.badRequest("Invalid task ID");
  return req.params.id;
}
export async function createTask(req: AuthenticatedRequest, res: Response) {
  return sendSuccess(res, await createTaskForUser(req.userId!, req.body), "Task created", 201);
}
export async function getTasks(req: AuthenticatedRequest, res: Response) {
  return sendSuccess(res, await getTasksForUser(req.userId!));
}
export async function getTaskById(req: AuthenticatedRequest, res: Response) {
  const task = await getTaskByIdForUser(taskId(req), req.userId!);
  if (!task) throw AppError.notFound("Task not found");
  return sendSuccess(res, task);
}
export async function patchTask(req: AuthenticatedRequest, res: Response) {
  const task = await patchTaskForUser(taskId(req), req.userId!, req.body);
  if (!task) throw AppError.notFound("Task not found");
  return sendSuccess(res, task);
}
export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  if (!await deleteTaskByIdForUser(taskId(req), req.userId!)) throw AppError.notFound("Task not found");
  return res.status(204).send();
}
