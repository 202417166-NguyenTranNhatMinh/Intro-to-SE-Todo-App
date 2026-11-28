# Acceptance Criteria

- **Quy ước mã:** `AC-<UC>-<số>`, ví dụ AC-006-3 thuộc UC-006. Mỗi test tự động nên mang tên AC mà nó bảo vệ.
- **Ngày trong ví dụ:** hôm nay là 2026-12-01, giờ Việt Nam (UTC+7).
- **Dấu *(đề xuất)*:** hành vi chưa có trong Business Rules, cần nhóm xác nhận.
- **Phân quyền nhóm:** chỉ Host thêm, sửa, xóa, giao task, nhắc việc, lập báo cáo. Mọi thành viên (Host, Worker) xem, lọc, đổi trạng thái, bình luận, tóm tắt AI trên mọi task nhóm.

---

## UC-001: Đăng nhập và đăng xuất bằng Google

### AC-001-1: Đăng nhập lần đầu
Given: chưa có tài khoản, Google xác nhận email đã xác minh
When: người dùng đăng nhập bằng Google
Then: hệ thống tạo người dùng mới gắn với `google_id`
And: tạo phiên 7 ngày trong cookie HttpOnly

### AC-001-2: Đăng nhập lại
Given: người dùng đã có tài khoản
When: đăng nhập lại bằng Google
Then: dùng lại tài khoản cũ, không tạo thêm người dùng

### AC-001-3: Nhận diện theo google_id
Given: người dùng đã đăng nhập trước đó, sau đó email Google của họ đổi
When: đăng nhập
Then: vẫn vào đúng tài khoản cũ

### AC-001-4: Email chưa xác minh
Given: Google trả về email chưa xác minh
When: đăng nhập
Then: từ chối, không tạo người dùng, không tạo phiên

### AC-001-5: Phiên hết hạn
Given: phiên được tạo cách đây hơn 7 ngày
When: gọi chức năng cần đăng nhập
Then: bị từ chối và yêu cầu đăng nhập lại

### AC-001-6: Đăng xuất
Given: người dùng đang đăng nhập
When: đăng xuất
Then: cookie phiên bị xóa
And: gọi chức năng cần đăng nhập sau đó bị từ chối

---

## UC-002: Quản lý task cá nhân

### AC-002-1: Tạo task hợp lệ
Given: người dùng đã đăng nhập
When: tạo task với tiêu đề "Làm bài tập", không chọn mức quan trọng
Then: task có trạng thái Todo và mức quan trọng Normal

### AC-002-2: Tiêu đề rỗng
When: tạo task với tiêu đề rỗng
Then: từ chối, không tạo task

### AC-002-3: Deadline ở quá khứ
When: tạo task với deadline 2026-11-28
Then: tạo thành công
And: task được coi là quá hạn

### AC-002-4: Đặt mức quan trọng
When: tạo hoặc sửa task thành Important
Then: khi xem theo mức quan trọng, task nằm trong nhóm Important

### AC-002-5: Xóa task cha
Given: task A có 2 subtask
When: xóa task A
Then: task A và cả 2 subtask bị xóa

### AC-002-6: Subtask thuộc đúng một task
When: tạo subtask từ task A
Then: subtask thuộc task A và có trạng thái riêng

### AC-002-7: Không truy cập task của người khác
Given: task thuộc người dùng B
When: người dùng A sửa hoặc xóa task đó
Then: bị từ chối, task không đổi

---

## UC-003: Xem, lọc và tìm kiếm danh sách task

### AC-003-1: Sắp xếp theo thời gian
Given: 4 task chưa Done: A (deadline 2026-12-05), B (deadline 2026-11-28), C (không deadline), D (deadline 2026-12-05, tạo sau A)
When: xem theo thời gian
Then: thứ tự là B, A, D, C

### AC-003-2: Sắp xếp theo mức quan trọng
Given: 4 task chưa Done: P1 (Important, quá hạn), P2 (Important, chưa quá hạn), N1 (Normal, quá hạn), N2 (Normal, chưa quá hạn)
When: xem theo mức quan trọng
Then: các nhóm xuất hiện theo thứ tự P1, P2, N1, N2
And: trong mỗi nhóm, task xếp theo thời gian

