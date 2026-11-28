# Entity Model

Mô tả tên gọi, ý nghĩa, trạng thái và quan hệ. Chưa nói về kiểu dữ liệu, index hay khóa ngoại: phần đó thuộc bước thiết kế (plan) khi sinh ERD và migration.

## Thuật ngữ
| Thuật ngữ | Nghĩa |
|---|---|
| Host | Người tạo nhóm; mỗi nhóm đúng một Host. Được thêm, sửa, xóa, giao task, nhắc việc, lập báo cáo |
| Worker | Thành viên của nhóm không phải Host. Thấy mọi task của nhóm, đổi trạng thái, bình luận và tóm tắt AI trên mọi task |
| Người được giao | Thuộc tính của task nhóm: thành viên (Host hoặc Worker) chịu trách nhiệm task đó. Không ảnh hưởng quyền: Worker không được giao vẫn tác động được lên task |
| Thành viên | Người có lời mời Accepted trong nhóm, cùng với Host |
| Task đang mở | Task có trạng thái Todo hoặc In progress |
| Quá hạn (overdue) | Task chưa Done có deadline đã qua (theo ngày, giờ Việt Nam). Task Done không bao giờ quá hạn |
| Danh sách cá nhân / nhóm | Hai phạm vi của task: thuộc một người dùng, hoặc thuộc một nhóm. Danh sách nhóm là màn hình dùng chung của mọi thành viên |

## User
- Đại diện: một người dùng đăng nhập bằng Google.
- Thuộc tính: `google_id` (định danh), email, tên hiển thị, cách xem danh sách cá nhân (`IMPORTANCE` hoặc `TIME`, mặc định `IMPORTANCE`).
- Có nhiều: Task cá nhân, Membership, Comment.
- Là Host của: nhiều Group.

## Phiên đăng nhập (không phải entity lưu trong DB)
- Phiên là một JWT do backend phát hành sau khi xác thực Google, lưu trong cookie HttpOnly. Không có bảng Session.
- JWT chứa định danh User (`sub`) và thời điểm hết hạn (7 ngày). Đăng xuất xóa cookie.
- Hệ quả: không thu hồi được token trước khi hết hạn. Nếu sau này cần (đăng xuất mọi thiết bị, khóa tài khoản), mới thêm bảng lưu phiên.

## Group
- Đại diện: một nhóm làm việc.
- Thuộc tính: tên.
- Có một: Host (User). Có nhiều: Membership, Invitation, Task nhóm, ProgressReport (tối đa 2).

## Invitation
- Đại diện: lời mời một email tham gia nhóm.
- Thuộc: Group. Trạng thái: `Pending`, `Accepted`, `Rejected`.
- Host chỉ thu hồi được lời mời `Pending`. Thu hồi coi như lời mời bị xóa (giả định, vì chưa có trạng thái riêng).

## Membership
- Đại diện: một người là thành viên của một nhóm.
- Thuộc: User, Group. Sinh ra khi lời mời Accepted (Host cũng là thành viên).
- Mất khi thành viên rời nhóm; task đang giao cho họ chuyển thành chưa giao.

## Task
- Đại diện: một công việc.
- Thuộc tính: tiêu đề (bắt buộc), mô tả, deadline (ngày, có thể trống), trạng thái, thời điểm tạo, thời điểm cập nhật.
- Trạng thái: `Todo`, `In progress`, `Done` (đổi qua lại theo mọi hướng). Task `Done` được đổi về `Todo` hoặc `In progress` thì không còn thuộc phần Done: vị trí của nó được tính lại như mọi task chưa Done (theo thời gian, hoặc theo mức quan trọng với task cá nhân), và quá hạn nếu deadline đã qua.
- Phạm vi: thuộc **một User** (task cá nhân) hoặc thuộc **một Group** (task nhóm).
- Chỉ task cá nhân có: mức quan trọng `Normal` (mặc định) hoặc `Important`. Task nhóm không có mức quan trọng.
- Chỉ task nhóm có: người được giao (User, tối đa một, có thể trống).
- Có nhiều: Subtask. Task nhóm có nhiều: Comment, nhiều ReminderLog, và một CommentSummary.
- Quyền với task nhóm: chỉ Host tạo, sửa, xóa, giao; mọi thành viên đổi trạng thái.
- Xóa task nhóm thì xóa toàn bộ dữ liệu gắn với task: Subtask, Comment, CommentSummary, ReminderLog. Ngoại lệ: ReportTaskSnapshot trong báo cáo đã lưu vẫn giữ nguyên để báo cáo sau còn nhận ra task đã bị xóa (giả định, cần nhóm xác nhận).

