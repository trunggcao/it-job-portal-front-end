# Sequence Diagrams (Các luồng quan trọng nhất) — IT Job Portal

Tài liệu tổng hợp các lược đồ tuần tự (Sequence Diagram) tách riêng cho từng chức năng quan trọng trong hệ thống **IT Job Portal**.

---

## 1. Đăng ký tài khoản (UC-01)

```mermaid
sequenceDiagram
    actor Guest as Khách
    participant Ctrl as UserController
    participant Svc as UserService
    participant DB as MySQL (tbl_users)
    participant Mail as EmailService (Gmail SMTP)

    Guest->>Ctrl: POST /register (fullName, email, password, role)
    Ctrl->>Svc: registerUser(userDTO)
    Svc->>DB: Lưu User (BCrypt password, isActive=false, activationToken)
    DB-->>Svc: savedUser
    Svc->>Mail: Gửi email chứa link kích hoạt (?token=...)
    Svc-->>Ctrl: UserDTO
    Ctrl-->>Guest: 201 Created
```

---

## 2. Kích hoạt tài khoản (UC-02)

```mermaid
sequenceDiagram
    actor User as Người dùng
    participant Ctrl as UserController
    participant Svc as UserService
    participant DB as MySQL (tbl_users)

    User->>Ctrl: GET /activate?token=...
    Ctrl->>Svc: activeUser(token)
    Svc->>DB: findByActivationToken(token)
    alt Token hợp lệ
        DB-->>Svc: User
        Svc->>DB: Cập nhật isActive=true
        Svc-->>Ctrl: true
        Ctrl-->>User: 200 "Profile activated success."
    else Token không tồn tại
        DB-->>Svc: Empty
        Svc-->>Ctrl: false
        Ctrl-->>User: 404 "Ativation token not found or already used."
    end
```

---

## 3. Đăng nhập (UC-03)

```mermaid
sequenceDiagram
    actor User as Candidate / Employer / Admin
    participant Ctrl as UserController
    participant Svc as UserService
    participant AuthMgr as AuthenticationManager
    participant JwtSvc as JwtService

    User->>Ctrl: POST /login (email, password)
    Ctrl->>Svc: isAccountActive(email)
    alt Tài khoản chưa kích hoạt
        Svc-->>Ctrl: false
        Ctrl-->>User: 403 "Account is not active..."
    else Tài khoản đã kích hoạt
        Svc-->>Ctrl: true
        Ctrl->>Svc: authenticateAndGenerateToke(authDTO)
        Svc->>AuthMgr: authenticate(email, password)
        alt Sai email hoặc mật khẩu
            AuthMgr-->>Svc: Exception
            Ctrl-->>User: 400 "Invalid email or password"
        else Xác thực thành công
            AuthMgr-->>Svc: OK
            Svc->>JwtSvc: generateAccessToken(authDTO)
            JwtSvc-->>Svc: JWT (HS512, 30 phút)
            Svc-->>Ctrl: Map(token, user)
            Ctrl-->>User: 200 { token, user }
        end
    end
```

---

## 4. Tạo công ty (UC-05)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as CompanyController
    participant Svc as CompanyService
    participant UserSvc as UserService
    participant DB as MySQL (tbl_companies)

    Employer->>Ctrl: POST /companies (companyName, website, address, logoUrl, ...)
    Ctrl->>Svc: createCompany(companyDTO)
    Svc->>UserSvc: getCurrentUser()
    UserSvc-->>Svc: currentEmployer
    Svc->>DB: Lưu Company (employer_id, active=false, isDeleted=false)
    DB-->>Svc: savedCompany
    Svc-->>Ctrl: CompanyDTO
    Ctrl-->>Employer: 201 Created
```

---

## 5. Employer nộp hồ sơ xác thực Công ty (UC-08)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as CompanyVerificationController
    participant Svc as CompanyVerificationService
    participant DB as MySQL

    Employer->>Ctrl: POST /verifications/employer (companyId, employerId, taxCode, businessLicenseUrl)
    Ctrl->>Svc: createVerification(dto)
    Svc->>DB: Tìm Company theo companyId
    DB-->>Svc: Company
    alt Đúng chủ sở hữu công ty
        Svc->>DB: Lưu CompanyVerification (status=PENDING)
        DB-->>Svc: savedVerification
        Svc-->>Ctrl: CompanyVerificationDTO
        Ctrl-->>Employer: 201 Created
    else Không có quyền
        Svc-->>Ctrl: RuntimeException
        Ctrl-->>Employer: 4xx/5xx Lỗi không có quyền
    end
```

