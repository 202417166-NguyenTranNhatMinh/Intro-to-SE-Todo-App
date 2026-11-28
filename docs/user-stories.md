# User Stories

Mỗi story ngắn, một dòng. Chi tiết nằm ở use case (`use-cases.md`) và tiêu chí chấp nhận (`acceptance-criteria.md`).

## Tài khoản
- **US-01** Là người dùng, tôi muốn đăng nhập bằng Google để không phải tạo mật khẩu. *(UC-001)*
- **US-02** Là người dùng, tôi muốn đăng xuất để phiên trên thiết bị này kết thúc. *(UC-001)*

## Task
- **US-03** Là người dùng, tôi muốn tạo task có tiêu đề, mô tả, deadline để ghi lại việc cần làm. *(UC-002)*
- **US-04** Là người dùng, tôi muốn sửa và xóa task của mình. *(UC-002)*
- **US-05** Là người dùng, tôi muốn chia task thành subtask và theo dõi trạng thái từng subtask. *(UC-002)*
- **US-06** Là người dùng cá nhân, tôi muốn đặt mức quan trọng cho task để việc quan trọng nổi lên trước. *(UC-002)*
- **US-07** Là người dùng, tôi muốn danh sách tự sắp xếp và task quá hạn nổi bật để biết nên làm gì trước. *(UC-003)*
- **US-08** Là người dùng cá nhân, tôi muốn chuyển giữa xem theo mức quan trọng và theo thời gian, và app nhớ lựa chọn của tôi. *(UC-003)*
- ~~US-09~~ *(đã bỏ: danh sách cá nhân không có lọc và tìm kiếm, hai cách xem đã đủ; lọc và tìm kiếm chỉ ở nhóm, xem US-21)*
- **US-10** Là người dùng, tôi muốn task đã hoàn thành nằm ở phần riêng phía sau để danh sách việc đang làm gọn. *(UC-003)*
- **US-11** Là người dùng (chủ task cá nhân, hoặc thành viên nhóm với task nhóm), tôi muốn đổi trạng thái task sang bất kỳ trạng thái nào. Khi mở lại task đã xong, task quay lại phần việc đang làm đúng vị trí theo cách xem tôi đang chọn (theo thời gian hoặc theo mức quan trọng). *(UC-007)*

## Nhóm
- **US-12** Là người dùng, tôi muốn tạo nhóm và trở thành Host. *(UC-004)*
- **US-13** Là Host, tôi muốn mời thành viên qua email. *(UC-004)*
- **US-14** Là Host, tôi muốn biết khi email chưa có tài khoản để nhờ người đó đăng nhập rồi mời lại. *(UC-004)*
- **US-15** Là Host, tôi muốn thu hồi lời mời chưa được trả lời. *(UC-004)*
- **US-16** Là người được mời, tôi muốn chấp nhận hoặc từ chối lời mời. *(UC-005)*
- **US-17** Là Host, tôi muốn tạo, sửa, xóa task của nhóm; xóa task thì mọi thứ liên quan (subtask, bình luận, tóm tắt) cũng bị xóa. *(UC-006)*
- **US-18** Là Host, tôi muốn giao task cho một thành viên bằng cách chọn từ danh sách rút gọn theo tên. *(UC-006)*
- **US-19** Là thành viên nhóm (Host hoặc Worker), tôi muốn thấy toàn bộ task của nhóm cùng cửa sổ chat trên một màn hình chung để cả nhóm cùng nắm tình hình. *(UC-003)*
- **US-20** Là Worker, tôi muốn đổi trạng thái bất kỳ task nào của nhóm để cập nhật tiến độ chung. *(UC-007)*
- **US-21** Là thành viên nhóm (Host hoặc Worker), tôi muốn lọc và tìm task nhóm theo người được giao, trạng thái, deadline, từ khóa. *(UC-003)*
- **US-22** Là Host hoặc Worker, tôi muốn bình luận trên bất kỳ task nào của nhóm để trao đổi. *(UC-008)*
- **US-23** Là Host, tôi muốn gửi email nhắc người được giao về task. *(UC-011)*
- **US-24** Là thành viên, tôi muốn rời nhóm. *(UC-012)*

## AI
- **US-25** Là Host hoặc Worker, tôi muốn tóm tắt trao đổi trên bất kỳ task nào của nhóm (task của người này có thể ảnh hưởng người khác) để nắm nhanh điểm đã thống nhất và điểm còn vướng. *(UC-009)*
- **US-26** Là thành viên nhóm, tôi muốn xem lại bản tóm tắt đã lưu mà không phải gọi lại AI khi chưa có bình luận mới. *(UC-009)*
- **US-27** Là Host, tôi muốn lập báo cáo tiến độ nhóm để biết tình hình chung. *(UC-010)*
- **US-28** Là Host, tôi muốn thấy số liệu do hệ thống tính cạnh nhận xét của AI để đối chiếu. *(UC-010)*
- **US-29** Là Host, tôi muốn báo cáo mới cho biết tiến độ các task đã thay đổi thế nào so với lần trước. *(UC-010)*
- **US-30** Là Host, tôi muốn AI gợi ý vài task nên ưu tiên làm trước, kèm tên người đảm nhận, để biết cần thúc ai. *(UC-010)*
- **US-31** Là Host, tôi muốn mỗi nhận xét, rủi ro và gợi ý của AI có lời giải thích ngắn để tôi kiểm tra được lập luận. *(UC-010)*
