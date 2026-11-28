# Use Cases

- **Thuộc:** REQ-001
- **Quy ước:** mục có ghi *(đề xuất)* là hành vi hợp lý nhưng chưa có trong Business Rules, cần nhóm xác nhận. Tiêu chí chấp nhận nằm ở `acceptance-criteria.md` (mã AC-<UC>-<số>).
- **Ngày:** các ví dụ về ngày theo giờ Việt Nam (UTC+7).
- **Phân quyền nhóm:** chỉ Host thêm, sửa, xóa, giao task, nhắc việc và lập báo cáo. Mọi thành viên (Host và Worker) xem toàn bộ task, lọc, đổi trạng thái, bình luận và tóm tắt AI trên mọi task của nhóm.

| ID | Tên | Actor chính |
|---|---|---|
| UC-001 | Đăng nhập và đăng xuất bằng Google | Người dùng |
| UC-002 | Quản lý task cá nhân | Người dùng |
| UC-003 | Xem danh sách task (lọc và tìm kiếm chỉ ở nhóm) | Người dùng, Host, Worker |
| UC-004 | Tạo nhóm và mời thành viên | Host |
| UC-005 | Trả lời lời mời | Người được mời |
| UC-006 | Tạo, sửa, xóa và giao task nhóm | Host |
| UC-007 | Đổi trạng thái task | Chủ task, Host, Worker |
| UC-008 | Bình luận trên task nhóm | Host, Worker |
| UC-009 | Tóm tắt trao đổi trên task | Host, Worker |
| UC-010 | Lập báo cáo tiến độ nhóm | Host |
| UC-011 | Nhắc việc qua email | Host |
| UC-012 | Rời nhóm | Thành viên |

---

## UC-001: Đăng nhập và đăng xuất bằng Google
**Liên quan:** US-01, US-02 · BR-AUTH-01 đến BR-AUTH-04

**Actor:** Người dùng
**Trigger:** Bấm "Đăng nhập bằng Google" hoặc "Đăng xuất"

**Main Flow (đăng nhập)**
1. Người dùng bấm "Đăng nhập bằng Google".
2. Google xác thực người dùng.
3. Hệ thống kiểm tra email Google đã được xác minh.
4. Hệ thống tìm người dùng theo `google_id`.
5. Hệ thống tạo phiên 7 ngày, lưu trong cookie HttpOnly.
6. Hệ thống chuyển người dùng vào ứng dụng.

**Alternative Flows**
- 4a. Chưa có người dùng với `google_id` này: hệ thống tạo tài khoản mới rồi tiếp tục bước 5.
- Đăng xuất: người dùng bấm "Đăng xuất", hệ thống xóa cookie phiên và chuyển về trang đăng nhập.

**Exceptions**
- E1. Email Google chưa xác minh: từ chối đăng nhập, không tạo tài khoản, không tạo phiên.
- E2. Người dùng hủy ở bước Google: quay về trang đăng nhập.
- E3. Phiên đã quá 7 ngày: yêu cầu đăng nhập lại.

---

## UC-002: Quản lý task cá nhân
**Liên quan:** US-03 đến US-06 · BR-TASK-01 đến BR-TASK-06

**Actor:** Người dùng (đã đăng nhập)
**Trigger:** Bấm "Thêm task", hoặc chọn sửa, xóa, thêm subtask trên một task

**Main Flow (tạo task)**
1. Người dùng nhập tiêu đề, mô tả, deadline và chọn mức quan trọng (mặc định Bình thường).
2. Người dùng gửi form.
3. Hệ thống kiểm tra tiêu đề không rỗng.
4. Hệ thống tạo task với trạng thái Chưa làm (Todo).
5. Task xuất hiện trong danh sách đúng vị trí theo cách xem hiện tại (UC-003).

**Alternative Flows**
- 2a. Sửa task: người dùng đổi tiêu đề, mô tả, deadline hoặc mức quan trọng, trạng thái done/chưa done; task tự chuyển nhóm và vị trí theo BR-TASK-10 và BR-TASK-11. Đổi từ Done về chưa Done: xem UC-007.
- 2b. Xóa task: hệ thống xóa task và toàn bộ subtask của nó.
- 2c. Thêm subtask: subtask thuộc đúng một task cha và có trạng thái riêng.

