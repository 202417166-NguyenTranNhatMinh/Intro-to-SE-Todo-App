
import { pool } from "../config/db";
import type { TaskStatus } from "../services/taskService";

// Kiểu dữ liệu Task trả về cho API Sprint 1
export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Dữ liệu đầu vào để tạo Task
export type CreateTaskInput = {
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
};

// Tạo Task mới trong PostgreSQL
export async function insertTask(
  input: CreateTaskInput
): Promise<Task> {
  const result = await pool.query<Task>(
    `
    INSERT INTO tasks (
      owner_user_id,
      title,
      description,
      status,
      due_at,
      position
    )
    SELECT
      $1::uuid,
      $2::text,
      $3::text,
      $4::task_status,

      -- Chuyển dueDate sang TIMESTAMPTZ
      CASE
        WHEN $5::text IS NULL THEN NULL
        ELSE (
          $5::date::timestamp
          AT TIME ZONE 'Asia/Ho_Chi_Minh'
        )
      END,

      -- Đưa Task mới vào cuối danh sách của User
      COALESCE(
        (
          SELECT MAX(t.position) + 1
          FROM tasks t
          WHERE t.owner_user_id = $1::uuid
        ),
        1
      )

    RETURNING
      id,
      title,
      description,
      status,

      -- Trả dueDate về dạng YYYY-MM-DD
      TO_CHAR(
        due_at AT TIME ZONE 'Asia/Ho_Chi_Minh',
        'YYYY-MM-DD'
      ) AS "dueDate",

      created_at AS "createdAt",
      updated_at AS "updatedAt"
    `,
    [
      input.userId,
      input.title,
      input.description,
      input.status,
      input.dueDate,
    ]
  );

  return result.rows[0];
}
export async function findTasksByUser(
  userId: string
): Promise<Task[]> {
  const result = await pool.query<Task>(
    `
    SELECT
      id,
      title,
      description,
      status,
      TO_CHAR(
        due_at AT TIME ZONE 'Asia/Ho_Chi_Minh',
        'YYYY-MM-DD'
      ) AS "dueDate",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM tasks
    WHERE owner_user_id = $1
    ORDER BY position ASC, created_at ASC, id ASC
    `,
    [userId]
  );

  return result.rows;
}

export async function findTaskByIdForUser(
  taskId: string,
  userId: string
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
    SELECT
      id,
      title,
      description,
      status,
      TO_CHAR(
        due_at AT TIME ZONE 'Asia/Ho_Chi_Minh',
        'YYYY-MM-DD'
      ) AS "dueDate",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM tasks
    WHERE id = $1
      AND owner_user_id = $2
    `,
    [taskId, userId]
  );

  return result.rows[0] ?? null;
}

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
};

export async function updateTaskForUser(
  taskId: string,
  userId: string,
  updates: UpdateTaskInput
): Promise<Task | null> {
  const setClauses: string[] = [];
  const values: unknown[] = [];

  // Chỉ cập nhật title nếu được cung cấp
  if (updates.title !== undefined) {
    values.push(updates.title);
    setClauses.push(`title = $${values.length}`);
  }

  // Cập nhật description, cho phép null
  if (updates.description !== undefined) {
    values.push(updates.description);
    setClauses.push(`description = $${values.length}`);
  }

  // Cập nhật status
  if (updates.status !== undefined) {
    values.push(updates.status);
    setClauses.push(
      `status = $${values.length}::task_status`
    );
  }

  // Cập nhật deadline theo ERD mới
  if (updates.dueDate !== undefined) {
    values.push(updates.dueDate);
    const param = `$${values.length}`;

    setClauses.push(`
      due_at = CASE
        WHEN ${param}::text IS NULL THEN NULL
        ELSE (
          ${param}::date::timestamp
          AT TIME ZONE 'Asia/Ho_Chi_Minh'
        )
      END
    `);
  }

  // Không cho phép câu lệnh UPDATE rỗng
  if (setClauses.length === 0) {
    throw new Error("No fields to update");
  }

  // Tự cập nhật thời gian chỉnh sửa
  setClauses.push("updated_at = NOW()");

  values.push(taskId, userId);

  const taskIdParam = `$${values.length - 1}`;
  const userIdParam = `$${values.length}`;

  const result = await pool.query<Task>(
    `
    UPDATE tasks
    SET ${setClauses.join(", ")}
    WHERE id = ${taskIdParam}::uuid
      AND owner_user_id = ${userIdParam}::uuid
    RETURNING
      id,
      title,
      description,
      status,
      TO_CHAR(
        due_at AT TIME ZONE 'Asia/Ho_Chi_Minh',
        'YYYY-MM-DD'
      ) AS "dueDate",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    `,
    values
  );

  return result.rows[0] ?? null;
}

export async function deleteTaskForUser(
  taskId: string,
  userId: string
): Promise<boolean> {
  const result = await pool.query(
    `
    DELETE FROM tasks
    WHERE id = $1::uuid
      AND owner_user_id = $2::uuid
    RETURNING id
    `,
    [taskId, userId]
  );

  return (result.rowCount ?? 0) > 0;
}
