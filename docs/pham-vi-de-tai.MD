# PHẠM VI ĐỀ TÀI
## Xây dựng Hệ thống Website Tuyển dụng Việc làm dành cho Sinh viên IT Mới ra Trường

- **Tên đề tài:** Xây dựng Hệ thống Website tuyển dụng việc làm dành cho sinh viên IT mới ra trường
- **Mã đề tài:** `344` - [Link đề tài](https://projects-fit.hcmute.edu.vn/?view=student-mytopic&topic=344)
- **Sinh viên thực hiện:** Cao Quốc Trung - MSSV: `22110255`
- **Giảng viên hướng dẫn:** ThS. Nguyễn Minh Đạo


---

## 1. BỐI CẢNH VÀ LÝ DO THỰC HIỆN

Sinh viên IT mới tốt nghiệp thường tìm kiếm các vị trí **Intern, Fresher hoặc Junior** giai đoạn bắt đầu sự nghiệp có nhu cầu khác biệt so với người đã có nhiều năm kinh nghiệm. Tuy nhiên, hầu hết các nền tảng tuyển dụng hiện tại trên thị trường chưa phân cấp rõ theo cấp độ kinh nghiệm, chưa cho phép ứng viên thể hiện năng lực qua dự án cá nhân một cách có cấu trúc, và chưa hỗ trợ nhà tuyển dụng đăng tin có chuẩn chung cho vị trí IT cơ bản.

Đề tài xây dựng một **website tuyển dụng tập trung** phục vụ đối tượng sinh viên IT mới ra trường, kết nối ứng viên và nhà tuyển dụng thông qua hệ thống thông tin có cấu trúc, minh bạch và dễ sử dụng.

---

## 2. MỤC TIÊU HỆ THỐNG

| Góc độ | Mục tiêu cụ thể |
|---|---|
| **Ứng viên** | Tìm việc theo cấp độ (Intern/Fresher/Junior), kỹ năng và địa điểm; thể hiện năng lực qua hồ sơ dự án cá nhân; ứng tuyển và theo dõi trạng thái xử lý hồ sơ |
| **Nhà tuyển dụng** | Đăng tin có cấu trúc, xem và quản lý danh sách ứng viên theo từng tin, tìm kiếm và mở khóa hồ sơ ứng viên tiềm năng bằng hệ thống điểm |
| **Quản trị viên** | Duyệt xác thực danh tính công ty, quản lý gói điểm thanh toán, kiểm duyệt nội dung Blog |

---

## 3. PHẠM VI THỰC HIỆN (IN-SCOPE)

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
   - Thể hiện các bước xử lý thống nhất, tối thiểu gồm: Đã ứng tuyển, Đang xem xét, Phỏng vấn, Đạt/Không đạt.
   - Cập nhật trạng thái và thời điểm cập nhật để ứng viên dễ theo dõi.
6. **Quản lý ứng viên cho nhà tuyển dụng (FEAT-06):**
   - Cho phép nhà tuyển dụng xem các hồ sơ ứng tuyển vào tin do mình quản lý.
   - Hỗ trợ xem hồ sơ, kỹ năng, dự án và liên kết portfolio; lọc hoặc sắp xếp danh sách theo nhu cầu cơ bản.
   - Cho phép cập nhật trạng thái ứng viên và lưu kết quả xử lý.
7. **Quản trị và kiểm duyệt cơ bản (FEAT-07):**
   - Hỗ trợ quản trị viên xem xét tài khoản, tin tuyển dụng và nội dung bị báo cáo.
   - Cho phép ẩn hoặc xử lý tin/nội dung vi phạm theo quyền quản trị.



---

## 4. PHẠM VI KHÔNG THỰC HIỆN (OUT-OF-SCOPE)

| # | Nội dung không thực hiện | Lý do |
|:---:|---|---|
| 1 | Ứng dụng di động native iOS/Android | Phạm vi đồ án giới hạn ở website responsive |
| 2 | Tích hợp hệ thống ATS/HRM, quản lý lương hoặc nghiệp vụ sau tuyển dụng | Vượt ngoài phạm vi tuyển dụng ban đầu |
| 3 | Bài kiểm tra lập trình online, giám sát thi, chấm điểm tự động | Khác loại dịch vụ, không thuộc tuyển dụng |
| 4 | AI tự động xếp hạng hoặc loại ứng viên thay con người | Đảm bảo công bằng và minh bạch trong tuyển dụng |
| 5 | Cam kết việc làm, tư vấn nghề nghiệp 1-1 | Hệ thống kết nối, không là đơn vị tư vấn |
| 6 | Thu thập tin tuyển dụng từ các nền tảng bên ngoài (crawl/scrape) | Rủi ro pháp lý, ngoài phạm vi đồ án |
| 7 | Hợp đồng lao động điện tử hoặc quy trình sau khi ứng viên được tuyển | Thuộc nghiệp vụ quản trị nhân sự, không thuộc tuyển dụng |

---

## 5.  CÔNG NGHỆ SỬ DỤNG

| Tầng | Công nghệ | Ghi chú |
|---|---|---|
| **Frontend** | React.js | REST API + WebSocket/STOMP |
| **Backend** | Spring Boot 4.0.6 / Java 21 | REST API, bảo mật JWT, WebSocket dispatcher |
| **Cơ sở dữ liệu** | MySQL | |
| **Xác thực** | JWT + Spring Security OAuth2 Resource Server | Stateless, dùng chung cho REST API & WebSocket |
| **WebSocket** | STOMP + SockJS + Spring Simple Broker | Truyền thông tin |
| **Lưu trữ ảnh** | Cloudinary | Lưu trữ Logo công ty, thumbnail Blog |
| **Thanh toán** | Stripe Checkout + Webhook | Xác thực chữ ký `Stripe-Signature` |
| **Email** | JavaMailSender / SMTP | Kích hoạt tài khoản, xác nhận ứng tuyển |