**Exceptions**
- E1. Tiêu đề rỗng: từ chối, không tạo task.
- E2. Task không tồn tại hoặc không thuộc người dùng: không cho truy cập.

**Ghi chú:** deadline được phép ở quá khứ, không phải lỗi (BR-TASK-06). Mức quan trọng chỉ có ở task cá nhân (BR-TASK-02).

---

## UC-003: Xem danh sách task (lọc và tìm kiếm chỉ ở nhóm)
**Liên quan:** US-07 đến US-10, US-19, US-21 · BR-TASK-05, BR-TASK-07, BR-TASK-09 đến BR-TASK-12, BR-GRP-05

**Actor:** Người dùng (cá nhân), Host, Worker
**Trigger:** Mở danh sách task

**Main Flow**
1. Hệ thống lấy task trong phạm vi của người dùng: danh sách cá nhân lấy task của họ; danh sách nhóm lấy **toàn bộ task của nhóm**, giống nhau với Host và Worker.
2. Hệ thống sắp xếp theo cách xem: danh sách cá nhân mặc định theo mức quan trọng; danh sách nhóm luôn theo thời gian.
3. Hệ thống hiển thị task chưa hoàn thành trước, task đã hoàn thành ở phần riêng phía sau (gạch ngang).
4. Ngày deadline của task quá hạn hiển thị khác màu.
5. Ở nhóm, màn hình có hai phần dùng chung cho Host và Worker: danh sách task và cửa sổ chat của task đang chọn (UC-008). Host có thêm nút thêm, sửa, xóa, giao, nhắc việc; Worker không có các nút này.

**Alternative Flows**
- 2a. Người dùng cá nhân bấm nút chuyển cách xem: danh sách sắp xếp lại; hệ thống lưu lựa chọn theo tài khoản và dùng lại ở lần mở sau, kể cả thiết bị khác.
- 2b. Ở danh sách nhóm, mọi thành viên (Host, Worker) lọc theo trạng thái, deadline, người được giao (theo tên, gồm cả "chưa giao") và tìm theo từ khóa trong tiêu đề. Danh sách cá nhân không có lọc hay tìm kiếm: người dùng chỉ dùng hai cách xem.
- 3a. Task Done được mở lại (UC-007): task rời phần Done và quay lại phần việc đang làm, đúng vị trí theo cách xem hiện tại (theo thời gian, hoặc theo nhóm mức quan trọng ở danh sách cá nhân).
- 4a. Sang ngày mới: task đến hạn hôm trước trở thành quá hạn và tự chuyển nhóm.

**Exceptions**
- E1. Danh sách trống: hiển thị trạng thái trống.
- E2. Người ngoài nhóm mở danh sách nhóm: không cho truy cập.

**Quy tắc sắp xếp (tóm tắt)**
- Theo thời gian: deadline gần nhất trước (quá hạn nằm đầu), không có deadline nằm cuối, cùng deadline thì tạo trước đứng trước.
- Theo mức quan trọng (chỉ cá nhân): 4 nhóm theo thứ tự Quan trọng quá hạn, Quan trọng chưa quá hạn, Bình thường quá hạn, Bình thường chưa quá hạn; trong mỗi nhóm theo thời gian.
- Task Done: phần riêng ở mọi cách xem, cập nhật gần nhất đứng trước, không bao giờ quá hạn.
- Task vừa mở lại từ Done được xếp như mọi task chưa Done khác theo các quy tắc trên, không giữ vị trí cũ trong phần Done.

---

## UC-004: Tạo nhóm và mời thành viên
**Liên quan:** US-12 đến US-15 · BR-GRP-01, BR-GRP-06, BR-GRP-08

**Actor:** Người dùng, sau đó là Host
**Trigger:** Bấm "Tạo nhóm", hoặc "Mời thành viên" trong nhóm

**Main Flow**
1. Người dùng đặt tên và tạo nhóm; họ trở thành Host (mỗi nhóm đúng một Host).
2. Host nhập email người cần mời.
3. Hệ thống kiểm tra email đã có tài khoản.
4. Hệ thống tạo lời mời trạng thái Pending và gửi email mời.
5. Host thấy danh sách thành viên và trạng thái các lời mời.

