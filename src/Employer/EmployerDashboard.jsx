import React, { useState } from 'react';

function EmployerDashboard() {
    // 1. MẢNG DỮ LIỆU GIẢ LẬP DANH SÁCH BÀI ĐĂNG (MOCK DATA)
    const mockJobs = [
        {
            id: 1,
            name: "Lập trình viên Java (Spring Boot)",
            category: "Công nghệ phần mềm",
            location: "Hà Nội",
            endDate: "2026-07-15",
            salary: 15000000,
            views: 142,
            resumesCount: 3
        },
        {
            id: 2,
            name: "Front-end Developer (ReactJS)",
            category: "Phát triển Web",
            location: "TP. Hồ Chí Minh",
            endDate: "2026-07-20",
            salary: "Thỏa thuận",
            views: 98,
            resumesCount: 2
        },
        {
            id: 3,
            name: "Thực tập sinh Full-Stack (Java & React)",
            category: "Công nghệ phần mềm",
            location: "Đà Nẵng",
            endDate: "2026-06-30",
            salary: 5000000,
            views: 210,
            resumesCount: 0
        }
    ];

    // 2. MẢNG DỮ LIỆU GIẢ LẬP DANH SÁCH CV ỨNG TUYỂN THEO TỪNG JOB ID
    const mockResumesData = {
        1: [
            { id: 101, userName: "Trần Văn B", email: "vanb.dev@gmail.com", createdAt: "2026-06-01", status: "PENDING", url: "https://drive.google.com/file/d/demo1" },
            { id: 102, userName: "Nguyễn Văn A", email: "anguyen@gmail.com", createdAt: "2026-06-02", status: "APPROVED", url: "https://drive.google.com/file/d/demo2" },
            { id: 103, userName: "Lê Thị C", email: "cle99@gmail.com", createdAt: "2026-06-04", status: "PENDING", url: "https://drive.google.com/file/d/demo3" }
        ],
        2: [
            { id: 104, userName: "Phạm Minh Hoàng", email: "hoangpm@gmail.com", createdAt: "2026-06-03", status: "PENDING", url: "https://drive.google.com/file/d/demo4" },
            { id: 105, userName: "Đỗ Thùy Linh", email: "linhdt.design@gmail.com", createdAt: "2026-06-05", status: "APPROVED", url: "https://drive.google.com/file/d/demo5" }
        ],
        3: [] // Không có ứng viên
    };

    // 3. STATE QUẢN LÝ TƯƠNG TÁC GIAO DIỆN
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentResumes, setCurrentResumes] = useState([]);

    // Hàm xử lý khi Employer click "Xem CV" của một Job bất kỳ
    const handleViewResumes = (job) => {
        setSelectedJob(job);
        // Lấy danh sách CV ứng với ID của Job từ mock data, nếu không có thì trả về mảng rỗng
        setCurrentResumes(mockResumesData[job.id] || []);
    };

    return (
        <div className="container my-5">
            {/* MAIN HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Trung tâm tuyển dụng</h2>
                    <p className="text-muted small mb-0">
                        Chào mừng trở lại! Dưới đây là hiệu suất tuyển dụng của doanh nghiệp bạn.
                    </p>
                </div>
                <button className="btn btn-primary btn-sm fw-bold px-3 py-2 shadow-sm">
                    <i className="bi bi-plus-circle-fill me-2"></i>Đăng tin mới
                </button>
            </div>

            {/* THẺ CARD THỐNG KÊ TỔNG QUAN */}
            <div className="row g-3 mb-5">
                <div className="col-6 col-md-3">
                    <div className="card p-3 border-0 shadow-sm bg-white rounded-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1 fw-medium">Tin đang đăng</span>
                                <h3 className="fw-bold text-dark mb-0">{mockJobs.length}</h3>
                            </div>
                            <div className="bg-primary-subtle text-primary rounded-circle p-2 fs-4 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                <i className="bi bi-file-earmark-post"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card p-3 border-0 shadow-sm bg-white rounded-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1 fw-medium">Tổng hồ sơ nhận</span>
                                <h3 className="fw-bold text-success mb-0">5</h3>
                            </div>
                            <div className="bg-success-subtle text-success rounded-circle p-2 fs-4 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                <i className="bi bi-file-earmark-person"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card p-3 border-0 shadow-sm bg-white rounded-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1 fw-medium">Hồ sơ chờ duyệt</span>
                                <h3 className="fw-bold text-warning mb-0">4</h3>
                            </div>
                            <div className="bg-warning-subtle text-warning rounded-circle p-2 fs-4 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card p-3 border-0 shadow-sm bg-white rounded-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1 fw-medium">Tổng lượt xem tin</span>
                                <h3 className="fw-bold text-info mb-0">450</h3>
                            </div>
                            <div className="bg-info-subtle text-info rounded-circle p-2 fs-4 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                <i className="bi bi-eye"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BẢNG HIỂN THỊ DANH SÁCH VIỆC LÀM ĐÃ ĐĂNG */}
            <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
                <div className="card-header bg-white border-bottom py-3">
                    <h5 className="fw-bold text-dark mb-0">Danh sách bài đăng tuyển dụng</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-dark small">
                        <thead className="table-light text-secondary fw-semibold">
                            <tr>
                                <th className="ps-4" style={{ width: '90px' }}>Mã Vị Trí</th>
                                <th>Chi tiết công việc</th>
                                <th>Khu vực</th>
                                <th>Hạn nộp</th>
                                <th>Mức lương</th>
                                <th className="text-center">Số CV nhận</th>
                                <th className="text-center" style={{ width: '180px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockJobs.map((job) => (
                                <tr key={job.id}>
                                    <td className="ps-4 text-muted fw-medium">#JOB-00{job.id}</td>
                                    <td>
                                        <div className="fw-bold text-dark mb-0">{job.name}</div>
                                        <span className="text-muted x-small text-uppercase fw-medium text-primary">{job.category}</span>
                                    </td>
                                    <td><i className="bi bi-geo-alt me-1 text-secondary"></i>{job.location}</td>
                                    <td className="text-muted">{job.endDate}</td>
                                    <td className="fw-bold text-secondary">
                                        {typeof job.salary === 'number' ? `${job.salary.toLocaleString()} vnđ` : job.salary}
                                    </td>
                                    <td className="text-center">
                                        <span className={`badge rounded-pill px-2.5 py-1.5 ${job.resumesCount > 0 ? 'bg-primary-subtle text-primary' : 'bg-light text-muted'}`}>
                                            {job.resumesCount} ứng viên
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-outline-primary btn-xs fw-medium px-2.5 py-1 me-1"
                                            data-bs-toggle="modal"
                                            data-bs-target="#resumeModal"
                                            onClick={() => handleViewResumes(job)}
                                        >
                                            <i className="bi bi-people-fill me-1"></i> Xem CV
                                        </button>
                                        <button className="btn btn-link text-muted btn-xs p-1" title="Sửa bài đăng">
                                            <i className="bi bi-pencil-square fs-6"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal fade" id="resumeModal" tabIndex="-1" aria-labelledby="resumeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title fw-bold text-dark" id="resumeModalLabel">
                                Hồ sơ ứng tuyển: <span className="text-primary">{selectedJob?.name}</span>
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-4 text-dark" style={{ minHeight: '200px' }}>
                            {currentResumes.length === 0 ? (
                                <div className="text-center py-5 text-secondary">
                                    <i className="bi bi-folder-x fs-1 d-block text-muted mb-3"></i>
                                    Chưa có hồ sơ ứng viên nào nộp đơn ứng tuyển cho vị trí này.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-sm align-middle small mb-0">
                                        <thead className="table-light text-secondary fw-semibold">
                                            <tr>
                                                <th>Tên ứng viên</th>
                                                <th>Email liên lạc</th>
                                                <th>Ngày nộp đơn</th>
                                                <th>Trạng thái hồ sơ</th>
                                                <th className="text-end">Tệp đính kèm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentResumes.map((res) => (
                                                <tr key={res.id}>
                                                    <td className="fw-bold text-dark">{res.userName}</td>
                                                    <td className="text-secondary">{res.email}</td>
                                                    <td className="text-muted">{res.createdAt}</td>
                                                    <td>
                                                        <span className={`badge px-2 py-1 ${res.status === 'PENDING'
                                                            ? 'bg-warning-subtle text-warning'
                                                            : 'bg-success-subtle text-success'
                                                            }`}>
                                                            {res.status === 'PENDING' ? 'Chờ kiểm duyệt' : 'Đã tiếp nhận'}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <a
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-primary btn-xs font-weight-bold px-2 text-white text-decoration-none shadow-sm"
                                                        >
                                                            <i className="bi bi-file-earmark-pdf-fill me-1"></i> Xem CV Online
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer bg-light border-0">
                            <button type="button" className="btn btn-secondary btn-sm fw-medium px-3" data-bs-dismiss="modal">
                                Đóng lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* === KẾT THÚC POPUP MODAL === */}
        </div>
    );
}

export default EmployerDashboard;