### AC-003-3: Cách xem mặc định
Given: người dùng cá nhân chưa từng đổi cách xem
When: mở danh sách cá nhân
Then: danh sách xem theo mức quan trọng

### AC-003-4: Nhớ cách xem theo tài khoản
Given: người dùng đổi sang xem theo thời gian
When: đăng nhập ở thiết bị khác và mở danh sách cá nhân
Then: danh sách xem theo thời gian
And: người dùng khác không bị ảnh hưởng

### AC-003-5: Danh sách nhóm
Given: nhóm có task
When: Host hoặc Worker mở danh sách nhóm
Then: danh sách luôn theo thời gian, không có nút chuyển cách xem
And: task không có mức quan trọng

### AC-003-6: Deadline hôm nay chưa quá hạn
Given: task chưa Done có deadline 2026-12-01
When: xem vào ngày 2026-12-01
Then: task chưa quá hạn
And: sang ngày 2026-12-02, task quá hạn và tự chuyển nhóm

### AC-003-7: Không có deadline
Given: task chưa Done không có deadline
Then: task không bao giờ quá hạn và nằm cuối khi xem theo thời gian

### AC-003-8: Task đã hoàn thành
Given: hai task Done, một cập nhật lúc 09:00 và một lúc 10:00, deadline đã qua
When: xem danh sách
Then: cả hai nằm ở phần riêng phía sau, task cập nhật lúc 10:00 đứng trước
And: hiển thị gạch ngang và không bị coi là quá hạn

### AC-003-9: Task tự chuyển nhóm khi đổi mức quan trọng
Given: task Normal, chưa quá hạn, xem theo mức quan trọng
When: đổi mức quan trọng thành Important
Then: task chuyển ngay sang nhóm Important, chưa quá hạn

### AC-003-10: Worker thấy toàn bộ task nhóm
Given: nhóm có 5 task, 2 task giao cho Worker B, 1 task chưa giao
When: Worker B mở danh sách nhóm
Then: B thấy cả 5 task, gồm task giao cho người khác và task chưa giao

### AC-003-11: Lọc kết hợp (danh sách nhóm)
Given: danh sách nhóm có nhiều task với trạng thái và tiêu đề khác nhau
When: Host hoặc Worker lọc trạng thái In progress và từ khóa "báo cáo"
Then: chỉ hiển thị task thỏa cả hai điều kiện

### AC-003-12: Host và Worker cùng một màn hình
Given: nhóm có task, Host và Worker B cùng mở trang nhóm
Then: cả hai thấy cùng danh sách task, cùng thứ tự, cùng cửa sổ chat của task đang chọn
And: chỉ Host thấy các nút thêm, sửa, xóa, giao, nhắc việc

### AC-003-13: Lọc theo người được giao
Given: nhóm có task giao cho A, task giao cho B, task chưa giao
When: Host hoặc Worker lọc theo người được giao là A
Then: chỉ hiển thị task giao cho A
And: lọc "chưa giao" chỉ hiển thị task chưa giao

### AC-003-14: Mọi thành viên dùng được bộ lọc nhóm
Given: Worker B (không phải Host)
When: B lọc theo tên người được giao, trạng thái, deadline hoặc từ khóa trong tiêu đề
Then: lọc thành công, kết quả giống với khi Host lọc cùng điều kiện

### AC-003-15: Mở lại task Done, xem theo thời gian
Given: danh sách xem theo thời gian; task T (deadline 2026-12-03) đang Done, các task chưa Done khác có deadline 2026-12-01 và 2026-12-10
When: T được mở lại thành Todo
Then: T rời phần Done và nằm giữa task deadline 2026-12-01 và 2026-12-10
And: T không còn gạch ngang

### AC-003-16: Mở lại task Done, xem theo mức quan trọng
Given: danh sách cá nhân xem theo mức quan trọng; task T (Important, deadline 2026-11-28) đang Done
When: T được mở lại thành In progress
Then: T chuyển vào nhóm Important quá hạn, ở đầu danh sách chưa Done
And: nếu người dùng đổi sang xem theo thời gian, T nằm đúng vị trí theo deadline

