# Đề xuất dự án: To-do App tích hợp AI

## 1. Tổng quan
Ứng dụng quản lý công việc trên nền tảng web, hỗ trợ hai chế độ:
* **Personal Mode:** quản lý task cá nhân.
* **Group Mode:** phối hợp công việc theo nhóm, có **Host** (người tạo nhóm) và **Worker** (thành viên còn lại). Cả nhóm dùng chung một màn hình gồm danh sách toàn bộ task và cửa sổ chat.

Ở Group Mode, hệ thống tích hợp LLM để tóm tắt trao đổi trên task (Host và Worker đều dùng được trên mọi task) và lập báo cáo tiến độ nhóm (chỉ Host). Mục 2 là phạm vi hiện tại. Mục 3 gom các phần chưa triển khai, giữ lại làm ngữ cảnh.

---

## 2. Phạm vi hiện tại

### 2.1. Tài khoản
* Đăng nhập bằng Google, chỉ nhận tài khoản có email đã xác minh. Người dùng được nhận diện bằng `google_id`, không phải email.
* Phiên đăng nhập kéo dài 7 ngày, lưu trong cookie HttpOnly. Đăng xuất thì xóa cookie.

### 2.2. Task (dùng ở cả hai chế độ)
**Thuộc tính:** tiêu đề, mô tả, deadline, trạng thái (*Chưa làm*, *Đang làm*, *Đã hoàn thành*) và mức quan trọng.

* **Mức quan trọng:** *Bình thường* (mặc định) hoặc *Quan trọng*, hai mức cố định. Chỉ có ở task cá nhân, task nhóm không có.
* **Subtask:** thuộc đúng một task cha, theo dõi trạng thái từng subtask. Xóa task cha thì xóa luôn subtask.
* **Hoàn thành:** task đã hoàn thành vẫn hiển thị, gạch ngang. Người được phép đổi trạng thái (chủ task với task cá nhân; mọi thành viên nhóm với task nhóm) đổi sang trạng thái nào cũng được, kể cả từ *Đã hoàn thành* về lại. Task được mở lại sẽ rời phần hoàn thành và được đẩy lên lại phần việc đang làm, đúng vị trí theo cách xem người dùng đang chọn.
* **Quá hạn:** task chưa hoàn thành mà deadline đã qua. Deadline chỉ có ngày thì đến hết ngày đó chưa tính quá hạn. Task không có deadline không bao giờ quá hạn. Deadline được phép ở quá khứ. Ngày quá hạn hiển thị khác màu.
* **Lọc và tìm kiếm:** chỉ có ở danh sách nhóm (xem 2.4). Danh sách cá nhân không có lọc và tìm kiếm, hai cách xem đã đủ để sắp xếp.

**Sắp xếp tự động** (không có kéo thả):

Cách xem:
Danh sách cá nhân: Hai cách, có nút chuyển. Mặc định theo mức quan trọng. Lựa chọn được ghi nhớ theo tài khoản
Danh sách nhóm: Luôn theo thời gian

* **Theo thời gian:** một danh sách theo deadline gần nhất trước, nên task quá hạn nằm đầu. Task không có deadline nằm cuối. Cùng deadline thì task tạo trước đứng trước. Ở danh sách cá nhân, mức quan trọng vẫn hiện trên task nhưng không dùng để sắp xếp.
* **Theo mức quan trọng** (chỉ danh sách cá nhân): task chưa hoàn thành chia 4 nhóm theo thứ tự: Quan trọng quá hạn, Quan trọng chưa quá hạn, Bình thường quá hạn, Bình thường chưa quá hạn. Trong mỗi nhóm xếp theo thời gian. Task tự chuyển nhóm khi đổi trạng thái, deadline, mức quan trọng, hoặc khi sang ngày mới mà bị quá hạn.
* **Task đã hoàn thành:** ở mọi cách xem đều nằm trong phần riêng phía sau, task cập nhật gần nhất đứng trước. Task Done được mở lại thì quay lại phần việc đang làm và được xếp như mọi task chưa hoàn thành khác.