**Alternative Flows**
- 3a. Email chưa có tài khoản: hệ thống không tạo lời mời và báo cho Host để nhờ người đó đăng nhập Google một lần rồi mời lại.
- 5a. Host thu hồi một lời mời Pending: lời mời bị thu hồi.

**Exceptions**
- E1. Thu hồi lời mời đã Accepted hoặc Rejected: từ chối.
- E2. Người không phải Host mời thành viên: từ chối.

---

## UC-005: Trả lời lời mời
**Liên quan:** US-16 · BR-GRP-06

**Actor:** Người được mời
**Trigger:** Mở lời mời nhận qua email hoặc trong ứng dụng
**Preconditions:** Lời mời đang Pending; người dùng đăng nhập bằng tài khoản có email được mời.

**Main Flow**
1. Người được mời mở lời mời.
2. Người được mời chọn Chấp nhận.
3. Lời mời chuyển sang Accepted và người dùng trở thành thành viên nhóm (Worker).
4. Nhóm xuất hiện trong danh sách nhóm của người dùng; họ thấy toàn bộ task của nhóm và có thể được Host giao việc.

**Alternative Flows**
- 2a. Người được mời chọn Từ chối: lời mời chuyển sang Rejected, người dùng không phải thành viên.

**Exceptions**
- E1. Lời mời đã bị thu hồi: thông báo lời mời không còn hiệu lực.

---

## UC-006: Tạo, sửa, xóa và giao task nhóm
**Liên quan:** US-17, US-18 · BR-GRP-02 đến BR-GRP-05, BR-GRP-09, BR-TASK-02

**Actor:** Host
**Trigger:** Bấm "Thêm task" trong nhóm, chọn sửa hoặc xóa task, hoặc bấm "Assign Worker"

**Main Flow (tạo và giao)**
1. Host nhập tiêu đề, mô tả, deadline (task nhóm không có mức quan trọng).
2. Hệ thống tạo task trạng thái Todo, chưa giao ai.
3. Host bấm "Assign Worker".
4. Hệ thống hiển thị sẵn danh sách thành viên đã chấp nhận lời mời (gồm cả Host).
5. Host gõ dần tên; danh sách rút gọn theo tên khớp.
6. Host chọn một người.
7. Hệ thống kiểm tra người đó thuộc nhóm, rồi lưu người được giao.
8. Task xuất hiện trong danh sách chung của nhóm, hiển thị tên người được giao.

**Alternative Flows**
- 6a. Host chọn chính mình: hợp lệ.
- 6b. Giao lại cho người khác: người được giao cũ bị thay bằng người mới (mỗi task tối đa một người).
- 3a. Host sửa task (nội dung, deadline, người được giao) hoặc xóa task.
- 3b. Xóa task: hệ thống xóa task cùng toàn bộ dữ liệu liên quan: subtask, bình luận, bản tóm tắt trao đổi (BR-AI-05), lịch sử nhắc việc. Ảnh chụp task trong báo cáo tiến độ đã lưu được giữ nguyên *(đề xuất)*.

**Exceptions**
- E1. Người không phải Host tạo, sửa, xóa hoặc giao: từ chối (BR-GRP-02, BR-GRP-04).
- E2. Người được chọn không thuộc nhóm hoặc chưa Accepted: từ chối (BR-GRP-03).

---

## UC-007: Đổi trạng thái task
**Liên quan:** US-11, US-20 · BR-TASK-01, BR-TASK-05, BR-TASK-07, BR-TASK-08, BR-TASK-12, BR-GRP-04

**Actor:** Chủ task (cá nhân); mọi thành viên nhóm gồm Host và Worker (task nhóm)
**Trigger:** Chọn trạng thái mới cho một task

**Main Flow**
1. Người dùng chọn trạng thái mới (Todo, In progress hoặc Done).
2. Hệ thống kiểm tra quyền: với task cá nhân là chủ task; với task nhóm là thành viên của nhóm, không phân biệt có được giao hay không.
3. Hệ thống cập nhật trạng thái.
4. Task chuyển nhóm và vị trí trong danh sách; task Done xuống phần Done, gạch ngang và không còn bị coi là quá hạn.

