# Context Diagram — IT Job Portal

Sơ đồ ngữ cảnh (System Context Diagram) mô tả ranh giới hệ thống **IT Job Portal** cùng các tác nhân người dùng (Actors) và các hệ thống bên ngoài (External Systems) tương tác với hệ thống.

```mermaid
flowchart LR
    Candidate[Ứng viên<br/>Candidate]
    Employer[Nhà tuyển dụng<br/>Employer]
    Admin[Quản trị viên<br/>Admin]
    Stripe[Cổng thanh toán<br/>Stripe]
    ExternalSvc[Dịch vụ Email /<br/>Lưu trữ tệp]

    System((Hệ thống Tuyển dụng<br/>IT Job Portal))

    Candidate -->|Thông tin tài khoản, hồ sơ, CV, đơn ứng tuyển| System
    System -->|Danh sách việc làm, trạng thái ứng tuyển, thông báo| Candidate

    Employer -->|Tin tuyển dụng, hồ sơ xác thực công ty, yêu cầu mua gói| System
    System -->|Danh sách CV ứng viên, kết quả xác thực, thông báo real-time| Employer

    Admin -->|Quyết định duyệt/từ chối công ty, quản trị hệ thống| System
    System -->|Danh sách chờ duyệt, dữ liệu quản trị & thống kê| Admin

    System -->|Yêu cầu phiên thanh toán| Stripe
    Stripe -->|Sự kiện thanh toán / Webhook| System

    System -->|Yêu cầu gửi mail / tải lên tệp| ExternalSvc
    ExternalSvc -->|Trạng thái gửi / đường dẫn tệp| System
```
