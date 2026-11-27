# Use Cases, Acceptance Criteria & Business Rules — IT Job Portal

---

## MỤC LỤC
1. [Xác thực & Tài khoản](#1-xác-thực--tài-khoản)
2. [Quản lý Công ty (Employer)](#2-quản-lý-công-ty-employer)
3. [Xác thực Công ty](#3-xác-thực-công-ty)
4. [Quản lý Job (Employer)](#4-quản-lý-job-employer)
5. [Hồ sơ Ứng viên](#5-hồ-sơ-ứng-viên)
6. [Tìm kiếm & Ứng tuyển Job](#6-tìm-kiếm--ứng-tuyển-job)
7. [Quản lý Resume (Employer)](#7-quản-lý-resume-employer)
8. [Mở khóa Hồ sơ & Thanh toán](#8-mở-khóa-hồ-sơ--thanh-toán)
9. [Thông báo Realtime & Quản lý Thông báo](#9-thông-báo-realtime--quản-lý-thông-báo)
10. [Blog & Danh mục Blog](#10-blog--danh-mục-blog)
11. [Quản trị (Admin)](#11-quản-trị-admin)
12. [Yêu cầu phi chức năng (Non-Functional Requirements)](#12-yêu-cầu-phi-chức-năng-non-functional-requirements)
13. [Kiến trúc hệ thống & Lý do lựa chọn công nghệ](#13-kiến-trúc-hệ-thống--lý-do-lựa-chọn-công-nghệ)

---

## 1. Xác thực & Tài khoản

### UC-01: Đăng ký tài khoản
- **Actor**: Khách (chưa đăng nhập)
- **Mô tả**: Người dùng tạo tài khoản mới với vai trò Ứng viên (Candidate) hoặc Nhà tuyển dụng (Employer).

**Acceptance Criteria:**
- AC1: Hệ thống tiếp nhận thông tin đăng ký gồm họ tên, email, mật khẩu và vai trò.
- AC2: Nếu email đã tồn tại trong hệ thống, từ chối đăng ký và thông báo lỗi.
- AC3: Tài khoản mới được khởi tạo ở trạng thái chưa kích hoạt và số điểm ban đầu bằng `0`.
- AC4: Hệ thống tự động gửi email chứa liên kết kích hoạt đến địa chỉ email đã đăng ký.

**Business Rules:**
- BR1: Mỗi địa chỉ email chỉ được phép gắn với tối đa một tài khoản trong toàn hệ thống.
- BR2: Người dùng tự đăng ký chỉ được phép chọn vai trò Ứng viên hoặc Nhà tuyển dụng, không được tự gán vai trò Quản trị viên.
- BR3: Tài khoản chưa được kích hoạt qua email thì không được phép đăng nhập sử dụng hệ thống.

---

### UC-02: Kích hoạt tài khoản
- **Actor**: Người dùng vừa đăng ký
- **Mô tả**: Người dùng xác nhận email thông qua mã kích hoạt để mở khóa tài khoản.

**Acceptance Criteria:**
- AC1: Khi người dùng truy cập liên kết với mã kích hoạt hợp lệ, trạng thái tài khoản chuyển sang đã kích hoạt và trả về thông báo thành công.
- AC2: Khi mã kích hoạt không tồn tại hoặc không hợp lệ, hệ thống từ chối kích hoạt và báo lỗi không tìm thấy.

**Business Rules:**
- BR1: Tài khoản chỉ được coi là hợp lệ để đăng nhập sau khi đã hoàn tất bước kích hoạt.
- BR2: Chỉ mã kích hoạt khớp với tài khoản đã đăng ký mới có hiệu lực chuyển đổi trạng thái tài khoản.

---

### UC-03: Đăng nhập
- **Actor**: Candidate, Employer, Admin
- **Mô tả**: Người dùng xác thực danh tính bằng email và mật khẩu để truy cập hệ thống.

**Acceptance Criteria:**
- AC1: Nếu tài khoản chưa kích hoạt, hệ thống từ chối đăng nhập và yêu cầu kích hoạt trước.
- AC2: Nếu email hoặc mật khẩu không chính xác, hệ thống từ chối đăng nhập và trả về thông báo lỗi chung.
- AC3: Khi thông tin hợp lệ và tài khoản đang hoạt động, hệ thống cấp mã phiên đăng nhập kèm thông tin cơ bản của người dùng.

**Business Rules:**
- BR1: Chỉ tài khoản đang ở trạng thái hoạt động mới được phép đăng nhập.
- BR2: Phiên đăng nhập có thời hạn tối đa 30 phút; hết thời hạn người dùng phải đăng nhập lại.
- BR3: Quyền truy cập các chức năng của người dùng được xác định chặt chẽ theo vai trò gắn với tài khoản.

---

### UC-04: Xem thông tin cá nhân
- **Actor**: Candidate, Employer, Admin
- **Mô tả**: Người dùng đã đăng nhập xem thông tin hồ sơ tài khoản của chính mình.

**Acceptance Criteria:**
- AC1: Hệ thống trả về thông tin tài khoản hiện tại gồm họ tên, email, vai trò, trạng thái hoạt động và thông tin công ty liên kết (nếu là Nhà tuyển dụng).
- AC2: Thông tin nhạy cảm như mật khẩu không bao giờ được hiển thị trong kết quả trả về.

**Business Rules:**
- BR1: Người dùng chỉ được xem thông tin cá nhân của chính tài khoản đang đăng nhập.

---

## 2. Quản lý Công ty (Employer)

### UC-05: Tạo công ty
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng tạo hồ sơ công ty đại diện để chuẩn bị đăng tin tuyển dụng.

**Acceptance Criteria:**
- AC1: Hệ thống lưu thông tin công ty (tên công ty, website, mô tả, địa chỉ, logo) và gắn với Nhà tuyển dụng đang đăng nhập.
- AC2: Công ty mới tạo có trạng thái chưa xác thực (`active = false`).

**Business Rules:**
- BR1: Chỉ tài khoản có vai trò Nhà tuyển dụng mới được phép tạo công ty.
- BR2: Mỗi Nhà tuyển dụng chỉ được sở hữu duy nhất một công ty.
- BR3: Công ty mới tạo mặc định ở trạng thái chưa hoạt động/chưa xác thực cho đến khi được Quản trị viên phê duyệt.

---

### UC-06: Cập nhật & Xóa công ty
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng chỉnh sửa thông tin hoặc xóa hồ sơ công ty của mình.

**Acceptance Criteria:**
- AC1: Nhà tuyển dụng cập nhật thông tin công ty thành công và thấy dữ liệu mới ngay sau khi lưu.
- AC2: Khi xóa công ty, công ty biến mất khỏi danh sách hiển thị công khai và danh sách tìm kiếm.

**Business Rules:**
- BR1: Nhà tuyển dụng chỉ được phép chỉnh sửa hoặc xóa công ty thuộc quyền sở hữu của chính mình; mọi hành vi tác động lên công ty của người khác đều bị từ chối.
- BR2: Việc xóa công ty áp dụng cơ chế xóa mềm (ẩn khỏi hệ thống nhưng vẫn lưu vết dữ liệu phục vụ đối soát và lịch sử).

---

### UC-07: Xem danh sách & Chi tiết công ty
- **Actor**: Khách, Candidate, Employer
- **Mô tả**: Người dùng xem danh sách các công ty và chi tiết từng công ty.

**Acceptance Criteria:**
- AC1: Người dùng không cần đăng nhập vẫn xem được danh sách công ty và trang chi tiết công ty.
- AC2: Chỉ các công ty chưa bị xóa mới xuất hiện trong kết quả.

**Business Rules:**
- BR1: Các công ty đã bị xóa không được phép hiển thị ra giao diện công khai.

---

## 3. Xác thực Công ty

### UC-08: Nộp hồ sơ xác thực công ty
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng gửi mã số thuế và giấy phép kinh doanh để yêu cầu Quản trị viên xác thực công ty.

**Acceptance Criteria:**
- AC1: Hệ thống lưu hồ sơ xác thực ở trạng thái chờ duyệt (`PENDING`) cùng mã số thuế và đường dẫn giấy phép kinh doanh.
- AC2: Nhà tuyển dụng xem được toàn bộ lịch sử các lần nộp hồ sơ xác thực của công ty mình.
- AC3: Nếu người nộp không phải chủ sở hữu công ty, hệ thống từ chối thao tác.

**Business Rules:**
- BR1: Chỉ Nhà tuyển dụng là chủ sở hữu hợp pháp của công ty mới có quyền gửi yêu cầu xác thực cho công ty đó.
- BR2: Mỗi lần nộp hồ sơ tạo một bản ghi mới ở trạng thái chờ duyệt, không ghi đè lịch sử các lần nộp trước.
- BR3: Lý do từ chối chỉ tồn tại khi hồ sơ bị Quản trị viên từ chối.

---

### UC-09: Admin duyệt xác thực công ty
- **Actor**: Admin
- **Mô tả**: Quản trị viên kiểm tra và chấp nhận hồ sơ xác thực công ty.

**Acceptance Criteria:**
- AC1: Trạng thái hồ sơ xác thực chuyển sang đã duyệt (`APPROVED`) và trạng thái công ty chuyển sang hoạt động (`active = true`).
- AC2: Hệ thống lưu thông báo chấp nhận và gửi thông báo realtime đến Nhà tuyển dụng sở hữu công ty.

**Business Rules:**
- BR1: Chỉ Quản trị viên mới có quyền phê duyệt hồ sơ xác thực công ty.
- BR2: Khi hồ sơ được chấp nhận, công ty bắt buộc chuyển sang trạng thái hoạt động ngay trong cùng một giao dịch.
- BR3: Thông báo chỉ được gửi tới Nhà tuyển dụng sau khi kết quả duyệt được ghi nhận thành công.

---

### UC-10: Admin từ chối xác thực công ty
- **Actor**: Admin
- **Mô tả**: Quản trị viên từ chối hồ sơ xác thực không hợp lệ và cung cấp lý do.

**Acceptance Criteria:**
- AC1: Trạng thái hồ sơ xác thực chuyển sang bị từ chối (`REJECTED`), lưu kèm lý do từ chối và trạng thái công ty bị đặt về chưa hoạt động (`active = false`).
- AC2: Hệ thống lưu thông báo từ chối (kèm lý do) và gửi thông báo realtime đến Nhà tuyển dụng.

**Business Rules:**
- BR1: Chỉ Quản trị viên mới có quyền từ chối hồ sơ xác thực công ty.
- BR2: Khi từ chối, công ty bị vô hiệu hóa trạng thái hoạt động cho tới khi có hồ sơ xác thực mới được chấp nhận.
- BR3: Quản trị viên phải cung cấp lý do từ chối để Nhà tuyển dụng biết và bổ sung; Nhà tuyển dụng được phép nộp lại hồ sơ mới sau khi bị từ chối.

---

## 4. Quản lý Job (Employer)

### UC-11: Tạo Job tuyển dụng
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng đăng tin tuyển dụng mới cho công ty của mình.

**Acceptance Criteria:**
- AC1: Hệ thống lưu tin tuyển dụng gồm tên vị trí, địa điểm, mức lương, cấp bậc, hình thức làm việc, mô tả, yêu cầu, ngày bắt đầu/kết thúc và danh sách kỹ năng yêu cầu.
- AC2: Cấp bậc chỉ chấp nhận các giá trị hợp lệ (`INTERN`, `FRESHER`, `JUNIOR`); hình thức làm việc chỉ chấp nhận (`FULL_TIME`, `PART_TIME`, `REMOTE`, `HYBRID`).

**Business Rules:**
- BR1: Chỉ Nhà tuyển dụng mới được phép đăng tin tuyển dụng.
- BR2: Tin tuyển dụng bắt buộc phải thuộc về một công ty hợp lệ do Nhà tuyển dụng sở hữu.

---

### UC-12: Cập nhật & Xóa Job
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng chỉnh sửa thông tin, bật/tắt trạng thái hoặc xóa tin tuyển dụng.

**Acceptance Criteria:**
- AC1: Nhà tuyển dụng cập nhật được thông tin chi tiết, kỹ năng và trạng thái hoạt động của tin tuyển dụng.
- AC2: Tin tuyển dụng sau khi xóa không còn xuất hiện trong danh sách công khai.

**Business Rules:**
- BR1: Nhà tuyển dụng chỉ được phép chỉnh sửa hoặc xóa tin tuyển dụng thuộc công ty của chính mình.

---

### UC-13: Xem danh sách & Chi tiết Job
- **Actor**: Khách, Candidate, Employer
- **Mô tả**: Người dùng xem danh sách tin tuyển dụng, lọc/tìm kiếm và xem chi tiết một vị trí.

**Acceptance Criteria:**
- AC1: Người dùng không cần đăng nhập vẫn xem được danh sách và chi tiết các tin tuyển dụng.
- AC2: Kết quả hiển thị đầy đủ thông tin vị trí, công ty và kỹ năng yêu cầu.

**Business Rules:**
- BR1: Chỉ những tin tuyển dụng đang hoạt động mới được hiển thị cho Ứng viên tìm kiếm và ứng tuyển.

---

## 5. Hồ sơ Ứng viên

### UC-14: Tạo & Cập nhật hồ sơ ứng viên
- **Actor**: Candidate
- **Mô tả**: Ứng viên tạo và cập nhật hồ sơ năng lực để Nhà tuyển dụng có thể tìm thấy.

**Acceptance Criteria:**
- AC1: Hệ thống lưu tiêu đề hồ sơ, số năm kinh nghiệm, trạng thái sẵn sàng tìm việc (`isOpenToWork`) và danh sách kỹ năng.
- AC2: Khi `isOpenToWork = true`, hồ sơ có thể xuất hiện trong kết quả tìm kiếm ứng viên của Nhà tuyển dụng.

**Business Rules:**
- BR1: Mỗi Ứng viên chỉ được sở hữu duy nhất một hồ sơ ứng viên.
- BR2: Ứng viên có toàn quyền bật/tắt trạng thái sẵn sàng tìm việc để kiểm soát việc hiển thị hồ sơ trước Nhà tuyển dụng.

---

### UC-15: Quản lý Project trong hồ sơ
- **Actor**: Candidate
- **Mô tả**: Ứng viên thêm, sửa, xóa các dự án đã tham gia vào hồ sơ cá nhân.

**Acceptance Criteria:**
- AC1: Mỗi dự án lưu được tên dự án, thời gian bắt đầu, kết thúc, mô tả và gắn với hồ sơ của Ứng viên.
- AC2: Các dự án hiển thị đầy đủ khi xem chi tiết hồ sơ ứng viên.

**Business Rules:**
- BR1: Dự án phải thuộc về hồ sơ ứng viên của chính người dùng đang thao tác.

---

### UC-16: Tìm kiếm hồ sơ ứng viên
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng tìm kiếm ứng viên phù hợp theo tiêu chí kỹ năng, kinh nghiệm hoặc từ khóa.

**Acceptance Criteria:**
- AC1: Hệ thống trả về danh sách hồ sơ ứng viên phù hợp điều kiện tìm kiếm.
- AC2: Thông tin liên hệ chi tiết của ứng viên bị ẩn nếu Nhà tuyển dụng chưa mở khóa hồ sơ đó.

**Business Rules:**
- BR1: Chỉ các hồ sơ đang bật trạng thái sẵn sàng tìm việc mới được đưa vào kết quả tìm kiếm.
- BR2: Thông tin liên hệ cá nhân của ứng viên được bảo vệ; Nhà tuyển dụng chỉ xem được sau khi đã mở khóa hồ sơ bằng điểm.

---

## 6. Tìm kiếm & Ứng tuyển Job

### UC-17: Ứng tuyển Job
- **Actor**: Candidate
- **Mô tả**: Ứng viên nộp CV ứng tuyển vào một vị trí tuyển dụng.

**Acceptance Criteria:**
- AC1: Hệ thống tạo hồ sơ ứng tuyển với liên kết CV, trạng thái mặc định chờ xử lý (`PENDING`), gắn với Ứng viên và tin tuyển dụng tương ứng.
- AC2: Email trên đơn ứng tuyển được lấy tự động từ tài khoản của Ứng viên đang đăng nhập.
- AC3: Hệ thống gửi email xác nhận ứng tuyển thành công cho Ứng viên.
- AC4: Hệ thống lưu thông báo và gửi thông báo realtime đến Nhà tuyển dụng sở hữu tin tuyển dụng đó.

**Business Rules:**
- BR1: Người dùng phải đăng nhập mới được phép nộp đơn ứng tuyển.
- BR2: Đơn ứng tuyển mới luôn bắt đầu ở trạng thái chờ xử lý (`PENDING`), không cho phép Ứng viên tự đặt trạng thái đã duyệt.
- BR3: Thông tin liên hệ của người nộp đơn phải khớp với danh tính tài khoản đang đăng nhập để tránh giả mạo.
- BR4: Việc thông báo tới Nhà tuyển dụng được thực hiện ngay khi đơn ứng tuyển được ghi nhận thành công.

---

## 7. Quản lý Resume (Employer)

### UC-18: Xem danh sách Resume theo Job
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng xem danh sách các hồ sơ đã ứng tuyển vào một tin tuyển dụng cụ thể.

**Acceptance Criteria:**
- AC1: Hệ thống trả về danh sách đơn ứng tuyển thuộc tin tuyển dụng đó, kèm tên ứng viên, email, link CV, trạng thái và thời gian nộp.
- AC2: Nếu tin tuyển dụng không tồn tại, hệ thống báo lỗi không tìm thấy.

**Business Rules:**
- BR1: Chỉ Nhà tuyển dụng mới được xem danh sách CV nộp vào tin tuyển dụng.

---

### UC-19: Cập nhật trạng thái Resume
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng xét duyệt và thay đổi trạng thái hồ sơ ứng tuyển của Ứng viên.

**Acceptance Criteria:**
- AC1: Hệ thống cập nhật trạng thái đơn ứng tuyển sang giá trị mới hợp lệ (`PENDING`, `REVIEWING`, `APPROVED`, `REJECTED`, `SUCCESS`).
- AC2: Nếu truyền trạng thái không hợp lệ, hệ thống từ chối cập nhật và báo lỗi.

**Business Rules:**
- BR1: Chỉ Nhà tuyển dụng mới có quyền thay đổi trạng thái xử lý hồ sơ ứng tuyển; Ứng viên không thể tự duyệt hồ sơ của mình.
- BR2: Trạng thái đơn ứng tuyển chỉ được chuyển sang các giá trị nằm trong danh mục trạng thái quy định của hệ thống.

---

## 8. Mở khóa Hồ sơ & Thanh toán

### UC-20: Mua gói điểm (Stripe Checkout)
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng chọn gói điểm và thực hiện thanh toán trực tuyến qua Stripe.

**Acceptance Criteria:**
- AC1: Hệ thống tạo phiên thanh toán Stripe dựa trên gói điểm đã chọn và trả về đường dẫn trang thanh toán cho Nhà tuyển dụng.
- AC2: Phiên thanh toán lưu kèm thông tin định danh người mua và gói điểm để đối soát sau khi thanh toán.

**Business Rules:**
- BR1: Điểm thưởng chưa được cộng ngay khi tạo phiên thanh toán; điểm chỉ được cộng sau khi cổng thanh toán xác nhận giao dịch thành công.
- BR2: Chỉ các gói điểm đang hoạt động mới được phép mua.

---

### UC-21: Xử lý xác nhận thanh toán (Webhook)
- **Actor**: Stripe (Hệ thống thanh toán bên ngoài)
- **Mô tả**: Hệ thống tiếp nhận kết quả thanh toán từ Stripe để ghi nhận giao dịch và cộng điểm cho Nhà tuyển dụng.

**Acceptance Criteria:**
- AC1: Nếu chữ ký xác thực từ Stripe không hợp lệ, hệ thống từ chối xử lý.
- AC2: Khi nhận sự kiện thanh toán hoàn tất thành công, hệ thống lưu giao dịch với trạng thái `SUCCESS` và cộng đúng số điểm của gói vào tài khoản Nhà tuyển dụng.

**Business Rules:**
- BR1: Chỉ các thông báo thanh toán có chữ ký hợp lệ từ đối tác thanh toán mới được chấp nhận.
- BR2: Mỗi mã phiên giao dịch chỉ được ghi nhận và cộng điểm một lần duy nhất, tránh cộng trùng lặp nếu hệ thống thanh toán gửi lại thông báo.

---

### UC-22: Mở khóa hồ sơ ứng viên
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng dùng điểm tích lũy để mở khóa xem thông tin liên hệ của Ứng viên.

**Acceptance Criteria:**
- AC1: Nếu số điểm hiện có đủ để mở khóa, hệ thống ghi nhận quyền đã mở khóa giữa Nhà tuyển dụng và hồ sơ đó, đồng thời trừ số điểm tương ứng khỏi tài khoản.
- AC2: Nếu số điểm không đủ, hệ thống từ chối mở khóa và thông báo cần nạp thêm điểm.
- AC3: Nếu hồ sơ đã được mở khóa trước đó, hệ thống không trừ điểm thêm lần nữa.

**Business Rules:**
- BR1: Nhà tuyển dụng bắt buộc phải có đủ số điểm tối thiểu mới được phép mở khóa hồ sơ.
- BR2: Mỗi cặp Nhà tuyển dụng – Hồ sơ ứng viên chỉ cần mở khóa một lần; sau khi đã mở khóa, Nhà tuyển dụng có quyền xem lại thông tin hồ sơ đó mà không bị tính phí lại.
- BR3: Điểm đã sử dụng để mở khóa hồ sơ không được hoàn lại.

---

## 9. Thông báo Realtime & Quản lý Thông báo

### UC-23: Kết nối kênh thông báo Realtime
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng thiết lập kết nối WebSocket STOMP để sẵn sàng nhận thông báo tức thì.

**Acceptance Criteria:**
- AC1: Kết nối chỉ được thiết lập thành công khi client cung cấp mã xác thực hợp lệ lúc bắt đầu phiên.
- AC2: Kết nối thiếu hoặc sai thông tin xác thực bị từ chối ngay; phiên chưa xác thực không được phép đăng ký nhận hoặc gửi tin nhắn.

**Business Rules:**
- BR1: Mỗi người dùng chỉ được đăng ký và nhận thông báo trên kênh riêng gắn với danh tính của chính mình; không thể nghe trộm thông báo của người dùng khác.

---

### UC-24: Nhận thông báo Realtime
- **Actor**: Employer
- **Mô tả**: Nhà tuyển dụng nhận thông báo tức thì khi có ứng viên ứng tuyển hoặc khi công ty được duyệt/từ chối xác thực.

**Acceptance Criteria:**
- AC1: Khi ứng viên nộp CV vào tin tuyển dụng, Nhà tuyển dụng sở hữu tin đó nhận thông báo loại `JOB_APPLICATION` kèm tên ứng viên và tên vị trí.
- AC2: Khi Quản trị viên duyệt hoặc từ chối xác thực công ty, Nhà tuyển dụng sở hữu công ty nhận thông báo loại `COMPANY_VERIFICATION_APPROVED` hoặc `COMPANY_VERIFICATION_REJECTED` (kèm lý do nếu bị từ chối).
- AC3: Thông báo luôn được lưu lại trong hệ thống dù Nhà tuyển dụng đang online hay offline tại thời điểm phát sinh sự kiện.
- AC4: Nếu gửi thông báo realtime thất bại do người nhận đang offline, nghiệp vụ chính (nộp CV, duyệt công ty) vẫn thành công bình thường.

**Business Rules:**
- BR1: Thông báo mang tính cá nhân hóa: chỉ gửi đích danh đến Nhà tuyển dụng liên quan trực tiếp đến tin tuyển dụng hoặc công ty đó, không phát tán cho người dùng khác.
- BR2: Chỉ phát hành thông báo khi giao dịch nghiệp vụ gốc đã hoàn tất thành công; nếu nghiệp vụ bị hủy/lỗi thì không tạo thông báo sai lệch.

---

### UC-25: Xem & Quản lý thông báo
- **Actor**: Employer (và người dùng có thông báo)
- **Mô tả**: Người dùng xem danh sách thông báo đã lưu, xem số thông báo chưa đọc và đánh dấu đã đọc.

**Acceptance Criteria:**
- AC1: Danh sách thông báo hiển thị theo thứ tự mới nhất trước, kèm trạng thái đã đọc/chưa đọc.
- AC2: Hệ thống cung cấp chính xác tổng số lượng thông báo chưa đọc hiện tại.
- AC3: Khi đánh dấu đã đọc một thông báo hoặc tất cả thông báo, trạng thái chuyển sang đã đọc và số lượng chưa đọc giảm tương ứng.

**Business Rules:**
- BR1: Người dùng chỉ được phép xem và đánh dấu đã đọc các thông báo thuộc về chính tài khoản của mình; mọi thao tác lên thông báo của người khác đều bị từ chối.
- BR2: Đánh dấu đã đọc lại một thông báo đã ở trạng thái đã đọc không gây lỗi và không làm thay đổi dữ liệu.

---

## 10. Blog & Danh mục Blog

### UC-26: Quản lý danh mục Blog
- **Actor**: Admin
- **Mô tả**: Quản trị viên tạo, sửa, xóa các danh mục phân loại bài viết; người dùng xem danh mục.

**Acceptance Criteria:**
- AC1: Quản trị viên tạo, cập nhật và xóa được danh mục bài viết.
- AC2: Người dùng xem được danh sách danh mục công khai.

**Business Rules:**
- BR1: Chỉ Quản trị viên mới có quyền tạo, chỉnh sửa hoặc xóa danh mục bài viết.

---

### UC-27: Quản lý Blog
- **Actor**: Admin (quản lý), Khách/Người dùng (xem)
- **Mô tả**: Quản trị viên tạo, chỉnh sửa, xuất bản/ẩn và xóa bài viết; người dùng đọc các bài viết đã xuất bản.

**Acceptance Criteria:**
- AC1: Quản trị viên tạo, sửa, xóa và thay đổi trạng thái xuất bản của bài viết.
- AC2: Trang công khai chỉ hiển thị các bài viết đang ở trạng thái đã xuất bản.

**Business Rules:**
- BR1: Chỉ Quản trị viên mới có quyền soạn thảo, chỉnh sửa, xuất bản hoặc xóa bài viết.
- BR2: Bài viết chưa xuất bản (bản nháp/bị ẩn) không được phép hiển thị với người dùng thông thường.
- BR3: Mỗi bài viết phải thuộc một danh mục bài viết xác định.

---

## 11. Quản trị (Admin)

### UC-28: Tìm kiếm & Quản lý người dùng
- **Actor**: Admin
- **Mô tả**: Quản trị viên tìm kiếm tài khoản người dùng theo tên hoặc email để hỗ trợ quản lý.

**Acceptance Criteria:**
- AC1: Khi nhập từ khóa, hệ thống trả về danh sách tài khoản có họ tên hoặc email chứa từ khóa (không phân biệt hoa thường).
- AC2: Kết quả không bao gồm thông tin mật khẩu của người dùng.

**Business Rules:**
- BR1: Chỉ Quản trị viên mới có quyền tra cứu danh sách người dùng toàn hệ thống.

---

### UC-29: Quản lý gói thanh toán
- **Actor**: Admin
- **Mô tả**: Quản trị viên thiết lập và quản lý các gói điểm trả phí cho Nhà tuyển dụng.

**Acceptance Criteria:**
- AC1: Quản trị viên tạo, chỉnh sửa tên gói, số điểm quy đổi, giá tiền và trạng thái hoạt động của gói.
- AC2: Chỉ các gói đang bật trạng thái hoạt động mới hiển thị để Nhà tuyển dụng mua.

**Business Rules:**
- BR1: Chỉ Quản trị viên mới có quyền tạo, thay đổi giá hoặc ngừng cung cấp gói thanh toán.
- BR2: Gói thanh toán đã phát sinh giao dịch phải được lưu giữ thông tin đối soát (ngừng bán bằng cách chuyển sang trạng thái ngừng hoạt động thay vì làm mất lịch sử giao dịch).

---


## 12. Yêu cầu phi chức năng (Non-Functional Requirements)


### NFR-01: Hiệu năng & Thời gian phản hồi (Performance)
- **Thời gian phản hồi API REST**: Các tác vụ truy vấn danh sách việc làm, công ty, hồ sơ ứng viên và thông báo phải đạt thời gian phản hồi **P95 ≤ 500 ms** và trung bình **≤ 200 ms** dưới tải thông thường; các tác vụ có tích hợp dịch vụ ngoài (gửi email SMTP, tạo phiên Stripe, upload Cloudinary) hoàn tất trong **≤ 3 giây**.
- **Độ trễ thông báo Realtime (WebSocket)**: Từ thời điểm ứng viên nộp CV hoặc quản trị viên duyệt/từ chối xác thực công ty đến khi Nhà tuyển dụng đang online nhận được thông báo qua WebSocket phải đạt **≤ 1 giây** trong điều kiện mạng ổn định.

### NFR-02: Số người dùng đồng thời (Concurrency)
- **Khả năng phục vụ đồng thời**: Hệ thống đáp ứng ổn định tối thiểu **50–100 người dùng truy cập cùng lúc** (xem việc làm, nộp CV) và duy trì **≥ 30 kết nối WebSocket song song** mà không bị nghẽn hoặc lỗi kết nối.
- **Không xung đột dữ liệu**: Các thao tác cộng điểm khi nạp tiền và trừ điểm khi mở khóa hồ sơ đảm bảo chính xác **100%** (không bị cộng trùng hoặc trừ nhầm 2 lần).

### NFR-03: Bảo mật & An toàn thông tin (Security)
- **Mã hóa mật khẩu**: 100% mật khẩu người dùng phải được băm bằng thuật toán **BCrypt** trước khi lưu trữ, không lưu hoặc trả về dạng văn bản thuần ở bất kỳ API nào.
- **Xác thực phiên & Thời hạn Token**: Sử dụng **JWT ký bằng thuật toán HS512** với thời hạn hiệu lực tối đa **30 phút** cho mỗi access token; mọi kết nối WebSocket (`CONNECT`/`SUBSCRIBE`) bắt buộc xác thực JWT hợp lệ.
- **Phân quyền & Bảo vệ giao dịch**: Áp dụng kiểm soát truy cập theo vai trò (**RBAC**: `ROLE_CANDIDATE`, `ROLE_EMPLOYER`, `ROLE_ADMIN`), kiểm soát CORS chặt chẽ theo origin cho phép (`http://localhost:3000`), và xác thực **100% webhook thanh toán Stripe** bằng chữ ký `Stripe-Signature`.

### NFR-04: Toàn vẹn dữ liệu (Data Integrity)
- **Bảo toàn thông báo & Chống mất dữ liệu**: **100% thông báo** phải được lưu bền vững vào cơ sở dữ liệu trước khi đẩy WebSocket; thông báo realtime chỉ được phát hành sau khi transaction DB commit thành công, đảm bảo không phát thông báo sai khi giao dịch lỗi và người dùng offline vẫn đọc lại được 100% lịch sử.
- **Xóa mềm dữ liệu quan trọng**: Dữ liệu công ty áp dụng cơ chế xóa mềm (`isDeleted`) để bảo toàn tính toàn vẹn tham chiếu với tin tuyển dụng và lịch sử xác thực.

### NFR-05: Khả năng bảo trì (Maintainability)
- **Kiến trúc chuẩn hóa**: Tách biệt rõ các tầng xử lý (notification, xác thực WebSocket, duyệt công ty,...) và chuẩn hóa DTO đầu ra để dễ dàng mở rộng hoặc tách module về sau.

---

## 13. Kiến trúc hệ thống & Lý do lựa chọn công nghệ

### 13.1. Kiến trúc tổng thể: Layered Monolith 
- **Lựa chọn**: Kiến trúc nguyên khối phân tầng (**Controller => Service => Repository => Entity**) chạy trên **Java 21** và **Spring Boot 4.0.6**.
- **Lý do lựa chọn**:
  - Quy mô dự án ở mức vừa (quản lý việc làm, hồ sơ, xác thực công ty, thanh toán điểm, blog, thông báo) với các thực thể liên kết chặt chẽ (`User`, `Company`, `Job`, `Resume`, `Notification`). Mô hình Monolith giúp triển khai đơn giản, debug nhanh, dễ đảm bảo tính toàn vẹn transaction ACID giữa các nghiệp vụ (ví dụ: duyệt công ty đồng thời cập nhật `Company` + `CompanyVerification` + tạo `Notification`).
- **Các phương án đã cân nhắc**:
  - *Microservices*: Tách riêng Auth Service, Job Service, Payment Service, Notification Service. Loại vì tăng độ phức tạp vận hành (API Gateway, Service Discovery, distributed transaction/Saga), tốn tài nguyên triển khai và không cần thiết khi đội ngũ phát triển nhỏ.
### 13.2. Cơ chế xác thực & phân quyền: Stateless JWT + Spring OAuth2 Resource Server
- **Lựa chọn**: Xác thực phi trạng thái bằng **JWT (HS512, thời hạn 30 phút)** kết hợp **BCrypt** cho mật khẩu và **Spring Security OAuth2 Resource Server**.
- **Lý do lựa chọn**:
  - Phù hợp với kiến trúc tách biệt Frontend và Backend REST API, không phụ thuộc session trên bộ nhớ server nên dễ mở rộng theo chiều ngang.
  - Dùng chung bộ giải mã JWT (`JwtDecoderConfiguration`) cho cả REST API và bước bắt tay STOMP `CONNECT` của WebSocket, đảm bảo đồng nhất cơ chế bảo mật.
- **Các phương án đã cân nhắc**:
  - *Stateful Session / Cookie (JSESSIONID)*: Dễ thu hồi phiên nhưng khó chia sẻ trạng thái khi mở rộng nhiều instance backend và dễ vướng cấu hình CSRF/SameSite giữa các domain/port khác nhau.
  - *Keycloak / OAuth2 Server độc lập*: Mạnh cho hệ thống doanh nghiệp lớn (SSO đa ứng dụng) nhưng dư thừa và nặng nề cho quy mô cổng việc làm đơn lẻ.

### 13.3. Cơ chế thông báo Realtime: WebSocket + STOMP + SockJS + Lưu trữ DB
- **Lựa chọn**: Kết hợp **WebSocket giao thức STOMP** sử dụng **Simple In-Memory Broker** (`/topic`, `/queue`, `/user`), kết hợp lưu vào database.
- **Lý do lựa chọn**:
  - **STOMP** cung cấp sẵn mô hình publish/subscribe và định tuyến theo từng người dùng (`/user/queue/notifications`) dựa trên `Principal`, tránh phải tự quản lý danh sách `WebSocketSession` thủ công như Raw WebSocket.
  - **SockJS** đảm bảo tương thích với trình duyệt hoặc môi trường mạng chặn WebSocket thuần.
  - Kết hợp lưu DB giúp giải quyết bài toán người dùng offline không bị mất thông báo và hỗ trợ đánh dấu đã đọc qua REST API.
- **Các phương án đã cân nhắc**:
  - *HTTP Short Polling (Frontend gọi API định kỳ mỗi 5–10 giây)*: Dễ cài đặt nhưng lãng phí tài nguyên server/DB khi không có thông báo mới và độ trễ cao.
  - *Server-Sent Events (SSE)*:Phù hợp khi chỉ cần server đẩy dữ liệu một chiều xuống trình duyệt (như thông báo), nnhưng `EventSource` mặc định của trình duyệt bị hạn chế khi gửi kèm header `Authorization` (JWT) và khó mở rộng cho tính năng chat hai chiều (giữa Ứng viên – Nhà tuyển dụng) sau này.

### 13.4. Cơ sở dữ liệu: MySQL
- **Lựa chọn**: Hệ quản trị cơ sở dữ liệu quan hệ **MySQL**
- **Lý do lựa chọn**:
  - Dữ liệu của hệ thống có tính quan hệ chặt chẽ (1–1 giữa `User`–`Company`, `User`–`CandidateProfile`; 1–N giữa `Company`–`Job`, `Job`–`Resume`; N–N giữa `Job`–`Skill`, `CandidateProfile`–`Skill`) và cần ràng buộc khóa ngoại, unique constraint (như `employer_id + profile_id` trong `tbl_profile_unlocks`, `stripeSessionId` trong `tbl_payment_transactions`).
- **Các phương án đã cân nhắc**:
  - *NoSQL (MongoDB)*: Linh hoạt schema cho CV/Profile nhưng yếu hơn trong xử lý transaction đa bảng (thanh toán, trừ điểm, mở khóa hồ sơ) và các truy vấn join phức tạp.