### AC-003-17: Người ngoài nhóm
When: người không thuộc nhóm mở danh sách nhóm
Then: bị từ chối

### AC-003-18: Danh sách cá nhân không có lọc và tìm kiếm
When: người dùng mở danh sách cá nhân
Then: chỉ có nút chuyển cách xem, không có bộ lọc và không có ô tìm kiếm

---

## UC-004: Tạo nhóm và mời thành viên

### AC-004-1: Tạo nhóm
When: người dùng tạo nhóm
Then: người dùng là Host của nhóm
And: nhóm có đúng một Host

### AC-004-2: Mời email có tài khoản
Given: email đã có tài khoản
When: Host mời email đó
Then: tạo lời mời Pending
And: gửi email mời

### AC-004-3: Mời email chưa có tài khoản
Given: email chưa có tài khoản
When: Host mời email đó
Then: không tạo lời mời
And: Host nhận thông báo cần nhờ người đó đăng nhập Google một lần rồi mời lại

### AC-004-4: Thu hồi lời mời Pending
Given: lời mời đang Pending
When: Host thu hồi
Then: lời mời bị thu hồi

### AC-004-5: Không thu hồi lời mời đã trả lời
Given: lời mời đã Accepted hoặc Rejected
When: Host thu hồi
Then: bị từ chối, lời mời không đổi

### AC-004-6: Người không phải Host
When: một thành viên không phải Host mời người khác
Then: bị từ chối

---

## UC-005: Trả lời lời mời

### AC-005-1: Chấp nhận
Given: lời mời Pending
When: người được mời chấp nhận
Then: lời mời chuyển sang Accepted
And: người đó là thành viên, thấy toàn bộ task của nhóm, và xuất hiện trong danh sách chọn người được giao

### AC-005-2: Từ chối
Given: lời mời Pending
When: người được mời từ chối
Then: lời mời chuyển sang Rejected
And: người đó không phải thành viên và không xuất hiện trong danh sách chọn người được giao

### AC-005-3: Lời mời chưa trả lời
Given: lời mời đang Pending
Then: người được mời không xuất hiện trong danh sách chọn người được giao

### AC-005-4: Lời mời đã thu hồi
Given: lời mời đã bị Host thu hồi
When: người được mời cố chấp nhận
Then: bị từ chối, người đó không trở thành thành viên

---

## UC-006: Tạo, sửa, xóa và giao task nhóm

### AC-006-1: Host tạo task nhóm
When: Host tạo task với tiêu đề và deadline
Then: task có trạng thái Todo, chưa giao ai
And: task không có mức quan trọng

### AC-006-2: Giao việc
Given: A là thành viên đã Accepted
When: Host giao task cho A
Then: người được giao của task là A
And: tên A hiển thị trên task trong danh sách chung của nhóm

### AC-006-3: Danh sách chọn người được giao
Given: Host, B (Accepted), C (Pending), D (Rejected)
When: Host mở "Assign Worker"
Then: danh sách chỉ gồm Host và B

### AC-006-4: Lọc theo tên khi gõ
Given: danh sách gồm các thành viên "Nguyên", "Minh", "Long"
When: Host gõ "ng"
Then: danh sách chỉ còn các thành viên có tên chứa "ng"

### AC-006-5: Giao lại cho người khác
Given: task đang giao cho A
When: Host giao task cho B
Then: người được giao là B và không còn A

### AC-006-6: Giao cho chính Host
When: Host giao task cho chính mình
Then: thành công

### AC-006-7: Người không thuộc nhóm
When: giao task cho một người không thuộc nhóm hoặc chưa Accepted
Then: bị từ chối, người được giao không đổi

### AC-006-8: Worker không được sửa task
Given: Worker B (kể cả được giao task T)
When: B đổi tiêu đề, deadline, người được giao hoặc xóa T
Then: bị từ chối, T không đổi

