
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";

import {
  createTaskForUser,
  getTasksForUser,
  getTaskByIdForUser,
  patchTaskForUser,
  deleteTaskByIdForUser,
  TaskValidationError,
} from "../services/taskService";


// 1. POST /api/tasks - Tạo Task
export async function createTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const task = await createTaskForUser(
      req.userId,
      req.body
    );

    return res.status(201).json(task);
  } catch (error) {
    if (error instanceof TaskValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    next(error);
  }
}
// 2. GET /api/tasks - Lấy danh sách Task
export async function getTasks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const tasks = await getTasksForUser(req.userId);

    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}
// 3. GET /api/tasks/:id - Lấy chi tiết Task
export async function getTaskById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const taskId = req.params.id;

    // Kiểm tra kiểu dữ liệu để tránh lỗi TS2345
    if (typeof taskId !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await getTaskByIdForUser(
      taskId,
      req.userId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    if (error instanceof TaskValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    next(error);
  }
}
// 4. PATCH /api/tasks/:id - Cập nhật Task
export async function patchTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const taskId = req.params.id;

    // Kiểm tra kiểu dữ liệu của Task ID
    if (typeof taskId !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    // Gọi Service để cập nhật Task
    const updatedTask = await patchTaskForUser(
      taskId,
      req.userId,
      req.body
    );

    // Task không tồn tại hoặc không thuộc User
    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Trả về Task sau khi cập nhật
    return res.status(200).json(updatedTask);
  } catch (error) {
    if (error instanceof TaskValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    next(error);
  }
}

export async function deleteTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // 1. Kiểm tra người dùng đã đăng nhập
  if (!req.userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    // 2. Lấy Task ID từ URL
    const taskId = req.params.id;

    // Tránh lỗi TypeScript TS2345
    if (typeof taskId !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    // 3. Gọi Service để xóa Task
    const deleted = await deleteTaskByIdForUser(
      taskId,
      req.userId
    );

    // 4. Task không tồn tại hoặc không thuộc User
    if (!deleted) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // 5. Xóa thành công: không trả về JSON
    return res.status(204).send();
  } catch (error) {
    // 6. Xử lý Task ID không hợp lệ
    if (error instanceof TaskValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    // 7. Chuyển lỗi hệ thống đến middleware chung
    next(error);
  }
}