---

## 6. Admin duyệt xác thực Công ty & Thông báo Realtime (UC-09, UC-24)

```mermaid
sequenceDiagram
    actor Admin as Quản trị viên
    actor Employer as Nhà tuyển dụng (Online)
    participant Ctrl as CompanyVerificationController
    participant Svc as CompanyVerificationService
    participant DB as MySQL
    participant NotifSvc as NotificationService
    participant WS as SimpMessagingTemplate

    Admin->>Ctrl: PUT /verifications/admin/approve-verification/{id}
    Ctrl->>Svc: approveVerification(id)
    Svc->>DB: Tìm Verification & Company
    Svc->>DB: Cập nhật Company.active=true
    Svc->>DB: Cập nhật Verification.status=APPROVED
    Svc->>NotifSvc: notifyEmployerOnVerificationResult(verification, true)
    NotifSvc->>DB: Lưu Notification (COMPANY_VERIFICATION_APPROVED)
    Note over NotifSvc,WS: afterCommit() sau khi DB commit thành công
    NotifSvc->>WS: convertAndSendToUser(employerEmail, /queue/notifications, dto)
    WS-->>Employer: Đẩy thông báo xác thực thành công
    Svc-->>Ctrl: CompanyVerificationDTO
    Ctrl-->>Admin: 200 OK
```

---

## 7. Admin từ chối xác thực Công ty & Thông báo Realtime (UC-10, UC-24)

```mermaid
sequenceDiagram
    actor Admin as Quản trị viên
    actor Employer as Nhà tuyển dụng (Online)
    participant Ctrl as CompanyVerificationController
    participant Svc as CompanyVerificationService
    participant DB as MySQL
    participant NotifSvc as NotificationService
    participant WS as SimpMessagingTemplate

    Admin->>Ctrl: PUT /verifications/admin/reject-verification/{id} (rejectReason)
    Ctrl->>Svc: rejectVerification(id, rejectReason)
    Svc->>DB: Tìm Verification & Company
    Svc->>DB: Cập nhật Company.active=false
    Svc->>DB: Cập nhật status=REJECTED & rejectReason
    Svc->>NotifSvc: notifyEmployerOnVerificationResult(verification, false)
    NotifSvc->>DB: Lưu Notification (COMPANY_VERIFICATION_REJECTED + lý do)
    Note over NotifSvc,WS: afterCommit() sau khi DB commit thành công
    NotifSvc->>WS: convertAndSendToUser(employerEmail, /queue/notifications, dto)
    WS-->>Employer: Đẩy thông báo bị từ chối kèm lý do
    Svc-->>Ctrl: CompanyVerificationDTO
    Ctrl-->>Admin: 200 OK
```

---

## 8. Tạo Job tuyển dụng (UC-11)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as JobController
    participant Svc as JobService
    participant UserSvc as UserService
    participant DB as MySQL (tbl_jobs, job_skill)

    Employer->>Ctrl: POST /jobs (name, location, salary, level, typeJob, skills, ...)
    Ctrl->>Svc: createJob(jobDTO)
    Svc->>UserSvc: getCurrentUser()
    UserSvc-->>Svc: currentEmployer (kèm Company)
    Svc->>DB: Tìm danh sách Skill theo skillIds
    Svc->>DB: Lưu Job gắn với Company & Skills
    DB-->>Svc: savedJob
    Svc-->>Ctrl: JobDTO
    Ctrl-->>Employer: 201 Created
```

---

## 9. Cập nhật Job tuyển dụng (UC-12)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as JobController
    participant Svc as JobService
    participant DB as MySQL (tbl_jobs, job_skill)

    Employer->>Ctrl: PUT /jobs/{id} (jobDTO)
    Ctrl->>Svc: updateJob(id, jobDTO)
    Svc->>DB: Tìm Job theo id
    alt Job tồn tại & thuộc công ty của Employer
        DB-->>Svc: Job
        Svc->>DB: Cập nhật thông tin Job, isActive & danh sách Skills
        DB-->>Svc: updatedJob
        Svc-->>Ctrl: JobDTO
        Ctrl-->>Employer: 200 OK
    else Không tìm thấy hoặc không có quyền
        Svc-->>Ctrl: RuntimeException
        Ctrl-->>Employer: 4xx/5xx Lỗi
    end
```

