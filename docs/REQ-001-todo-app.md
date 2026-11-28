# REQ-001: To-do App tích hợp AI

- **Trạng thái:** draft
- **Nguồn:** `to_do_app.md` (đề xuất dự án)
- **Luật chi tiết:** `business-rules.md` (các mã BR-xxx)
- **Tài liệu liên quan:** `user-stories.md`, `use-cases.md`, `entity-model.md`, `acceptance-criteria.md`

## Goal
Giúp cá nhân và nhóm nhỏ quản lý công việc trong một ứng dụng web có hai chế độ: Personal Mode (task riêng) và Group Mode (Host giao việc, cả nhóm cùng theo dõi và trao đổi trên một màn hình chung). Ở Group Mode, AI giúp cả nhóm nắm tình hình nhanh hơn bằng cách tóm tắt trao đổi trên từng task, và giúp Host lập báo cáo tiến độ nhóm. AI chỉ đọc dữ liệu và viết văn bản, không sửa dữ liệu.

## Vai trò
| Vai trò | Mô tả |
|---|---|
| Người dùng cá nhân | Dùng Personal Mode, quản lý task riêng |
| Host | Người tạo nhóm. Mỗi nhóm có đúng một Host. Là người duy nhất được thêm, sửa, xóa, giao task, nhắc việc và lập báo cáo tiến độ. Cũng có thể đổi trạng thái, bình luận và tóm tắt như Worker |
| Worker | Thành viên của nhóm không phải Host. Xem toàn bộ task của nhóm, đổi trạng thái, bình luận và tóm tắt AI trên **bất kỳ** task nào, không phụ thuộc task có được giao cho mình hay không |
| Người được giao | Không phải một vai trò quyền hạn, chỉ là thuộc tính của task: thành viên (Host hoặc Worker) chịu trách nhiệm chính cho task đó |
| Hệ thống | Gửi email, gọi LLM |

**Phân quyền trong nhóm (tóm tắt):** khác biệt giữa Host và Worker là Host được thêm, sửa, xóa, giao task, nhắc việc và lập báo cáo; Worker chỉ đổi trạng thái, bình luận và tóm tắt AI. Mọi thành viên thấy cùng một màn hình, cùng danh sách task, cùng bộ lọc.

## Success Metrics (đề xuất)
- 100% Acceptance Criteria của phạm vi hiện tại có ít nhất một test tự động.
- Mọi hành động ngoài quyền của Worker (thêm, sửa, xóa task, giao việc, nhắc việc, xem báo cáo) đều bị từ chối trong test.
- 100% số liệu trong báo cáo tiến độ khớp với truy vấn trực tiếp trên dữ liệu (LLM không tính số liệu).
- Bấm tóm tắt hoặc báo cáo khi chưa có gì mới thì không gọi LLM (0 lần gọi, kiểm tra bằng test).
- Host nhận được tóm tắt hoặc báo cáo trong thời gian chấp nhận được khi demo (đề xuất dưới 10 giây).

## In Scope (phạm vi hiện tại)
- **Tài khoản:** đăng nhập và đăng xuất bằng Google, phiên 7 ngày.
- **Task (cả hai chế độ):** tiêu đề, mô tả, deadline, trạng thái, subtask, sắp xếp tự động, task Done ở phần riêng. Lọc và tìm kiếm chỉ có ở danh sách nhóm. Task Done được mở lại (về Todo hoặc In progress) thì rời phần Done và quay lại phần việc đang làm, đúng vị trí theo cách xem hiện tại của người dùng (theo thời gian hoặc theo mức quan trọng).
- **Personal Mode:** mức quan trọng (Bình thường, Quan trọng), hai cách xem (theo mức quan trọng, theo thời gian) và lựa chọn được nhớ theo tài khoản. Không có lọc và tìm kiếm (hai cách xem đã đủ để sắp xếp). Không có AI.
- **Group Mode:**
  - Tạo nhóm, mời qua email, trả lời lời mời, giao việc, nhắc việc qua email.
  - **Màn hình nhóm dùng chung:** Host và Worker nhìn cùng một màn hình gồm danh sách toàn bộ task của nhóm và cửa sổ chat (bình luận) của task đang chọn. Danh sách luôn theo thời gian, task nhóm không có mức quan trọng.
  - **Bộ lọc dùng chung:** mọi thành viên đều lọc và tìm theo tên người được giao, trạng thái, deadline, từ khóa trong tiêu đề.
  - **Quyền:** chỉ Host thêm, sửa, xóa, giao task. Mọi thành viên đổi trạng thái và bình luận trên mọi task.
  - **Xóa task nhóm:** xóa toàn bộ dữ liệu gắn với task (subtask, bình luận, bản tóm tắt, lịch sử nhắc việc).
- **AI (Group Mode):**
  - Tóm tắt trao đổi trên **bất kỳ** task nhóm (Host và Worker), vì task của người này có thể ảnh hưởng người khác.
  - Báo cáo tiến độ nhóm (chỉ Host). Phần so với báo cáo trước chỉ so sánh **tiến độ task** (hoàn thành, bắt đầu, mở lại, thêm, xóa, đổi deadline, quá hạn), không có thông tin về thành viên. Nhận xét của AI kèm lời giải thích ngắn cho từng suy luận. Phần gợi ý việc nên làm trước nêu tên người đảm nhận.

## Out of Scope
- Đăng ký bằng email và mật khẩu, quên mật khẩu (BR-AUTH-DEF-01).
- Đăng nhập nhanh nhiều tài khoản trên một thiết bị, quản lý thông tin tài khoản cơ bản.
- Công việc định kỳ (BR-PER-02, BR-PER-03).
- Thêm task nhóm vào danh sách cá nhân (BR-PER-01).
- Quản lý tài liệu đính kèm (BR-DOC-DEF-01).
- Báo cáo theo khoảng thời gian cố định (BR-AI-DEF-01), AI soạn email nhắc việc (BR-AI-DEF-02), lưu nhiều hơn 2 báo cáo (BR-AI-DEF-03).
- Giới hạn số lượt dùng AI mỗi ngày.
- Nhiều Host trong một nhóm.
- Bình luận trả lời lồng nhau, sửa lịch sử bình luận, thông báo thời gian thực.
- Mức quan trọng cho task nhóm.
- Lọc và tìm kiếm trong danh sách cá nhân.

## Ràng buộc
- LLM không nhận ID hay email. Tiêu đề, mô tả, bình luận và tên hiển thị được gửi như dữ liệu, không phải chỉ thị (BR-AI-08). Tên hiển thị của người đảm nhận chỉ được gửi ở báo cáo tiến độ để AI gợi ý việc nên ưu tiên.
- Mọi số liệu trong báo cáo, kể cả phần so với lần trước, do backend tính (BR-AI-06).
- Người dùng được nhận diện bằng `google_id` (BR-AUTH-01).
