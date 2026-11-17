# BẢN CAM KẾT SẢN PHẨM CUỐI CÙNG VÀ BỘ CHỈ SỐ ĐÁNH GIÁ (BƯỚC 3)

- **Tên đề tài chính thức:** **Xây dựng Hệ thống Website tuyển dụng việc làm dành cho sinh viên IT mới ra trường**
- **Mã đề tài cổng Project:** `344` ([Link đề tài](https://projects-fit.hcmute.edu.vn/?view=student-mytopic&topic=344))
- **Sinh viên thực hiện:** **Cao Quốc Trung** — MSSV: `22110255`
- **Giảng viên hướng dẫn:** **ThS. Nguyễn Minh Đạo**
- **Thời điểm chốt cam kết:** Mốc 50% thời gian thực hiện đồ án (Hạn nộp Bước 3: 23/11/2026).

---

## 1. BỐI CẢNH VÀ MỤC TIÊU ĐỀ TÀI

### 1.1. Bối cảnh thực tế

Sinh viên IT mới tốt nghiệp thường tìm kiếm cơ hội Intern, Fresher hoặc Junior khi chưa có nhiều kinh nghiệm làm việc toàn thời gian. Năng lực của ứng viên có thể được thể hiện qua kỹ năng, đồ án và dự án cá nhân, nhưng hồ sơ và tin tuyển dụng không phải lúc nào cũng trình bày thông tin theo cấu trúc thống nhất. Ứng viên vì thế khó đánh giá mức độ phù hợp, còn nhà tuyển dụng mất thời gian đọc và so sánh hồ sơ.

### 1.2. Mục tiêu sản phẩm

Xây dựng website tuyển dụng tập trung vào giai đoạn bắt đầu sự nghiệp IT. Hệ thống hỗ trợ ứng viên tìm việc theo cấp độ và yêu cầu kỹ năng, thể hiện năng lực qua hồ sơ dự án, ứng tuyển và theo dõi trạng thái; đồng thời hỗ trợ nhà tuyển dụng đăng tin có cấu trúc, xem hồ sơ và quản lý tiến trình xử lý ứng viên.

---

## 2. PHẠM VI CAM KẾT HOÀN THÀNH

### 2.1. Phạm vi thực hiện (In-Scope — 7 phân hệ chức năng)

Sinh viên cam kết hoàn thiện các chức năng cốt lõi dưới đây, tích hợp thành website responsive và có thể kiểm thử theo các kịch bản nghiệm thu:

1. **Tài khoản và hồ sơ ứng viên (FEAT-01):**
   - Hỗ trợ tài khoản và cho phép ứng viên tạo, cập nhật hồ sơ cơ bản, kỹ năng, học vấn và thông tin liên hệ cần thiết.
   - Cho phép thêm dự án với mô tả, vai trò cá nhân, công nghệ sử dụng và liên kết GitHub/portfolio.
   - Kiểm tra dữ liệu đầu vào và chỉ hiển thị thông tin hồ sơ theo quyền truy cập phù hợp.
2. **Đăng tuyển và quản lý tin (FEAT-02):**
   - Hỗ trợ nhà tuyển dụng tạo, chỉnh sửa, mở và đóng tin tuyển dụng IT.
   - Tin đăng có cấu trúc về vị trí, cấp độ Intern/Fresher/Junior, mô tả công việc, kỹ năng bắt buộc, kỹ năng ưu tiên, kinh nghiệm, địa điểm, hình thức làm việc và quyền lợi.
   - Kiểm tra các trường bắt buộc trước khi đăng tin.
3. **Tìm kiếm và lọc việc làm (FEAT-03):**
   - Cho phép ứng viên tìm tin theo từ khóa và lọc theo vị trí, cấp độ, kỹ năng, địa điểm và hình thức làm việc.
   - Hiển thị thông tin đủ để ứng viên hiểu yêu cầu và tự đánh giá độ phù hợp trước khi ứng tuyển.
4. **Ứng tuyển (FEAT-04):**
   - Cho phép ứng viên gửi hồ sơ đến tin đang mở và nhận xác nhận sau khi gửi thành công.
   - Thông báo rõ các trường hợp chưa đủ dữ liệu hoặc tin đã đóng.
5. **Theo dõi trạng thái ứng tuyển (FEAT-05):**
   - Cung cấp danh sách hồ sơ đã ứng tuyển và trạng thái hiện tại.
   - Thể hiện các bước xử lý thống nhất, tối thiểu gồm: Đã ứng tuyển, Đang xem xét, Phỏng vấn, Đạt/Không đạt và Ứng viên rút hồ sơ.
   - Cập nhật trạng thái và thời điểm cập nhật để ứng viên dễ theo dõi.
6. **Quản lý ứng viên cho nhà tuyển dụng (FEAT-06):**
   - Cho phép nhà tuyển dụng xem các hồ sơ ứng tuyển vào tin do mình quản lý.
   - Hỗ trợ xem hồ sơ, kỹ năng, dự án và liên kết portfolio; lọc hoặc sắp xếp danh sách theo nhu cầu cơ bản.
   - Cho phép cập nhật trạng thái ứng viên và lưu kết quả xử lý.
7. **Quản trị và kiểm duyệt cơ bản (FEAT-07):**
   - Hỗ trợ quản trị viên xem xét tài khoản, tin tuyển dụng và nội dung bị báo cáo.
   - Cho phép ẩn hoặc xử lý tin/nội dung vi phạm theo quyền quản trị.
  

### 2.2. Phạm vi không thực hiện (Out-of-Scope)

- Không phát triển ứng dụng di động native iOS/Android; sản phẩm là website responsive.
- Không tích hợp sâu với hệ thống ATS/HRM, tính lương hoặc nghiệp vụ quản trị nhân sự sau tuyển dụng.
- Không tổ chức bài kiểm tra lập trình trực tuyến, giám sát thi hoặc chấm điểm tự động.
- Không dùng AI để tự động xếp hạng, loại ứng viên hoặc đưa ra quyết định tuyển dụng thay con người.
- Không cam kết việc làm, tư vấn nghề nghiệp 1-1 hoặc bảo đảm ứng viên được tuyển.
- Không thu thập và tổng hợp toàn bộ tin tuyển dụng IT trên thị trường từ các nền tảng bên ngoài.
- Không xây dựng hợp đồng lao động điện tử hoặc quy trình sau khi ứng viên được tuyển.

---

## 3. BỘ 5 CHỈ SỐ KPI NGHIỆP VỤ ĐỊNH LƯỢNG

Theo yêu cầu Tiêu chuẩn Đánh giá TC1 (Mức 5) và TC2.2 của Rubric, sinh viên cam kết hoàn thành và kiểm chứng bộ 5 chỉ số định lượng sau đây từ Bước 3 cho đến khi bảo vệ trước Hội đồng:

| Mã KPI | Tên chỉ số | Mô tả và công thức đo lường | Ngưỡng cam kết (Target) | Phương pháp và bằng chứng kiểm chứng |
|---|---|---|---|---|
| **KPI-01** | **Tìm kiếm và lọc việc phù hợp** | Độ chính xác của kết quả lọc theo điều kiện người dùng chọn; thời gian tải danh sách tin trong kịch bản kiểm thử đã định. | • **100%** kết quả trong bộ kiểm thử thỏa các bộ lọc đã chọn.<br>• Thời gian hiển thị kết quả tìm kiếm/lọc **≤ 3 giây** trong môi trường nghiệm thu. | Bộ kiểm thử chức năng với dữ liệu tin tuyển dụng có cấp độ, kỹ năng, địa điểm và hình thức làm việc đã biết; ghi nhận thời gian trên môi trường nghiệm thu. |
| **KPI-02** | **Hoàn thành hồ sơ và ứng tuyển** | Tỷ lệ người thử nghiệm hoàn thành luồng tạo/cập nhật hồ sơ, tìm tin và gửi hồ sơ ứng tuyển mà không cần trợ giúp. | • Ít nhất **10 người** thuộc nhóm sinh viên năm cuối/người mới tốt nghiệp tham gia.<br>• Tỷ lệ hoàn thành luồng ứng viên **≥ 85%**.<br>• Hồ sơ gửi thành công được ghi nhận đúng tin và đúng ứng viên trong **100%** ca kiểm thử. | Danh sách tác vụ, kết quả từng người tham gia và kiểm tra dữ liệu ứng tuyển sau khi chạy luồng. |
| **KPI-03** | **Quản lý tin và xử lý hồ sơ ứng viên** | Tỷ lệ nhà tuyển dụng hoàn thành các tác vụ tạo tin có cấu trúc, xem hồ sơ và cập nhật trạng thái ứng viên. | • Tỷ lệ hoàn thành các tác vụ chính **≥ 85%**.<br>• Thông tin kỹ năng bắt buộc/ưu tiên và cấp độ được lưu, hiển thị chính xác trong **100%** ca kiểm thử.<br>• Trạng thái sau cập nhật được phản ánh chính xác cho ứng viên trong **100%** ca kiểm thử. | Kịch bản kiểm thử vai trò nhà tuyển dụng và ứng viên; đối chiếu dữ liệu đã lưu với giao diện hai vai trò. |
| **KPI-04** | **Hiệu năng và tương thích giao diện** | Thời gian tải các trang nghiệp vụ chính và khả năng sử dụng các luồng chính trên kích thước màn hình phổ biến. | • Thời gian tải trang chính **≤ 3 giây** ở môi trường kiểm thử đã công bố.<br>• Các luồng tìm việc, xem tin và ứng tuyển sử dụng được trên màn hình desktop.<br>• Không có lỗi chặn luồng (blocker) trong các kịch bản nghiệm thu. | Báo cáo đo hiệu năng trên môi trường nghiệm thu. |
| **KPI-05** | **Chất lượng và độ tin cậy chức năng** | Mức độ ổn định của các ca kiểm thử tự động/thủ công và số lỗi nghiêm trọng còn tồn tại tại thời điểm bàn giao. | • **100%** ca kiểm thử đạt trước nghiệm thu.<br>• Độ bao phủ kiểm thử các luồng nghiệp vụ cốt lõi **≥ 70%**.<br>• **0** lỗi Blocker/Critical chưa xử lý trong các chức năng thuộc phạm vi cam kết. | Báo cáo test, checklist nghiệm thu theo FEAT-01 đến FEAT-07 và danh sách lỗi đã xử lý/còn tồn tại. |

---

## 4. CAM KẾT TRIỂN KHAI VÀ NGHIỆM THU

1. **Môi trường vận hành:**
   - Cung cấp phiên bản website có thể truy cập để giảng viên và hội đồng kiểm tra; nếu hạ tầng triển khai công khai không khả dụng, cung cấp hướng dẫn chạy và dữ liệu/tài khoản kiểm thử tại môi trường thay thế.
   - Không đưa thông tin cá nhân thật hoặc bí mật truy cập vào dữ liệu demo, mã nguồn công khai hay tài liệu bàn giao.
2. **Kịch bản demo trực tiếp:**
   - Ứng viên cập nhật hồ sơ và dự án → tìm/lọc tin Intern/Fresher/Junior → xem chi tiết yêu cầu → ứng tuyển → theo dõi trạng thái.
   - Nhà tuyển dụng tạo tin có cấu trúc → xem hồ sơ ứng tuyển và dự án → cập nhật trạng thái → ứng viên kiểm tra trạng thái mới.
   - Quản trị viên xem và xử lý một tin hoặc nội dung được báo cáo theo quyền được cấp.
---

## 5. CAM KẾT ĐÓNG GÓP VÀ TRÁCH NHIỆM

- Sinh viên thực hiện đề tài là **Cao Quốc Trung** cam kết chịu trách nhiệm **100%** đối với các công việc trong phạm vi đồ án, bao gồm:
  - Phân tích yêu cầu và hoàn thiện đặc tả chức năng cho ba vai trò: ứng viên, nhà tuyển dụng và quản trị viên.
  - Xây dựng các luồng hồ sơ, tin tuyển dụng, tìm kiếm/lọc, ứng tuyển, theo dõi trạng thái và kiểm duyệt cơ bản.
  - Kiểm thử chức năng, ghi nhận lỗi, chuẩn bị kịch bản demo.
  - Hoàn thiện tài liệu và bàn giao hướng dẫn sử dụng/chạy hệ thống.
- Mọi thay đổi trong phạm vi và kết quả thực hiện được lưu vết trong mã nguồn, tài liệu và lịch sử quản lý phiên bản của dự án.

---

## 6. XÁC NHẬN VÀ KÝ DUYỆT BẢN CAM KẾT

_TP. Hồ Chí Minh, ngày ...... tháng ...... năm 2026_

| Sinh viên thực hiện | Giảng viên hướng dẫn | 
|:---:|:---:|
| _(Ký và ghi rõ họ tên)_ | _(Ký và ghi rõ họ tên)_ | 
| <br><br><br>**Cao Quốc Trung**<br>MSSV: `22110255` | <br><br><br>**ThS. Nguyễn Minh Đạo** |
