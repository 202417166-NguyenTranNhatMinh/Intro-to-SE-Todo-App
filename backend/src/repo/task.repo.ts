import { pool } from "../config/db";
import { CreateTaskInput, TaskModel, UpdateTaskInput } from "../models/task";
import { randomUUID } from "crypto";

export class TaskRepo {
  async findAll(): Promise<TaskModel[]> {
    const result = await pool.query<TaskModel>(
      "SELECT id, title, description, status, due_date, created_at, updated_at FROM tasks ORDER BY created_at DESC"
    );
    return result.rows;
  }

  async findById(id: string): Promise<TaskModel | null> {
    const result = await pool.query<TaskModel>(
      "SELECT id, title, description, status, due_date, created_at, updated_at FROM tasks WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async create(input: CreateTaskInput): Promise<TaskModel> {
    const id = randomUUID();
    const result = await pool.query<TaskModel>(
      `INSERT INTO tasks (id, title, description, status, due_date, created_at, updated_at)
       VALUES ($1, $2, $3, 'TODO', $4, NOW(), NOW())
       RETURNING id, title, description, status, due_date, created_at, updated_at`,
      [id, input.title.trim(), input.description ?? null, input.dueDate ?? null]
    );
    return result.rows[0];
  }

  async update(id: string, input: UpdateTaskInput): Promise<TaskModel | null> {
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.title !== undefined) {
      setClauses.push(`title = $${paramIndex++}`);
      values.push(input.title.trim());
    }
    if (input.description !== undefined) {
      setClauses.push(`description = $${paramIndex++}`);
      values.push(input.description);
    }
    if (input.status !== undefined) {
      setClauses.push(`status = $${paramIndex++}`);
      values.push(input.status);
    }
    if (input.dueDate !== undefined) {
      setClauses.push(`due_date = $${paramIndex++}`);
      values.push(input.dueDate);
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    setClauses.push("updated_at = NOW()");
    values.push(id);

    const query = `
      UPDATE tasks
      SET ${setClauses.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, title, description, status, due_date, created_at, updated_at
    `;

    const result = await pool.query<TaskModel>(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING id", [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export const taskRepo = new TaskRepo();
