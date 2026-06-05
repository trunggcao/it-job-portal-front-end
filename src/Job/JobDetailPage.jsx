import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import "./job.css"

function JobDetailPage() {
    // 1. LẤY ID ĐỘNG TỪ THANH URL XUỐNG
    const { id } = useParams();
    const navigate = useNavigate();

    // 2. KHAI BÁO CÁC STATE QUẢN LÝ DỮ LIỆU
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cvUrl, setCvUrl] = useState('');
    const [applyLoading, setApplyLoading] = useState(false);
    const [applyError, setApplyError] = useState(null);
    const [applySuccess, setApplySuccess] = useState(false);

    // 3. GỌI API LẤY CHI TIẾT CÔNG VIỆC THEO ID
    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                setLoading(true);
                const response = await apiService.getJobById(id);

                // Giả định backend trả về object job nằm trong response.data
                setJob(response.data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết công việc:", err);
                setError("Không thể tải thông tin công việc hoặc công việc không tồn tại.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetail();
        }
    }, [id]);

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        setApplyError(null);
        setApplySuccess(false);

        // Kiểm tra trạng thái đăng nhập dựa vào Token dưới LocalStorage
        const token = localStorage.getItem('token');
        if (!token) {
            setApplyError("Bạn cần đăng nhập với tư cách Ứng viên để thực hiện chức năng này.");
            setTimeout(() => {
                // Đóng modal thủ công bằng cách loại bỏ backdrop trước khi chuyển trang
                const modalElement = document.getElementById('applyModal');
                const modalBackdrop = document.querySelector('.modal-backdrop');
                if (modalElement) modalElement.classList.remove('show');
                if (modalBackdrop) modalBackdrop.remove();
                navigate('/login');
            }, 1800);
            return;
        }

        try {
            setApplyLoading(true);

            // Đóng gói ResumeDTO gửi lên Endpoint của CandidateResumeController
            const resumeDTO = {
                url: cvUrl
            };

            // Gọi hàm applyJob từ apiService (truyền ID công việc hiện tại và DTO)
            await apiService.applyJob(id, resumeDTO);

            setApplySuccess(true);
            setCvUrl(''); // Làm sạch ô nhập link CV sau khi thành công

        } catch (err) {
            console.error("Lỗi ứng tuyển:", err);
            if (err.response && err.response.data) {
                setApplyError(err.response.data.message || "Ứng tuyển thất bại. Vui lòng thử lại.");
            } else {
                setApplyError("Có lỗi xảy ra trong quá trình nộp hồ sơ.");
            }
        } finally {
            setApplyLoading(false);
        }
    };

    // 4. HIỂN THỊ TRẠNG THÁI LOADING VÀ BÁO LỖI VĂN BẢN
    if (loading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 small">Đang tải chi tiết công việc...</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger d-inline-block shadow-sm px-5" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error || "Đã xảy ra lỗi"}
                </div>
                <div className="mt-3">
                    <Link to="/jobs" className="btn btn-primary btn-sm rounded-pill px-4">Quay lại danh sách</Link>
                </div>
            </div>
        );
    }

    // 5. ĐỔ DATA ĐỘNG VÀO GIAO DIỆN (ĐÃ FIX TOÀN BỘ CLASS THÀNH CLASSNAME)
    return (
        <div>
            {/* JOB HEADER SECTION */}
            <div className="job-header py-5 mb-4 shadow-sm bg-light">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-auto">
                            <div className="bg-primary-subtle rounded text-primary company-logo border border-primary-subtle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '65px', height: '65px' }}>
                                {job.companyName ? job.companyName.substring(0, 2).toUpperCase() : 'IT'}
                            </div>
                        </div>
                        <div className="col">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-2 small">
                                    <li className="breadcrumb-item"><Link to="/jobs" className="text-decoration-none">Việc làm</Link></li>
                                    <li className="breadcrumb-item text-secondary">{job.category || "Công nghệ phần mềm"}</li>
                                    <li className="breadcrumb-item active" aria-current="page">{job.title}</li>
                                </ol>
                            </nav>
                            <h1 className="h2 fw-bold text-dark mb-2">{job.name}</h1>
                            <div className="d-flex flex-wrap gap-4 text-secondary small fw-medium">
                                <span><i className="bi bi-building me-1 text-primary"></i> {job.companyName || "Công ty công nghệ"}</span>
                                <span><i className="bi bi-geo-alt me-1 text-primary"></i> {job.location}</span>
                                <span><i className="bi bi-calendar-event me-1 text-primary"></i> Đăng {job.createdAt || "gần đây"}</span>
                            </div>
                        </div>
                        <div className="col-lg-auto text-lg-end d-flex gap-2 w-100-mobile">
                            <button className="btn btn-outline-secondary px-3 py-2 fw-medium"><i className="bi bi-heart"></i> Lưu việc làm</button>
                            <button className="btn btn-primary px-4 py-2 fw-medium" data-bs-toggle="modal" data-bs-target="#applyModal">
                                <i className="bi bi-cursor-fill me-1"></i> Ứng tuyển ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT SECTION */}
            <div className="container pb-5">
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card p-4 border-0 shadow-sm mb-4 bg-white">
                            <h4 className="fw-bold text-dark mb-4 border-start border-primary border-4 ps-2">Chi tiết tin tuyển dụng</h4>

                            <div className="mb-4">
                                <h5 className="fw-bold text-dark fs-6"><i className="bi bi-journal-text me-2 text-primary"></i>Mô tả công việc</h5>
                                <div className="text-secondary lh-lg ps-1 mt-2 small" style={{ whitespace: 'pre-line' }}>
                                    {job.description || "Chưa có thông tin mô tả chi tiết."}
                                </div>
                            </div>

                            {/* Yêu cầu ứng viên */}
                            <div className="mb-4">
                                <h5 className="fw-bold text-dark fs-6"><i className="bi bi-file-earmark-person me-2 text-primary"></i>Yêu cầu ứng viên</h5>
                                <div className="text-secondary lh-lg ps-1 mt-2 small" style={{ whitespace: 'pre-line' }}>
                                    {job.requirements || "Chưa có thông tin yêu cầu cụ thể."}
                                </div>
                            </div>

                            {/* Quyền lợi */}
                            <div className="mb-2">
                                <h5 className="fw-bold text-dark fs-6"><i className="bi bi-gift me-2 text-primary"></i>Quyền lợi được hưởng</h5>
                                <div className="text-secondary lh-lg ps-1 mt-2 small" style={{ whitespace: 'pre-line' }}>
                                    {job.benefits || "Hưởng các chế độ đãi ngộ theo quy định công ty."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: TỔNG QUAN VÀ THÔNG TIN CÔNG TY */}
                    <div className="col-lg-4">
                        <div className="sticky-sidebar">

                            {/* Thông tin chung sơ lược */}
                            <div className="card p-4 border-0 shadow-sm mb-4 bg-white">
                                <h5 className="fw-bold text-dark mb-3 fs-6">Thông tin chung</h5>
                                <div className="d-flex align-items-start mb-3">
                                    <div className="fs-4 text-primary me-3"><i className="bi bi-cash-stack"></i></div>
                                    <div>
                                        <span className="text-muted small d-block">Mức lương</span>
                                        <span className="fw-bold text-danger">
                                            {typeof job.salary === 'number' ? `${job.salary.toLocaleString()} vnđ` : job.salary || "Thỏa thuận"}
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start mb-3">
                                    <div className="fs-4 text-primary me-3"><i className="bi bi-briefcase"></i></div>
                                    <div>
                                        <span className="text-muted small d-block">Cấp Bậc</span>
                                        <span className="fw-medium text-dark">{job.level || "Tất Cả"}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start mb-3">
                                    <div className="fs-4 text-primary me-3"><i className="bi bi-people"></i></div>
                                    <div>
                                        <span className="text-muted small d-block">Địa điểm</span>
                                        <span className="fw-medium text-dark">{job.location || "Chưa cập nhật địa điểm"}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start mb-0">
                                    <div className="fs-4 text-primary me-3"><i className="bi bi-hourglass-split"></i></div>
                                    <div>
                                        <span className="text-muted small d-block">Hạn nộp hồ sơ</span>
                                        <span className="fw-medium text-dark">{`Từ ${job.startDate} đến ${job.endDate}` || "Xem chi tiết"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin công ty */}
                            <div className="card p-4 border-0 shadow-sm bg-white">
                                <h5 className="fw-bold text-dark mb-3 fs-6">Thông tin công ty</h5>
                                <h6 className="fw-bold text-primary mb-1"><i className="bi bi-patch-check-fill me-1"></i> {job.companyName || "Công ty công nghệ"}</h6>
                                <p className="text-muted small mb-3">{job.companyDescription || "Đơn vị tuyển dụng công nghệ uy tín"}</p>

                                <div className="small text-secondary mb-2">
                                    <i className="bi bi-geo-alt-fill me-2 text-muted"></i>{job.companyAddress || job.location}
                                </div>
                                <div className="small text-secondary mb-3">
                                    <i className="bi bi-globe me-2 text-muted"></i>{job.companyWebsite || "https://example.com"}
                                </div>
                                <hr className="my-3" />
                                <a href="#" className="btn btn-outline-primary btn-sm w-100 fw-medium">
                                    Xem trang công ty <i className="bi bi-box-arrow-up-right ms-1"></i>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="applyModal" tabIndex="-1" aria-labelledby="applyModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title fw-bold text-dark" id="applyModalLabel">
                                Ứng tuyển vị trí: <span className="text-primary">{job.name}</span>
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form onSubmit={handleApplySubmit}>
                            <div className="modal-body p-4">
                                {/* HIỂN THỊ CÁC THÔNG BÁO LỖI HOẶC THÀNH CÔNG */}
                                {applyError && (
                                    <div className="alert alert-danger small py-2 animate__animated animate__fadeIn" role="alert">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>{applyError}
                                    </div>
                                )}
                                {applySuccess && (
                                    <div className="alert alert-success small py-2 animate__animated animate__fadeIn" role="alert">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Nộp CV thành công! Hãy kiểm tra hòm thư Email để cập nhật thông tin.
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label small fw-medium text-secondary">Đường dẫn tệp hồ sơ CV (Google Drive / Dropbox)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white text-secondary"><i className="bi bi-link-45deg"></i></span>
                                        <input
                                            type="url"
                                            className="form-control text-dark"
                                            placeholder="https://drive.google.com/file/d/..."
                                            required
                                            disabled={applySuccess || applyLoading}
                                            value={cvUrl}
                                            onChange={(e) => setCvUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-text small text-muted mt-2">
                                        Lưu ý: Bạn cần cấp quyền chia sẻ ở trạng thái công khai để Nhà tuyển dụng có thể mở và đọc được nội dung CV của bạn.
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer bg-light border-top-0 d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm fw-medium px-3"
                                    data-bs-dismiss="modal"
                                    disabled={applyLoading}
                                >
                                    Đóng lại
                                </button>
                                {!applySuccess && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm fw-bold px-4"
                                        disabled={applyLoading}
                                    >
                                        {applyLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang nộp đơn...
                                            </>
                                        ) : "Xác nhận nộp"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetailPage;