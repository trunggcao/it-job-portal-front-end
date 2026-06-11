import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../service/apiService';

function EmployerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Quản lý trạng thái xác thực và hồ sơ doanh nghiệp
    const [isCompanyActive, setIsCompanyActive] = useState(false);
    const [hasCompany, setHasCompany] = useState(false);

    const [selectedJob, setSelectedJob] = useState(null);
    const [currentResumes, setCurrentResumes] = useState([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Sử dụng Promise.all để gọi song song 2 API độc lập
                const [jobsResponse, profileResponse] = await Promise.all([
                    apiService.getEmployerJobs(),
                    apiService.getMyProfile()
                ]);

                setJobs(jobsResponse.data || jobsResponse);
                const profileData = profileResponse.data || profileResponse;

                if (profileData) {
                    // Kiểm tra xem User này đã gắn với thực thể công ty nào chưa thông qua companyId
                    setHasCompany(!!profileData.companyId);
                    setIsCompanyActive(profileData.companyIsAtive === true);
                }

                setError(null);
            } catch (err) {
                console.error("Lỗi đồng bộ dữ liệu phòng tuyển dụng:", err);
                setError(err.response?.data?.message || "Không thể kết nối danh sách tuyển dụng.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // BỘ THỐNG KÊ TỰ ĐỘNG BẰNG DỮ LIỆU THỰC
    const totalJobs = jobs.length;
    const totalResumes = jobs.reduce((sum, job) => sum + (job.resumesCount || 0), 0);
    const pendingResumes = jobs.length > 0 ? jobs.reduce((sum, job) => sum + (job.pendingResumesCount || 0), 0) : 0;

    const handleViewResumes = async (job) => {
        setSelectedJob(job);
        setCurrentResumes([]);
        setLoadingResumes(true);

        try {
            const response = await apiService.getResumesByJobId(job.id);
            setCurrentResumes(response.data || response);
        } catch (err) {
            console.error(`Lỗi khi lấy danh sách CV của job #${job.id}:`, err);
        } finally {
            setLoadingResumes(false);
        }
    };

    if (loading) {
        return (
            <div className="container my-5 text-center py-5 text-secondary">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p>Đang đồng bộ dữ liệu phòng tuyển dụng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger border-0 shadow-sm" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">

            {/* BANNER THÔNG BÁO TRẠNG THÁI DOANH NGHIỆP */}
            {!isCompanyActive ? (
                // 1. GIAO DIỆN KHI CHƯA XÁC THỰC (Giữ nguyên logic cũ của bạn)
                <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center justify-content-between p-3 mb-4 rounded-3" role="alert">
                    <div className="d-flex align-items-center text-dark">
                        <i className="bi bi-shield-exclamation text-warning fs-3 me-3"></i>
                        <div>
                            <strong className="d-block mb-0.5">Tài khoản doanh nghiệp chưa được xác thực!</strong>
                            <span className="small text-secondary">
                                {!hasCompany
                                    ? "Bạn chưa tạo thông tin công ty. Vui lòng cập nhật hồ sơ để gửi yêu cầu kích hoạt."
                                    : "Hồ sơ công ty của bạn đang chờ quản trị viên hệ thống phê duyệt hoặc cần xác minh."}
                            </span>
                        </div>
                    </div>
                    {/* Đường dẫn điền thông tin hoặc nộp hồ sơ minh chứng */}
                    <Link to={!hasCompany ? "/employer/create-company" : "/employer/verify-company"}>
                        <button className="btn btn-warning btn-sm fw-bold px-3 shadow-sm text-dark">
                            <i className="bi bi-patch-check-fill me-1"></i> Xác thực ngay
                        </button>
                    </Link>
                </div>
            ) : (
                // 2. GIAO DIỆN KHI ĐÃ XÁC THỰC THÀNH CÔNG (Chuyển đổi nút thành Xem lịch sử)
                <div className="alert alert-success border-0 shadow-sm d-flex align-items-center justify-content-between p-3 mb-4 rounded-3" role="alert" style={{ backgroundColor: '#e8f5e9' }}>
                    <div className="d-flex align-items-center text-dark">
                        <i className="bi bi-patch-check-fill text-success fs-3 me-3"></i>
                        <div>
                            <strong className="d-block mb-0.5 text-success">Doanh nghiệp đã được xác thực bảo mật!</strong>
                            <span className="small text-muted">
                                Hệ thống đã xác minh tính pháp lý. Bạn hiện có toàn quyền đăng tin và tiếp nhận CV từ các ứng viên.
                            </span>
                        </div>
                    </div>
                    {/* Đường dẫn chuyển sang nút kiểm tra và theo dõi lại lịch sử đã gửi */}
                    <Link to="/employer/verify-company">
                        <button className="btn btn-outline-success btn-sm fw-bold px-3 shadow-sm">
                            <i className="bi bi-clock-history me-1"></i> Xem lịch sử xác thực
                        </button>
                    </Link>
                </div>
            )}

            {/* MAIN HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Trung tâm tuyển dụng</h2>
                    <p className="text-muted small mb-0">Dưới đây là hiệu suất tuyển dụng của doanh nghiệp bạn.</p>
                </div>

                {/* Kiểm soát nút Đăng tin mới dựa vào trạng thái Active */}
                {isCompanyActive ? (
                    <Link to="/employer/create-job" className="text-decoration-none">
                        <button className="btn btn-primary btn-sm fw-bold px-3 py-2 shadow-sm">
                            <i className="bi bi-plus-circle-fill me-2"></i>Đăng tin mới
                        </button>
                    </Link>
                ) : (
                    <button
                        className="btn btn-secondary btn-sm fw-bold px-3 py-2 shadow-sm opacity-65"
                        disabled
                        title="Bạn cần xác thực tài khoản doanh nghiệp để sử dụng tính năng này"
                    >
                        <i className="bi bi-lock-fill me-2"></i>Đăng tin (Bị khóa)
                    </button>
                )}
            </div>

            {/* CARDS THỐNG KÊ */}
            <div className="row g-3 mb-5">
                <div className="col-6 col-md-3">
                    <div className="card p-3 border-0 shadow-sm bg-white rounded-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1 fw-medium">Tin đang đăng</span>
                                <h3 className="fw-bold text-dark mb-0">{totalJobs}</h3>
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
                                <h3 className="fw-bold text-success mb-0">{totalResumes}</h3>
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
                                <h3 className="fw-bold text-warning mb-0">{pendingResumes}</h3>
                            </div>
                            <div className="bg-warning-subtle text-warning rounded-circle p-2 fs-4 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BẢNG HIỂN THỊ VIỆC LÀM ĐÃ ĐĂNG */}
            <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
                <div className="card-header bg-white border-bottom py-3">
                    <h5 className="fw-bold text-dark mb-0">Danh sách bài đăng tuyển dụng</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-dark small">
                        <thead className="table-light text-secondary fw-semibold">
                            <tr>
                                <th className="ps-4" style={{ width: '100px' }}>Mã Vị Trí</th>
                                <th>Chi tiết công việc</th>
                                <th>Khu vực</th>
                                <th>Hạn nộp</th>
                                <th>Mức lương</th>
                                <th className="text-center">Số CV nhận</th>
                                <th className="text-center" style={{ width: '180px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        {isCompanyActive
                                            ? "Công ty của bạn chưa có bài đăng tuyển dụng nào."
                                            : "Vui lòng hoàn tất xác thực công ty để thực hiện đăng bài tuyển dụng đầu tiên."}
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job) => (
                                    <tr key={job.id}>
                                        <td className="ps-4 text-muted fw-medium">#JOB-00{job.id}</td>
                                        <td>
                                            <div className="fw-bold text-dark mb-0">{job.name}</div>
                                            <span className="text-muted x-small text-uppercase fw-medium text-primary">{job.level}</span>
                                        </td>
                                        <td><i className="bi bi-geo-alt me-1 text-secondary"></i>{job.location}</td>
                                        <td className="text-muted">{job.endDate}</td>
                                        <td className="fw-bold text-secondary">
                                            {job.salary && job.salary > 0 ? `${job.salary.toLocaleString()} vnđ` : "Thỏa thuận"}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge rounded-pill px-2.5 py-1.5 ${job.resumesCount > 0 ? 'bg-primary-subtle text-primary' : 'bg-light text-muted'}`}>
                                                {job.resumesCount || 0} ứng viên
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
                                            <Link
                                                to={`/employer/update-job/${job.id}`}
                                                className="btn btn-link text-warning btn-xs p-1"
                                                title="Sửa bài đăng"
                                            >
                                                <i className="bi bi-pencil-square fs-6"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* === POPUP MODAL XEM CV THỰC TẾ === */}
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
                            {loadingResumes ? (
                                <div className="text-center py-5 text-secondary">
                                    <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                                    <p className="small mb-0">Đang tải danh sách hồ sơ ứng viên...</p>
                                </div>
                            ) : currentResumes.length === 0 ? (
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
                                                    <td className="fw-bold text-dark">{res.userFullName || res.userName}</td>
                                                    <td className="text-secondary">{res.userEmail || res.email}</td>
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
                                                            href={res.resumeUrl || res.url}
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
        </div>
    );
}

export default EmployerDashboard;