### 2.3. Personal Mode
* Quản lý danh sách task riêng: tạo, sửa, subtask, đổi trạng thái, mức quan trọng, deadline.
* Chuyển giữa hai cách xem (theo mức quan trọng, theo thời gian). Không có lọc và tìm kiếm.
* Không có tính năng AI.

### 2.4. Group Mode

**Nhóm và thành viên**
* Người tạo nhóm là Host; mỗi nhóm có đúng một Host (phiên bản đầu).
* Host mời thành viên qua email. Lời mời có trạng thái `Pending`, `Accepted`, `Rejected`; Host chỉ thu hồi được lời mời `Pending`.
* Email chưa có tài khoản thì không tạo lời mời. Hệ thống báo cho Host để mời người đó đăng nhập Google một lần rồi mời lại.
* Khi Worker rời nhóm, task của họ chuyển thành chưa giao và vẫn được giữ. (BR-GRP-07)

**Màn hình nhóm dùng chung**
* Host và Worker nhìn cùng một màn hình: danh sách toàn bộ task của nhóm và cửa sổ chat của task đang chọn.
* Mọi thành viên đều lọc và tìm task theo trạng thái, deadline, người được giao (theo tên, gồm cả "chưa giao"), từ khóa trong tiêu đề.
* Thứ tự task nhóm do hệ thống tự xếp theo thời gian.

**Giao việc và phân quyền**
* Chỉ Host tạo, sửa, xóa và giao task. Mỗi task có tối đa một người được giao, có thể là chính Host.
* Khi giao việc, Host thấy danh sách các thành viên đã chấp nhận lời mời (kể cả Host). Gõ dần tên thì danh sách rút gọn theo tên khớp, như bộ lọc trong Excel.
* Worker chỉ đổi trạng thái và bình luận, trên bất kỳ task nào của nhóm (không phụ thuộc có được giao hay không). Worker không thêm, sửa nội dung, deadline, người được giao hay xóa task.
* Xóa task nhóm thì mọi thứ liên quan (subtask, bình luận, bản tóm tắt, lịch sử nhắc việc) bị xóa theo.

**Nhắc việc qua email**
* Host gửi email nhắc người được giao về task, gồm thông tin công việc và deadline. Mỗi task tối đa một email nhắc mỗi giờ.

**Bình luận trên task**
* Host và Worker đều bình luận được trên mọi task của nhóm.
* Bình luận dạng văn bản, hiển thị nội dung, người gửi, thời gian. Chưa có trả lời lồng nhau, sửa lịch sử hay thông báo thời gian thực.

### 2.5. AI hỗ trợ (Group Mode)
Tóm tắt trao đổi: Host và Worker đều dùng được trên mọi task của nhóm, vì task của người này có thể ảnh hưởng người khác. Báo cáo tiến độ: chỉ Host dùng và xem. AI chỉ đọc dữ liệu và viết văn bản để hiển thị, không sửa dữ liệu nào. LLM không nhận ID hay email; tiêu đề, mô tả, bình luận và tên hiển thị được gửi như dữ liệu, không phải chỉ thị.

**Tóm tắt trao đổi trên task**
* Host hoặc Worker bấm tóm tắt ở task có ít nhất 2 bình luận. LLM nhận tối đa 100 bình luận mới nhất. Mọi thành viên đều xem được bản tóm tắt đã lưu.
* Kết quả gồm: tổng quan ngắn, các điểm đã thống nhất, các điểm còn vướng.
* Bản tóm tắt mới nhất được lưu theo task, hiển thị thời điểm tạo. Chưa có bình luận mới thì hiện bản cũ kèm thông báo và không gọi LLM.