---

## 10. Ứng viên ứng tuyển Job & Thông báo Realtime (UC-17, UC-24)

```mermaid
sequenceDiagram
    actor Candidate as Ứng viên
    actor Employer as Nhà tuyển dụng (Online)
    participant Ctrl as CandidateResumeController
    participant ResumeSvc as ResumeService
    participant Mail as EmailService
    participant NotifSvc as NotificationService
    participant DB as MySQL
    participant WS as SimpMessagingTemplate

    Candidate->>Ctrl: POST /candidate/resumes/apply/jobs/{jobId} (url CV)
    Ctrl->>ResumeSvc: createResume(resumeDTO, jobId)
    ResumeSvc->>DB: Lưu Resume (status=PENDING)
    DB-->>ResumeSvc: savedResume
    ResumeSvc->>Mail: Gửi email xác nhận ứng tuyển cho Candidate
    ResumeSvc->>NotifSvc: notifyEmployerOnJobApplication(savedResume)
    NotifSvc->>DB: Lưu Notification (type=JOB_APPLICATION, isRead=false)
    DB-->>NotifSvc: savedNotification
    NotifSvc->>WS: convertAndSendToUser(employerEmail, /queue/notifications, dto)
    WS-->>Employer: Đẩy thông báo realtime (JOB_APPLICATION)
    ResumeSvc-->>Ctrl: ResumeDTO
    Ctrl-->>Candidate: 201 Created
```

---

## 11. Mua gói điểm qua Stripe Checkout (UC-20)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as CheckoutController
    participant StripeSvc as StripeService
    participant Stripe as Stripe Payment Gateway

    Employer->>Ctrl: POST /checkout/create-session (packageId)
    Ctrl->>StripeSvc: createCheckoutSession(packageId)
    StripeSvc->>Stripe: Tạo Checkout Session (metadata: userId, packageId)
    Stripe-->>StripeSvc: sessionId, sessionUrl
    StripeSvc-->>Ctrl: StripeResponse (sessionUrl)
    Ctrl-->>Employer: 200 { sessionUrl }
    Employer->>Stripe: Mở sessionUrl và thực hiện thanh toán
```

---

## 12. Xử lý Stripe Webhook cộng điểm (UC-21)

```mermaid
sequenceDiagram
    participant Stripe as Stripe Payment Gateway
    participant Ctrl as StripeWebhookController
    participant Svc as PaymentWebhookService
    participant DB as MySQL

    Stripe->>Ctrl: POST /webhooks/stripe (payload + Stripe-Signature)
    Ctrl->>Ctrl: Xác thực chữ ký Webhook.constructEvent(...)
    alt Chữ ký hợp lệ & event checkout.session.completed
        Ctrl->>Svc: fulfillOrderDirectly(sessionId, amount, currency, metadata)
        Svc->>DB: Lưu PaymentTransaction (status=SUCCESS)
        Svc->>DB: Cộng pointsAwarded vào User.points
        Ctrl-->>Stripe: 200 "Received"
    else Chữ ký không hợp lệ
        Ctrl-->>Stripe: 400 "Invalid signature"
    end
```

---

## 13. Mở khóa hồ sơ Ứng viên (UC-22)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as CandidateProfileController
    participant Svc as CandidateProfileService
    participant DB as MySQL

    Employer->>Ctrl: POST /candidate/profiles/unlock/{profileId}
    Ctrl->>Svc: unlockProfile(profileId)
    Svc->>DB: Kiểm tra điểm hiện tại của Employer & ProfileUnlock
    alt Đủ điểm & chưa từng mở khóa
        Svc->>DB: Lưu ProfileUnlock (employer_id, profile_id)
        Svc->>DB: Trừ điểm User.points
        Svc-->>Ctrl: Thông tin hồ sơ đã mở khóa
        Ctrl-->>Employer: 200 OK
    else Không đủ điểm
        Svc-->>Ctrl: Exception
        Ctrl-->>Employer: 400 Báo lỗi không đủ điểm
    end
```

---

## 14. Admin đăng bài Blog mới (UC-27)