### AC-006-9: Worker không được tạo task
When: Worker B tạo task mới trong nhóm
Then: bị từ chối, không có task mới

### AC-006-10: Xóa task xóa mọi dữ liệu liên quan
Given: task T có 2 subtask, 5 bình luận, một bản tóm tắt trao đổi và 1 lần nhắc việc
When: Host xóa T
Then: T, cả 2 subtask, cả 5 bình luận, bản tóm tắt và lịch sử nhắc việc đều bị xóa
And: T biến mất khỏi danh sách và khỏi bộ lọc của mọi thành viên

### AC-006-11: Xóa task giữ ảnh chụp trong báo cáo cũ *(đề xuất)*
Given: báo cáo đã lưu có ảnh chụp task T
When: Host xóa T
Then: ảnh chụp T trong báo cáo đã lưu vẫn còn, để báo cáo sau liệt kê T là "bị xóa"

---

## UC-007: Đổi trạng thái task

### AC-007-1: Worker đổi trạng thái task được giao
Given: Worker B được giao task T, T đang In progress
When: B đổi T sang Done
Then: T có trạng thái Done

### AC-007-2: Mở lại task đã xong
Given: task Done
When: người có quyền đổi sang In progress (hoặc Todo)
Then: đổi thành công
And: task rời phần Done và quay lại phần việc đang làm theo cách xem hiện tại (xem AC-003-15, AC-003-16)

### AC-007-3: Worker đổi trạng thái task giao cho người khác
Given: task T giao cho người khác
When: Worker B đổi trạng thái T
Then: đổi thành công

### AC-007-4: Host đổi trạng thái mọi task nhóm
When: Host đổi trạng thái một task nhóm bất kỳ
Then: đổi thành công

### AC-007-5: Task quá hạn khi hoàn thành
Given: task quá hạn
When: đổi sang Done
Then: task không còn bị coi là quá hạn và xuống phần Done

### AC-007-6: Mở lại task có deadline đã qua
Given: task Done có deadline 2026-11-28
When: mở lại thành In progress
Then: task lại quá hạn

### AC-007-7: Task cá nhân
When: chủ task đổi trạng thái task cá nhân của mình
Then: đổi thành công

### AC-007-8: Worker đổi trạng thái task chưa giao
Given: task T chưa giao ai
When: Worker B đổi trạng thái T
Then: đổi thành công

### AC-007-9: Người ngoài nhóm
When: người không thuộc nhóm đổi trạng thái một task nhóm
Then: bị từ chối, trạng thái không đổi

---

## UC-008: Bình luận trên task nhóm

### AC-008-1: Host bình luận mọi task
When: Host bình luận trên một task nhóm bất kỳ
Then: bình luận được lưu cùng người gửi và thời gian

### AC-008-2: Worker bình luận mọi task
Given: task T giao cho người khác, task U chưa giao ai
When: Worker B bình luận trên T và trên U
Then: cả hai bình luận được lưu

### AC-008-3: Người ngoài nhóm
When: người không thuộc nhóm bình luận trên task nhóm
Then: bị từ chối, không lưu

### AC-008-4: Thứ tự hiển thị
Given: 3 bình luận gửi lúc 09:00, 09:05, 09:10
When: mở cửa sổ chat của task
Then: hiển thị theo thứ tự thời gian, mỗi bình luận có nội dung, người gửi và thời gian

### AC-008-5: Nội dung rỗng *(đề xuất)*
When: gửi bình luận rỗng
Then: bị từ chối, không lưu

### AC-008-6: Cửa sổ chat trên màn hình chung
Given: Host và Worker B cùng mở trang nhóm
When: cả hai chọn cùng task T
Then: cả hai thấy cùng danh sách bình luận của T

---

## UC-009: Tóm tắt trao đổi trên task

### AC-009-1: Tóm tắt lần đầu
Given: task có 5 bình luận, chưa có bản tóm tắt
When: Worker B (không phải người được giao) bấm "Tóm tắt trao đổi"
Then: LLM được gọi đúng một lần
And: bản tóm tắt có tổng quan ngắn, các điểm đã thống nhất, các điểm còn vướng
And: bản tóm tắt được lưu kèm thời điểm tạo

