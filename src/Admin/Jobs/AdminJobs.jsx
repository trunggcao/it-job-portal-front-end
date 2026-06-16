import React, { useState, useEffect } from 'react';
import apiService from '../../service/apiService'; // Đảm bảo đúng đường dẫn đến file service của bạn
import { toast } from 'react-toastify';

function AdminJobs() {
    // === Các State Quản Lý Dữ Liệu ===
    const [jobsList, setJobsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');

    // === Các State Quản Lý Modal Xem Chi Tiết ===
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // === Hàm gọi API lấy danh sách Tin tuyển dụng ===
    const fetchJobs = async (keyword = "") => {
        try {
            setLoading(true);

            // Cấu hình các tham số lọc (params) theo getAllJobs
            const params = {};
            if (keyword.trim()) {
                params.search = keyword.trim();
            }

            // Gọi API thông qua apiService
            const response = await apiService.getAllJobs(params);

            // Xử lý nạp dữ liệu dựa trên cấu trúc trả về của axiosClient
            setJobsList(response.data || response);
        } catch (error) {
            console.error("Lỗi hệ thống khi gọi API lấy danh sách Jobs:", error);
            const errorMsg = error.response?.data?.message || "Không thể kết nối đến máy chủ để tải danh sách tin tuyển dụng!";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Tự động gọi API khi tải trang lần đầu
    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchJobs(searchKeyword);
    };

    // Hàm mở Modal và nạp dữ liệu bản ghi được chọn
    const openJobDetail = (job) => {
        setSelectedJob(job);
        setShowDetailModal(true);
    };

    return (
        <div className="jobs-page-container">
            <style>{`
                .table-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
                .search-box {
                    max-width: 280px;
                }
                .modal-body-custom {
                    max-height: 70vh;
                    overflow-y: auto;
                }
            `}</style>

            <div className="card table-card p-4 bg-white">
                {/* Tiêu đề & Thanh tìm kiếm */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-briefcase-fill text-warning me-2"></i>Quản lý tin tuyển dụng (Jobs)
                    </h5>

                    {/* Form Tìm kiếm truyền Params */}
                    <form onSubmit={handleSearchSubmit} className="search-box input-group input-group-sm">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm vị trí tin..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle border-light">
                        <thead className="table-light small text-secondary">
                            <tr>
                                <th style={{ width: '100px' }}>Mã tin</th>
                                <th>Vị trí</th>
                                <th>Công ty đăng</th>
                                <th>Hạn nộp</th>
                                <th>Trạng thái</th>
                                <th>Ngày đăng</th>
                                <th style={{ width: '160px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Hiển thị vòng xoay Loading khi đợi kết nối API */}
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-secondary">
                                        <div className="spinner-border spinner-border-sm text-warning me-2" role="status"></div>
                                        Đang tải dữ liệu tin tuyển dụng...
                                    </td>
                                </tr>
                            ) : /* Kết nối thành công nhưng danh sách rỗng */
                                jobsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            Không tìm thấy bài đăng tuyển dụng nào phù hợp.
                                        </td>
                                    </tr>
                                ) : (
                                    /* TH3: Đổ dữ liệu thật từ Server */
                                    jobsList.map((job) => (
                                        <tr key={job.id}>
                                            <td className="text-secondary"># {job.id}</td>
                                            <td className="fw-medium text-dark">{job.name}</td>
                                            <td>{job.companyName}</td>
                                            <td>{job.endDate}</td>
                                            <td>
                                                {job.active === true ? (
                                                    <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1.5 small">
                                                        Đang hiển thị
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger-subtle text-danger rounded-pill px-2.5 py-1.5 small">
                                                        Đã ẩn/Khóa
                                                    </span>
                                                )}
                                            </td>
                                            <td>{job.createdAt}</td>
                                            <td>
                                                {/* Nút Xem chi tiết */}
                                                <button
                                                    className="btn btn-sm btn-light text-info border-light-subtle me-1"
                                                    title="Xem chi tiết tin"
                                                    onClick={() => openJobDetail(job)}
                                                >
                                                    <i className="bi bi-eye-fill"></i>
                                                </button>
                                                {/* Nút Khóa/Ẩn tin */}
                                                <button
                                                    className="btn btn-sm btn-light text-primary border-light-subtle me-1"
                                                    title="Khóa/Ẩn tin"
                                                    onClick={() => alert(`Khóa tin ID: ${job.id}`)}
                                                >
                                                    <i className="bi bi-eye-slash-fill"></i>
                                                </button>
                                                {/* Nút Gỡ tin hoàn toàn */}
                                                <button
                                                    className="btn btn-sm btn-light text-danger border-light-subtle"
                                                    title="Gỡ tin hoàn toàn"
                                                    onClick={() => alert(`Xóa tin vĩnh viễn ID: ${job.id}`)}
                                                >
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* === BOOTSTRAP MODAL XEM CHI TIẾT TIN TUYỂN DỤNG === */}
            {showDetailModal && selectedJob && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={() => setShowDetailModal(false)}
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>

                                {/* Modal Header */}
                                <div className="modal-header bg-light border-bottom-0">
                                    <h5 className="modal-title fw-bold text-dark">
                                        <i className="bi bi-info-circle-fill text-info me-2"></i>Chi Tiết Tin Tuyển Dụng
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowDetailModal(false)}
                                    ></button>
                                </div>

                                {/* Modal Body */}
                                <div className="modal-body modal-body-custom py-4 px-4">
                                    <div className="row g-3">
                                        {/* Tiêu đề công việc & Tên Công ty */}
                                        <div className="col-12 border-bottom pb-3 mb-2">
                                            <h4 className="fw-bold text-primary mb-1">{selectedJob.name}</h4>
                                            <p className="text-secondary mb-0 fw-medium">
                                                <i className="bi bi-building me-1"></i>{selectedJob.companyName || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="col-12 bg-info-subtle p-3 rounded d-flex align-items-center justify-content-between mt-2">
                                            <div>
                                                <span className="text-dark fw-medium small d-block">Liên kết bài đăng:</span>
                                                <span className="text-secondary small text-truncate d-inline-block" style={{ maxWidth: '400px' }}>
                                                    {`${window.location.origin}/jobs/${selectedJob.id}`}
                                                </span>
                                            </div>
                                            <a
                                                href={`/jobs/${selectedJob.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-info text-white fw-medium job-detail-link px-3"
                                            >
                                                Xem bài đăng <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                                            </a>
                                        </div>

                                        {/* Thông tin chung */}
                                        <div className="col-md-6">
                                            <span className="text-muted d-block small">Mã tin tuyển dụng:</span>
                                            <strong className="text-dark">#{selectedJob.id}</strong>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="text-muted d-block small">Ngày đăng tin:</span>
                                            <strong className="text-dark"><i className="bi bi-calendar-check me-1"></i>{selectedJob.createdAt}</strong>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="text-muted d-block small">Hạn nộp hồ sơ:</span>
                                            <strong className="text-dark"><i className="bi bi-calendar-x me-1"></i>{selectedJob.endDate}</strong>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="text-muted d-block small">Mức lương:</span>
                                            <strong className="text-success">
                                                <i className="bi bi-cash-stack me-1"></i>{selectedJob.salary || 'Thỏa thuận'}
                                            </strong>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="text-muted d-block small">Địa điểm:</span>
                                            <strong className="text-dark">
                                                <i className="bi bi-geo-alt me-1"></i>{selectedJob.location || 'Chưa cập nhật'}
                                            </strong>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="text-muted d-block small">Trạng thái duyệt:</span>
                                            {selectedJob.active ? (
                                                <span className="badge bg-success-subtle text-success">Đang hiển thị</span>
                                            ) : (
                                                <span className="badge bg-danger-subtle text-danger">Đang ẩn/Khóa</span>
                                            )}
                                        </div>


                                        {/* Mô tả chi tiết lấy từ API */}
                                        <div className="col-12 mt-4">
                                            <h6 className="fw-bold text-dark border-start border-3 border-info ps-2 mb-2">Mô tả công việc</h6>
                                            <p className="text-secondary small bg-light p-3 rounded" style={{ whiteSpace: 'pre-line' }}>
                                                {selectedJob.description || 'Không có mô tả chi tiết cho vị trí này.'}
                                            </p>
                                        </div>

                                        <div className="col-12 mt-3">
                                            <h6 className="fw-bold text-dark border-start border-3 border-info ps-2 mb-2">Yêu cầu công việc</h6>
                                            <p className="text-secondary small bg-light p-3 rounded" style={{ whiteSpace: 'pre-line' }}>
                                                {selectedJob.requirement || 'Không có yêu cầu cụ thể nào được đặt ra.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="modal-footer border-top bg-light">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary fw-medium px-4"
                                        onClick={() => setShowDetailModal(false)}
                                    >
                                        Đóng lại
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
}

export default AdminJobs;