**Alternative Flows**
- 1a. Mở lại task Done (về In progress hoặc Todo): hợp lệ, đi theo mọi hướng. Task rời phần Done và được đẩy lên lại phần việc đang làm, đúng vị trí theo cách xem người dùng đang chọn: xem theo thời gian thì theo deadline; xem theo mức quan trọng (task cá nhân) thì vào đúng một trong 4 nhóm. Nếu deadline đã qua thì task lại quá hạn và nằm ở đầu nhóm tương ứng.

**Exceptions**
- E1. Người ngoài nhóm đổi trạng thái task nhóm: từ chối.
- E2. Người dùng khác đổi trạng thái task cá nhân không phải của mình: từ chối.

---

## UC-008: Bình luận trên task nhóm
**Liên quan:** US-22 · BR-GRP-04, BR-GRP-10

**Actor:** Host, Worker (mọi task nhóm)
**Trigger:** Nhập bình luận ở cửa sổ chat của task trên màn hình nhóm

**Main Flow**
1. Người dùng chọn một task trong danh sách; cửa sổ chat của task hiện cạnh danh sách.
2. Người dùng nhập nội dung văn bản và gửi.
3. Hệ thống kiểm tra người dùng là thành viên của nhóm.
4. Hệ thống lưu bình luận cùng người gửi và thời gian gửi.
5. Bình luận hiển thị trong danh sách theo thứ tự thời gian.

**Exceptions**
- E1. Người ngoài nhóm bình luận: từ chối.
- E2. Nội dung rỗng: không gửi *(đề xuất)*.

**Ghi chú:** Worker bình luận được trên task giao cho người khác hoặc chưa giao. Chưa có trả lời lồng nhau, sửa lịch sử bình luận, thông báo thời gian thực.

---

## UC-009: Tóm tắt trao đổi trên task
**Liên quan:** US-25, US-26 · BR-AI-01 đến BR-AI-05, BR-AI-08

**Actor:** Host, Worker (mọi task nhóm, vì task của người này có thể ảnh hưởng người khác)
**Trigger:** Bấm "Tóm tắt trao đổi" ở chi tiết task

**Main Flow**
1. Người dùng bấm "Tóm tắt trao đổi".
2. Hệ thống kiểm tra người dùng là thành viên của nhóm (BR-AI-01).
3. Hệ thống kiểm tra task có ít nhất 2 bình luận.
4. Hệ thống lấy tối đa 100 bình luận mới nhất và gửi cho LLM như dữ liệu (không có ID, email).
5. LLM trả về tổng quan ngắn, các điểm đã thống nhất, các điểm còn vướng.
6. Hệ thống lưu bản tóm tắt (thay bản cũ nếu có) kèm thời điểm tạo.
7. Hệ thống hiển thị bản tóm tắt; mọi thành viên nhóm đều xem được bản đã lưu.

**Alternative Flows**
- 3a. Đã có bản tóm tắt và chưa có bình luận mới kể từ lúc tạo: hiển thị bản cũ kèm thông báo "chưa có bình luận mới kể từ lúc ...", không gọi LLM.

**Exceptions**
- E1. Ít hơn 2 bình luận: từ chối, không gọi LLM.
- E2. Người ngoài nhóm tóm tắt: từ chối, không gọi LLM.
- E3. LLM lỗi hoặc trả kết quả không đọc được: báo lỗi, giữ nguyên bản tóm tắt cũ *(đề xuất)*.

---

## UC-010: Lập báo cáo tiến độ nhóm
**Liên quan:** US-27 đến US-31 · BR-AI-01, BR-AI-02, BR-AI-06, BR-AI-08, BR-AI-11

**Actor:** Host
**Trigger:** Bấm "Báo cáo tiến độ" ở trang nhóm