## Subtask
- Đại diện: công việc con của một task.
- Thuộc đúng một Task cha. Có trạng thái riêng. Xóa task cha thì xóa subtask.
- Subtask của task nhóm: Host tạo, sửa, xóa; mọi thành viên đổi được trạng thái (đề xuất, BR-GRP-12).

## Comment
- Đại diện: một bình luận văn bản trên task nhóm; các bình luận của một task tạo thành cửa sổ chat của task đó.
- Thuộc: Task, người gửi (User, là thành viên của nhóm). Có nội dung và thời điểm gửi.
- Mọi thành viên gửi được trên mọi task của nhóm.
- Chưa có trả lời lồng nhau, sửa hay xóa.

## CommentSummary
- Đại diện: bản tóm tắt trao đổi mới nhất của một task nhóm.
- Thuộc: Task (mỗi task tối đa một). Có: tổng quan ngắn, các điểm đã thống nhất, các điểm còn vướng, thời điểm tạo, và mốc bình luận mới nhất lúc tạo (để biết đã có bình luận mới chưa).
- Mọi thành viên gọi được và xem được, trên mọi task.
- Bị thay khi tạo bản mới; bị xóa khi task bị xóa.

## ProgressReport
- Đại diện: một báo cáo tiến độ của nhóm.
- Thuộc: Group (giữ tối đa 2 báo cáo gần nhất). Có: nhận xét của AI (mỗi nhận định, rủi ro, gợi ý kèm lời giải thích ngắn; phần gợi ý việc nên làm trước nêu tên người đảm nhận), số liệu do backend tính, thời điểm tạo, phần so với lần trước (trừ báo cáo đầu tiên).
- Phần so với lần trước chỉ nói về tiến độ task (hoàn thành, bắt đầu, mở lại, thêm, xóa, đổi deadline, quá hạn, số việc còn lại), không có thông tin thành viên.
- Có nhiều: ReportTaskSnapshot.

## ReportTaskSnapshot
- Đại diện: ảnh chụp một task của nhóm lúc tạo báo cáo.
- Thuộc: ProgressReport. Có: id task, tiêu đề, trạng thái, deadline, trạng thái quá hạn.
- Không lưu người được giao, vì phần so sánh không xét thành viên.

## ReminderLog
- Đại diện: một lần Host nhắc việc qua email.
- Thuộc: Task. Có: thời điểm gửi. Dùng để giới hạn một email nhắc mỗi task mỗi giờ. Bị xóa khi task bị xóa.

## Quan hệ tóm tắt
- User 1 — n Task cá nhân.
- Group 1 — n Task nhóm; Group 1 — n Membership; Group 1 — n Invitation; Group 1 — tối đa 2 ProgressReport.
- Task 1 — n Subtask; Task nhóm 1 — n Comment; Task nhóm 1 — 0..1 CommentSummary; Task nhóm 1 — n ReminderLog.
- Task nhóm — 0..1 người được giao (User, thành viên của nhóm).
- ProgressReport 1 — n ReportTaskSnapshot.

## Vòng đời
- **Task:** `Todo`, `In progress`, `Done`; đi qua lại theo mọi hướng, kể cả `Done` về `In progress` hoặc `Todo` (khi đó task quay lại phần việc đang làm theo cách xem hiện tại).
- **Invitation:** `Pending` đến `Accepted` hoặc `Rejected`; `Pending` có thể bị Host thu hồi.