### AC-009-2: Ít hơn 2 bình luận
Given: task có 1 bình luận
When: bấm tóm tắt
Then: bị từ chối, LLM không được gọi

### AC-009-3: Giới hạn 100 bình luận
Given: task có 150 bình luận
When: tóm tắt
Then: chỉ 100 bình luận mới nhất được gửi cho LLM

### AC-009-4: Chưa có bình luận mới
Given: bản tóm tắt tạo lúc T, chưa có bình luận mới sau T
When: Host hoặc Worker bấm tóm tắt
Then: hiển thị bản cũ kèm thông báo "chưa có bình luận mới kể từ lúc T"
And: LLM không được gọi

### AC-009-5: Có bình luận mới
Given: bản tóm tắt tạo lúc T, có bình luận mới sau T
When: bấm tóm tắt
Then: tạo bản mới thay bản cũ

### AC-009-6: Worker tóm tắt task giao cho người khác
Given: task T giao cho người khác, có ít nhất 2 bình luận
When: Worker B bấm tóm tắt T
Then: tóm tắt thành công như với task của chính B

### AC-009-7: Không gửi ID và email
Given: bình luận do người dùng có email x và ID y gửi
When: tóm tắt
Then: yêu cầu gửi cho LLM không chứa ID hay email nào
And: nội dung bình luận nằm trong phần dữ liệu, không nằm trong phần chỉ thị

### AC-009-8: Mọi thành viên xem được bản đã lưu
Given: task có bản tóm tắt
When: Host và một Worker bất kỳ mở task
Then: cả hai đều xem được bản tóm tắt

### AC-009-9: LLM lỗi *(đề xuất)*
Given: task đã có bản tóm tắt cũ
When: LLM lỗi hoặc trả kết quả không đọc được
Then: báo lỗi và bản tóm tắt cũ không đổi

### AC-009-10: Người ngoài nhóm
When: người không thuộc nhóm bấm tóm tắt
Then: bị từ chối, LLM không được gọi

---

## UC-010: Lập báo cáo tiến độ nhóm

### AC-010-1: Chỉ Host
When: Worker yêu cầu báo cáo tiến độ
Then: bị từ chối, LLM không được gọi, không thấy báo cáo nào

### AC-010-2: Số liệu do hệ thống tính
Given: nhóm có 3 Todo, 2 In progress, 4 Done; 2 task quá hạn; 1 task chưa giao
When: Host tạo báo cáo
Then: số liệu hiển thị khớp: 3 Todo, 2 In progress, 4 Done, 5 đang mở, 2 quá hạn, 1 chưa giao
And: các số này do hệ thống tính, không lấy từ kết quả của LLM

### AC-010-3: Việc đang mở của từng thành viên
Given: thành viên B có 2 task đang mở, Host có 1
When: tạo báo cáo
Then: hiển thị B: 2, Host: 1

### AC-010-4: Đến hạn trong 7 ngày tới
Given: task chưa Done có deadline 2026-12-03 và task chưa Done có deadline 2026-12-20
When: tạo báo cáo
Then: chỉ task có deadline 2026-12-03 được tính là đến hạn trong 7 ngày tới

### AC-010-5: Báo cáo đầu tiên
Given: nhóm chưa có báo cáo nào
When: tạo báo cáo
Then: báo cáo được lưu kèm nhận xét, số liệu, thời điểm và ảnh chụp task
And: không có phần so với lần trước

### AC-010-6: Không có thay đổi
Given: báo cáo gần nhất tạo lúc T, sau đó không có thay đổi nào về tập task, trạng thái, deadline hay trạng thái quá hạn
When: Host bấm báo cáo
Then: hiển thị báo cáo cũ kèm thông báo "chưa có thay đổi kể từ lúc T"
And: LLM không được gọi và không lưu báo cáo mới

