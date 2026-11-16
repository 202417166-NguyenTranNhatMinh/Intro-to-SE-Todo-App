# Sprint 1 - Task CRUD

## 1. Mục tiêu

Hoàn thành chức năng quản lý công việc cơ bản: tạo, xem danh sách, xem chi tiết, cập nhật và xóa task.

## 2. Task model

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| `id` | UUID | Tự sinh | ID công việc |
| `title` | string | Có | Tiêu đề |
| `description` | string | Không | Mô tả |
| `status` | enum | Có | `TODO`, `IN_PROGRESS`, `DONE`; mặc định `TODO` |
| `dueDate` | date hoặc null | Không | Hạn hoàn thành |
| `createdAt` | datetime | Tự sinh | Thời điểm tạo |
| `updatedAt` | datetime | Tự sinh | Thời điểm cập nhật |

## 3. API endpoints

Base path: `/api/tasks`

| Method | Endpoint | Chức năng |
|---|---|---|
| `POST` | `/api/tasks` | Tạo task |
| `GET` | `/api/tasks` | Lấy danh sách task |
| `GET` | `/api/tasks/:id` | Lấy chi tiết một task |
| `PATCH` | `/api/tasks/:id` | Cập nhật task |
| `DELETE` | `/api/tasks/:id` | Xóa task |

### 3.1. Tạo task

`POST /api/tasks`

Request:
```json
{
  "title": "Hoàn thành bài tập",
  "description": "Bài tập môn lập trình",
  "dueDate": "2026-11-20"
}
```

Response: `201 Created` và task vừa tạo.

### 3.2. Lấy danh sách

`GET /api/tasks`

Response: `200 OK` và mảng task.

### 3.3. Lấy chi tiết

`GET /api/tasks/:id`

Response:
- `200 OK`: task tồn tại.
- `404 Not Found`: không tìm thấy task.

### 3.4. Cập nhật task

`PATCH /api/tasks/:id`

Chỉ gửi các trường cần thay đổi. Ví dụ:

```json
{
  "title": "Hoàn thành bài tập lớn",
  "status": "IN_PROGRESS"
}
```

Response: `200 OK` và task sau cập nhật.

### 3.5. Xóa task

`DELETE /api/tasks/:id`

Response: `204 No Content`.

## 4. Quy tắc xử lý

- `title` là bắt buộc, không được để chuỗi rỗng.
- `status` chỉ nhận `TODO`, `IN_PROGRESS`, `DONE`.
- `dueDate` phải là ngày hợp lệ hoặc `null`.
- ID không đúng định dạng hoặc không tồn tại: trả lỗi phù hợp.
- Không cho phép cập nhật các trường hệ thống như `id`, `createdAt`.
- Khi cập nhật, tự động thay đổi `updatedAt`.
- Dùng parameterized query khi truy vấn PostgreSQL.
- Nếu dự án đã có xác thực, giữ nguyên middleware và chỉ cho phép người dùng thao tác trên task thuộc quyền của họ. Không xây dựng lại hệ thống đăng nhập trong Sprint 1.

## 5. Error response

Dùng một cấu trúc lỗi thống nhất:

```json
{
  "message": "Task not found"
}
```

Các status code chính:
- `400`: dữ liệu đầu vào không hợp lệ.
- `404`: không tìm thấy task.
- `500`: lỗi hệ thống.

## 6. Tiêu chí hoàn thành

- [ ] Tạo task thành công với dữ liệu hợp lệ.
- [ ] Lấy được danh sách task.
- [ ] Lấy được chi tiết task theo ID.
- [ ] Cập nhật được một hoặc nhiều trường.
- [ ] Xóa được task.
- [ ] Dữ liệu đầu vào không hợp lệ được từ chối.
- [ ] Các trường hệ thống không bị client tự ý ghi đè.
- [ ] Có kiểm thử cho các API CRUD và các trường hợp lỗi cơ bản.