**Main Flow**
1. Host bấm "Báo cáo tiến độ".
2. Hệ thống kiểm tra người dùng là Host.
3. Hệ thống tính số liệu: task theo trạng thái, task quá hạn, task đang mở (Todo và In progress), task đến hạn trong 7 ngày tới, số việc đang mở của từng thành viên, task chưa giao.
4. Hệ thống so ảnh chụp task hiện tại với báo cáo gần nhất và tính phần so sánh **chỉ về tiến độ task**: việc mới hoàn thành, mới bắt đầu, mở lại, mới thêm, bị xóa, đổi deadline, mới quá hạn, vẫn quá hạn, số việc còn lại. Không so sánh thông tin thành viên (người mới, người cũ, đổi người được giao).
5. Hệ thống gửi cho LLM: số liệu, phần thay đổi, và danh sách task đang mở kèm **tên hiển thị của người đảm nhận** (hoặc "chưa giao"). Không gửi ID, email. Tên và tiêu đề là dữ liệu, không phải chỉ thị (BR-AI-08).
6. LLM viết nhận xét: tổng quan, điểm đáng chú ý, rủi ro, gợi ý vài việc nên làm trước (nêu tên người đảm nhận) dựa trên deadline và trạng thái. **Mỗi nhận định, rủi ro và gợi ý kèm lời giải thích ngắn** nêu căn cứ (ví dụ: "vì quá hạn 3 ngày và vẫn Todo").
7. Hệ thống lưu báo cáo mới (nhận xét, số liệu, thời điểm, ảnh chụp task); giữ tối đa 2 báo cáo gần nhất và xóa báo cáo cũ nhất.
8. Hệ thống hiển thị số liệu do hệ thống tính ngay cạnh nhận xét của AI.

**Alternative Flows**
- 4a. Không có gì thay đổi về tiến độ task (tập task, trạng thái, deadline, trạng thái quá hạn) so với ảnh chụp: hiển thị báo cáo cũ kèm thông báo "chưa có thay đổi kể từ lúc ...", không gọi LLM, không lưu báo cáo mới.
- 4b. Đây là báo cáo đầu tiên của nhóm: không có phần so sánh.

**Exceptions**
- E1. Người không phải Host: từ chối, không gọi LLM, không thấy báo cáo.
- E2. LLM lỗi hoặc trả kết quả không đọc được: báo lỗi, không lưu báo cáo mới *(đề xuất)*.

---

## UC-011: Nhắc việc qua email
**Liên quan:** US-23 · BR-REM-01, BR-REM-02

**Actor:** Host
**Trigger:** Bấm "Nhắc việc" ở một task đã giao

**Main Flow**
1. Host chọn nhắc việc cho một task đã giao.
2. Hệ thống kiểm tra người dùng là Host.
3. Hệ thống kiểm tra task chưa được nhắc trong 1 giờ qua.
4. Hệ thống gửi email tới người được giao kèm thông tin công việc và deadline.
5. Hệ thống ghi lại thời điểm nhắc và thông báo cho Host.

**Exceptions**
- E1. Người không phải Host: từ chối.
- E2. Task đã được nhắc trong 1 giờ qua: từ chối, không gửi email.
- E3. Task chưa giao cho ai: không gửi *(đề xuất)*.

---

## UC-012: Rời nhóm
**Liên quan:** US-24 · BR-GRP-07

**Actor:** Thành viên (Worker)
**Trigger:** Bấm "Rời nhóm"

**Main Flow**
1. Thành viên xác nhận rời nhóm.
2. Hệ thống bỏ thành viên khỏi nhóm.
3. Các task đang giao cho thành viên chuyển thành chưa giao; task vẫn được giữ.
4. Nhóm biến mất khỏi danh sách nhóm của thành viên và không còn trong danh sách chọn người được giao.

**Exceptions**
- E1. Host rời nhóm: chưa quy định (xem Câu hỏi mở).

---

## Câu hỏi mở
1. Subtask trong task nhóm: đề xuất Host tạo, sửa, xóa (như một phần của sửa task), mọi thành viên đổi được trạng thái subtask (cùng tinh thần với trạng thái task). Cần xác nhận; BR-TASK-03 áp dụng cho cả hai chế độ nhưng chưa có luật nhóm.
2. Host rời nhóm hoặc xóa nhóm thì xử lý thế nào? Host có xóa được thành viên không?
3. Mời email đã là thành viên hoặc đã có lời mời Pending: tạo thêm hay từ chối?
4. Xóa task nhóm giữ ảnh chụp task trong báo cáo đã lưu (để báo cáo sau nhận ra task bị xóa): xác nhận lại.
5. Đổi người được giao không được tính là thay đổi khi kiểm tra "chưa có gì mới" (BR-AI-11), nhưng báo cáo lại hiển thị số việc của từng thành viên, số task chưa giao và tên người đảm nhận trong gợi ý. Báo cáo cũ có thể hiển thị thông tin đã cũ.
