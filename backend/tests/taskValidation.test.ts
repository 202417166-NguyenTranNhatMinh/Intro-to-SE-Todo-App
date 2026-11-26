import test from "node:test";
import assert from "node:assert/strict";
import {
  validateTaskTitle,
  validateTaskStatus,
  validateTaskDescription,
  validateTaskDueDate,
  validateTaskPatch,
  patchTaskForUser,
} from "../src/services/taskService";


// Test 1: Title hợp lệ
test("Accept valid task title", () => {
  const result = validateTaskTitle("Learn TypeScript");

  assert.equal(result, "Learn TypeScript");
});

// Test 2: Loại bỏ khoảng trắng thừa
test("Trim whitespace from task title", () => {
  const result = validateTaskTitle("  Learn TypeScript  ");

  assert.equal(result, "Learn TypeScript");
});

// Test 3: Từ chối title rỗng
test("Reject empty task title", () => {
  assert.throws(
    () => validateTaskTitle("   "),
    {
      name: "TaskValidationError",
      message: "Task title is required",
    }
  );
});

// Test 4: Từ chối title không phải string
test("Reject non-string task title", () => {
  assert.throws(
    () => validateTaskTitle(123),
    {
      name: "TaskValidationError",
      message: "Task title is required",
    }
  );
});

 // Test 5: Chấp nhận các status hợp lệ
test("Accept valid task statuses", () => {
  assert.equal(validateTaskStatus("TODO"), "TODO");
  assert.equal(
    validateTaskStatus("IN_PROGRESS"),
    "IN_PROGRESS"
  );
  assert.equal(validateTaskStatus("DONE"), "DONE");
});

// Test 6: Status mặc định là TODO
test("Default task status to TODO", () => {
  const result = validateTaskStatus(undefined);

  assert.equal(result, "TODO");
});

// Test 7: Từ chối status không hợp lệ
test("Reject invalid task status", () => {
  assert.throws(
    () => validateTaskStatus("COMPLETED"),
    {
      name: "TaskValidationError",
      message: "Invalid task status",
    }
  );
});

// Test 8: Từ chối status sai kiểu dữ liệu
test("Reject non-string task status", () => {
  assert.throws(
    () => validateTaskStatus(123),
    {
      name: "TaskValidationError",
      message: "Invalid task status",
    }
  );
});

 // Test 9: Description hợp lệ
test("Accept valid task description", () => {
  assert.equal(
    validateTaskDescription("Learn TypeScript basics"),
    "Learn TypeScript basics"
  );
});

// Test 10: Description có thể là null
test("Accept null or missing task description", () => {
  assert.equal(validateTaskDescription(null), null);
  assert.equal(validateTaskDescription(undefined), null);
});

// Test 11: Từ chối description sai kiểu
test("Reject invalid task description", () => {
  assert.throws(
    () => validateTaskDescription(123),
    {
      name: "TaskValidationError",
      message: "Invalid task description",
    }
  );
});

// Test 12: Due Date hợp lệ
test("Accept valid task dueDate", () => {
  assert.equal(
    validateTaskDueDate("2026-12-05"),
    "2026-12-05"
  );
});

// Test 13: Due Date có thể bỏ trống
test("Accept null or missing task dueDate", () => {
  assert.equal(validateTaskDueDate(null), null);
  assert.equal(validateTaskDueDate(undefined), null);
});

// Test 14: Từ chối sai định dạng ngày
test("Reject invalid task dueDate format", () => {
  assert.throws(
    () => validateTaskDueDate("05/12/2026"),
    {
      name: "TaskValidationError",
      message: "Invalid task dueDate",
    }
  );
});

// Test 15: Từ chối ngày không tồn tại
test("Reject nonexistent task dueDate", () => {
  assert.throws(
    () => validateTaskDueDate("2026-02-30"),
    {
      name: "TaskValidationError",
      message: "Invalid task dueDate",
    }
  );
});

const testTaskId = "e71e3a05-cba4-40e8-ac6d-46ea516c42f8";
const testUserId = "00000000-0000-4000-8000-000000000001";

// Test 16: Không cho phép PATCH với body rỗng
test("Reject PATCH with empty body", async () => {
  await assert.rejects(
    patchTaskForUser(testTaskId, testUserId, {}),
    {
      name: "TaskValidationError",
      message: "No fields to update",
    }
  );
});

// Test 17: Không cho phép sửa trường hệ thống
test("Reject PATCH updating createdAt", async () => {
  await assert.rejects(
    patchTaskForUser(testTaskId, testUserId, {
      createdAt: "2020-01-01T00:00:00.000Z",
    }),
    {
      name: "TaskValidationError",
      message: "Field createdAt cannot be updated",
    }
  );
});

// Test 18: PATCH chỉ cập nhật trường được gửi
test("PATCH only includes provided fields", () => {
  const result = validateTaskPatch({
    status: "DONE",
  });

  assert.deepEqual(result, {
    status: "DONE",
  });
});

// Test 19: PATCH tự loại bỏ khoảng trắng của title
test("PATCH trims task title", () => {
  const result = validateTaskPatch({
    title: "  Learn PostgreSQL  ",
  });

  assert.deepEqual(result, {
    title: "Learn PostgreSQL",
  });
});

// Test 20: PATCH cho phép xóa description và dueDate
test("PATCH allows clearing optional fields", () => {
  const result = validateTaskPatch({
    description: null,
    dueDate: null,
  });

  assert.deepEqual(result, {
    description: null,
    dueDate: null,
  });
});