```mermaid
sequenceDiagram
    actor Admin as Quản trị viên
    participant Ctrl as AdminBlogController
    participant Svc as BlogService
    participant DB as MySQL (tbl_Blogs, tbl_blog_categories)

    Admin->>Ctrl: POST /blogs/admin (title, content, image URL, categoryId, ...)
    Ctrl->>Svc: createBlog(request, request.getImage())
    Svc->>DB: Tìm BlogCategory theo categoryId
    DB-->>Svc: BlogCategory
    Svc->>DB: Lưu Blog (gắn category, mặc định published=false)
    DB-->>Svc: savedBlog
    Svc-->>Ctrl: Blog
    Ctrl-->>Admin: 201 Created
```

---

## 15. Admin Public / Unpublish bài Blog (UC-27)

```mermaid
sequenceDiagram
    actor Admin as Quản trị viên
    participant Ctrl as AdminBlogController
    participant Svc as BlogService
    participant DB as MySQL (tbl_Blogs)

    Admin->>Ctrl: POST /blogs/admin/{id}/publish?published=true
    Ctrl->>Svc: publishBlog(id, published)
    Svc->>DB: Tìm Blog theo id
    alt Blog tồn tại
        DB-->>Svc: Blog
        Svc->>DB: Cập nhật Blog.published = true/false
        DB-->>Svc: updatedBlog
        Svc-->>Ctrl: Blog
        Ctrl-->>Admin: 200 OK
    else Không tìm thấy Blog
        Svc-->>Ctrl: RuntimeException
        Ctrl-->>Admin: 4xx/5xx Lỗi không tìm thấy
    end
```

---

## 16. Xem danh sách Thông báo & Số lượng chưa đọc (UC-25)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as NotificationController
    participant Svc as NotificationService
    participant UserSvc as UserService
    participant DB as MySQL (tbl_notifications)

    Employer->>Ctrl: GET /notifications (Bearer JWT)
    Ctrl->>Svc: getMyNotifications()
    Svc->>UserSvc: getCurrentUser()
    UserSvc-->>Svc: currentUser
    Svc->>DB: findByRecipientIdOrderByCreatedAtDesc(userId)
    DB-->>Svc: Danh sách Notification
    Ctrl-->>Employer: 200 List NotificationDTO

    Employer->>Ctrl: GET /notifications/unread-count
    Ctrl->>Svc: getUnreadCount()
    Svc->>UserSvc: getCurrentUser()
    Svc->>DB: countByRecipientIdAndIsReadFalse(userId)
    DB-->>Svc: số lượng chưa đọc
    Ctrl-->>Employer: 200 { unreadCount }
```

---

## 17. Đánh dấu đã đọc 1 Thông báo (UC-25)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as NotificationController
    participant Svc as NotificationService
    participant UserSvc as UserService
    participant DB as MySQL (tbl_notifications)

    Employer->>Ctrl: PATCH /notifications/{id}/read (Bearer JWT)
    Ctrl->>Svc: markAsRead(id)
    Svc->>UserSvc: getCurrentUser()
    UserSvc-->>Svc: currentUser
    Svc->>DB: findByIdAndRecipientId(id, userId)
    alt Tìm thấy thông báo thuộc user hiện tại
        DB-->>Svc: Notification
        Svc->>DB: Cập nhật isRead=true (nếu đang false)
        Svc-->>Ctrl: NotificationDTO
        Ctrl-->>Employer: 200 OK { isRead: true }
    else Không tìm thấy
        Svc-->>Ctrl: RuntimeException
        Ctrl-->>Employer: 4xx/5xx Lỗi
    end
```

---

## 18. Đánh dấu tất cả Thông báo đã đọc (UC-25)

```mermaid
sequenceDiagram
    actor Employer as Nhà tuyển dụng
    participant Ctrl as NotificationController
    participant Svc as NotificationService
    participant UserSvc as UserService
    participant DB as MySQL (tbl_notifications)

    Employer->>Ctrl: PATCH /notifications/read-all (Bearer JWT)
    Ctrl->>Svc: markAllAsRead()
    Svc->>UserSvc: getCurrentUser()
    UserSvc-->>Svc: currentUser
    Svc->>DB: markAllAsReadByRecipientId(userId)
    DB-->>Svc: updatedCount
    Svc-->>Ctrl: updatedCount
    Ctrl-->>Employer: 200 { updatedCount }
```