### AC-010-7: So sánh với lần trước
Given: báo cáo gần nhất tạo lúc T; sau đó task X từ Todo sang In progress, task Y sang Done, task Z từ Done về In progress, task W được thêm, task V bị xóa, task U đổi deadline, task S mới quá hạn
When: Host bấm báo cáo
Then: phần "so với lần trước" liệt kê đủ: mới bắt đầu (X), mới hoàn thành (Y), mở lại (Z), mới thêm (W), bị xóa (V), đổi deadline (U), mới quá hạn (S)
And: số việc còn lại đúng
And: phần so sánh do hệ thống tính từ ảnh chụp, không do LLM

### AC-010-8: Giữ tối đa 2 báo cáo
Given: nhóm đã có báo cáo R1 và R2
When: tạo báo cáo R3
Then: nhóm lưu R2 và R3, R1 bị xóa

### AC-010-9: Không gửi ID và email
When: tạo báo cáo
Then: yêu cầu gửi cho LLM không chứa ID hay email nào
And: tên hiển thị và tiêu đề nằm trong phần dữ liệu, không nằm trong phần chỉ thị

### AC-010-10: Số liệu hiển thị cạnh nhận xét
When: báo cáo được hiển thị
Then: số liệu do hệ thống tính nằm cạnh phần nhận xét của AI

### AC-010-11: LLM lỗi *(đề xuất)*
When: LLM lỗi hoặc trả kết quả không đọc được
Then: báo lỗi và không lưu báo cáo mới

### AC-010-12: So sánh không xét thành viên
Given: báo cáo gần nhất tạo lúc T; sau đó có thành viên mới vào nhóm, một thành viên rời nhóm và task X đổi người được giao, ngoài ra không có thay đổi tiến độ task
When: Host bấm báo cáo
Then: phần so sánh không có mục nào về thành viên hay người được giao
And: hiển thị báo cáo cũ kèm thông báo "chưa có thay đổi kể từ lúc T", LLM không được gọi
And: ảnh chụp task không lưu người được giao

### AC-010-13: Gợi ý việc nên làm trước nêu tên người đảm nhận
Given: task X (quá hạn, đang Todo, giao cho "Minh") và task Y (chưa giao)
When: Host tạo báo cáo
Then: yêu cầu gửi cho LLM chứa tên hiển thị "Minh" gắn với task X, và task Y được đánh dấu chưa giao
And: phần gợi ý việc nên làm trước nêu tên người đảm nhận của từng task được gợi ý (hoặc ghi chưa giao)

### AC-010-14: Mỗi suy luận kèm lời giải thích ngắn
When: báo cáo được hiển thị
Then: mỗi điểm đáng chú ý, rủi ro và gợi ý của AI kèm lời giải thích ngắn nêu căn cứ từ dữ liệu (deadline, trạng thái, thay đổi so với lần trước)
And: lời giải thích nằm trong phần nhận xét của AI, không thay thế số liệu do hệ thống tính

---

## UC-011: Nhắc việc qua email

### AC-011-1: Gửi nhắc việc
Given: task giao cho Worker B, chưa nhắc trong 1 giờ qua
When: Host nhắc việc
Then: email gửi tới B, có thông tin công việc và deadline

### AC-011-2: Giới hạn mỗi giờ
Given: task vừa được nhắc 10 phút trước
When: Host nhắc lại task đó
Then: bị từ chối, không gửi email
And: sau khi đủ 1 giờ thì nhắc được

### AC-011-3: Giới hạn theo từng task
Given: task T1 vừa được nhắc
When: Host nhắc task T2 (giao cho người khác)
Then: gửi thành công

### AC-011-4: Chỉ Host
When: Worker bấm nhắc việc
Then: bị từ chối, không gửi email

### AC-011-5: Task chưa giao *(đề xuất)*
Given: task chưa giao cho ai
When: Host nhắc việc
Then: không gửi email

---

## UC-012: Rời nhóm

### AC-012-1: Task chuyển thành chưa giao
Given: Worker B được giao 3 task
When: B rời nhóm
Then: cả 3 task chuyển thành chưa giao và vẫn còn trong nhóm
And: B không còn thấy nhóm

### AC-012-2: Danh sách chọn người được giao
Given: B đã rời nhóm
When: Host mở "Assign Worker"
Then: B không còn trong danh sách