**Báo cáo tiến độ nhóm** (BR-AI-06, 11)
* Backend tự tính số liệu: task theo trạng thái, quá hạn, đang mở, đến hạn trong 7 ngày tới, việc đang mở của từng thành viên, task chưa giao. LLM chỉ viết nhận xét từ các số liệu này, kèm gợi ý vài việc nên làm trước dựa trên deadline và trạng thái.
* Mỗi nhận xét, rủi ro và gợi ý của AI có lời giải thích ngắn nêu căn cứ. Gợi ý việc nên làm trước nêu tên người đảm nhận (hoặc ghi chưa giao). Đây là chỗ duy nhất AI cần tên người được giao.
* Màn hình hiện số liệu cạnh phần AI để Host đối chiếu.
* Hệ thống lưu 2 báo cáo gần nhất, mỗi báo cáo kèm ảnh chụp task (id, tiêu đề, trạng thái, deadline, quá hạn) lúc tạo, và hiển thị thời điểm tạo báo cáo mới nhất. Không lưu thông tin thành viên.
* Không có gì thay đổi về tiến độ task so với ảnh chụp thì hiện báo cáo cũ kèm thông báo, không gọi LLM. Đổi người được giao hoặc thay đổi thành viên không được tính là thay đổi.
* Có thay đổi thì tạo báo cáo mới, kèm phần so với lần trước do backend tính từ ảnh chụp, chỉ về tiến độ task: việc mới hoàn thành, mới bắt đầu, mở lại, mới thêm, bị xóa, đổi deadline, mới quá hạn, vẫn quá hạn, và số việc còn lại. Báo cáo đầu tiên không có phần so sánh. Lưu báo cáo mới thì xóa báo cáo cũ nhất trong 2 báo cáo đang lưu.

---

## 3. Chưa triển khai (giữ làm ngữ cảnh)
Các phần dưới đây không nằm trong phạm vi hiện tại. Phần có mã BR là đã được ghi vào mục Deferred của Business Rules.

**Tài khoản**
* Đăng ký, đăng nhập bằng email và mật khẩu, quên mật khẩu qua email. Mật khẩu phải lưu dạng hash. Lý do hoãn: đăng nhập Google đã đủ cho xác thực. (BR-AUTH-DEF-01)
* Đăng nhập nhanh khi một thiết bị có nhiều tài khoản đã dùng trước đó (tương tự Facebook), chỉ giúp chọn tài khoản đã lưu và không bỏ qua bước xác thực. Quản lý thông tin tài khoản cơ bản. Hai mục này chưa có trong Business Rules.

**Task**
* **Công việc định kỳ:** lặp theo ngày, tuần hoặc tháng. Mỗi lần lặp tạo một task độc lập, có trạng thái và deadline riêng. Task mới được tạo đúng lịch dù task kỳ trước chưa hoàn thành, deadline là ngày theo lịch. Lý do hoãn: chưa thiết kế luồng tự tạo task. (BR-PER-02, 03)
* **Thêm task nhóm vào danh sách cá nhân:** là bản tham chiếu đến task nhóm, không phải bản sao; cập nhật trạng thái hay thông tin chính thức vẫn theo quyền của task nhóm. Lý do hoãn: cần bảng liên kết, xử lý quyền xem và quy tắc khi xóa, đồng bộ trạng thái. (BR-PER-01)

**Nhóm**
* **Quản lý tài liệu:** đính kèm tài liệu vào task hoặc khu vực tài liệu của nhóm, hiển thị tên tệp, người tải lên, thời gian tải lên; thành viên chỉ truy cập tài liệu trong phạm vi quyền. Nên giới hạn loại tệp và dung lượng. Chưa quyết định, được xem là chức năng mở rộng. (BR-DOC-DEF-01)

**AI**
* Báo cáo theo khoảng thời gian cố định (ví dụ "hoàn thành trong tuần"), cần thêm trường `completedAt` cho task. Hiện báo cáo so với báo cáo trước. (BR-AI-DEF-01)
* AI soạn sẵn email nhắc việc để Host chỉnh và gửi. (BR-AI-DEF-02)
* Lưu nhiều hơn 2 báo cáo. (BR-AI-DEF-03)
* Giới hạn số lượt dùng AI mỗi ngày. (BR-AI-DEF-04)
