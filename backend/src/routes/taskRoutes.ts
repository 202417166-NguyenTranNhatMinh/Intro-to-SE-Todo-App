
import { Router } from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  patchTask,
  deleteTask,
} from "../controllers/taskController";

import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// 1. Tạo Task mới
router.post("/", requireAuth, createTask);

// 2. Lấy danh sách Task
router.get("/", requireAuth, getTasks);

// 3. Lấy chi tiết Task theo ID
router.get("/:id", requireAuth, getTaskById);

// 4. Cập nhật Task theo ID
router.patch("/:id", requireAuth, patchTask);

// 5. Xóa Task theo ID
router.delete("/:id", requireAuth, deleteTask);

export default router;
