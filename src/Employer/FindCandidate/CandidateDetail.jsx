import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../../service/apiService';
import { useAuth } from '../../Auth/AuthContext';

function CandidateDetail() {
    const { id } = useParams(); // Lấy profileId từ URL
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    // === State lưu trữ thông tin ứng viên ===
    const [candidate, setCandidate] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Gọi đồng thời API Hồ sơ & API Danh sách Dự án ---
    const fetchCandidateData = async () => {
        try {
            setLoading(true);

            // Chạy song song cả 2 API để tối ưu tốc độ tải trang
            const [profileRes, projectsRes] = await Promise.all([
                apiService.getCandidateProfileDetail(id, user.id),
                apiService.getCandidateProjectsByProfileId(id)
            ]);

            // Xử lý dữ liệu hồ sơ ứng viên
            if (profileRes && profileRes.data) {
                setCandidate(profileRes.data);
            } else {
                toast.error("Không tìm thấy thông tin ứng viên này!");
            }

            // Xử lý dữ liệu danh sách dự án
            if (projectsRes && projectsRes.data) {
                setProjects(projectsRes.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu ứng viên:", error);
            toast.error("Lỗi hệ thống khi tải thông tin!");
        } finally {
            setLoading(false);
        }
    };

    // --- Lắng nghe trạng thái đăng nhập và ID để tải dữ liệu ---
    useEffect(() => {
        if (!authLoading && user?.id) {
            fetchCandidateData();
        }
    }, [id, user, authLoading]);

    // === GIAO DIỆN CHỜ XÁC THỰC TÀI KHOẢN ===
    if (authLoading) {
        return (
            <div className="text-center py-5" style={{ minHeight: '400px', marginTop: '100px' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 small fw-medium">Đang xác thực tài khoản nhà tuyển dụng...</p>
            </div>
        );
    }

    // === GIAO DIỆN CHẶN NẾU CHƯA ĐĂNG NHẬP HOẶC KHÔNG PHẢI EMPLOYER ===
    if (!user || !user.id) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning d-inline-block px-5 py-4 shadow-sm rounded-4" style={{ maxWidth: '600px' }}>
                    <i className="bi bi-exclamation-triangle-fill display-5 d-block mb-3 text-warning"></i>
                    <h5 className="fw-bold text-dark">Quyền truy cập bị hạn chế</h5>
                    <p className="text-muted small mb-0">Vui lòng đăng nhập tài khoản **Nhà tuyển dụng** để xem thông tin chi tiết hồ sơ ứng viên.</p>
                </div>
            </div>
        );
    }

    // === GIAO DIỆN ĐANG TẢI DỮ LIỆU TỪ API ===
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 small">Đang tải chi tiết hồ sơ ứng viên từ hệ thống...</p>
            </div>
        );
    }

    // === GIAO DIỆN NẾU KHÔNG CÓ DỮ LIỆU ===
    if (!candidate) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger d-inline-block px-5 rounded-3 shadow-sm">
                    <i className="bi bi-x-circle-fill display-6 d-block mb-2"></i>
                    <h5>Hồ sơ ứng viên không tồn tại hoặc đã bị ẩn công khai!</h5>
                    <button className="btn btn-sm btn-outline-danger mt-3" onClick={() => navigate(-1)}> Quay lại</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <style>{`
                .cv-header-card {
                    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
                    color: #ffffff;
                    border: none;
                    border-radius: 16px;
                }
                .cv-section-card {
                    border: none;
                    border-radius: 14px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.04);
                }
                .section-title {
                    font-size: 1.1rem;
                    color: #0d6efd;
                    font-weight: 700;
                    border-bottom: 2px solid #0d6efd;
                    padding-bottom: 6px;
                    margin-bottom: 15px;
                }
                .blur-text {
                    filter: blur(5px);
                    user-select: none;
                }
                .badge-skill {
                    background-color: #f8f9fa;
                    color: #495057;
                    border: 1px solid #dee2e6;
                    padding: 6px 12px;
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                .project-item {
                    border-left: 3px solid #0d6efd;
                    padding-left: 15px;
                }
            `}</style>

            {/* THANH ĐIỀU HƯỚNG QUAY LẠI */}
            <div className="mb-3">
                <Link
                    to="/employer/find-candidates"
                    className="btn btn-link text-decoration-none p-0 fw-medium text-secondary"
                >
                    <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách ứng viên
                </Link>
            </div>

            <div className="row g-4">
                {/* ================= CỘT TRÁI: THÔNG TIN TỔNG QUAN & AVATAR ================= */}
                <div className="col-lg-4 col-12">
                    {/* KHỐI PROFILE CHÍNH */}
                    <div className="card cv-section-card p-4 text-center bg-white mb-4">
                        <div className="position-relative d-inline-block mx-auto mb-3">
                            <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: '100px', height: '100px' }}>
                                <i className="bi bi-person-fill display-4"></i>
                            </div>
                        </div>

                        <h4 className={`fw-bold text-dark mb-1 ${!candidate.unlocked ? 'blur-text' : ''}`}>
                            {candidate.fullName || "Nguyễn Văn A"}
                        </h4>
                        <p className="text-primary fw-semibold small mb-3">{candidate.title || "Chưa cập nhật vị trí"}</p>

                        <div className="d-flex justify-content-center gap-2 mb-2">
                            <span className="badge bg-light text-dark border px-2 py-1.5 small rounded-pill">
                                <i className="bi bi-briefcase text-muted me-1"></i> {candidate.yearsOfExperience || 0} năm EXP
                            </span>
                            {candidate.unlocked ? (
                                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1.5 small rounded-pill">
                                    <i className="bi bi-unlock-fill me-1"></i> Đã mở khóa
                                </span>
                            ) : (
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1.5 small rounded-pill">
                                    <i className="bi bi-lock-fill me-1"></i> Hồ sơ khóa
                                </span>
                            )}
                        </div>
                    </div>

                    {/* KHỐI LIÊN HỆ (BẢO MẬT THEO TRẠNG THÁI UNLOCKED) */}
                    <div className="card cv-section-card p-4 bg-white">
                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Thông tin liên hệ</h6>

                        <div className="d-flex flex-column gap-3">
                            {/* Email */}
                            <div className="d-flex align-items-start gap-2.5">
                                <div className="text-primary"><i className="bi bi-envelope-fill fs-5"></i></div>
                                <div>
                                    <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Địa chỉ Email</small>
                                    <span className={`small fw-medium ${!candidate.unlocked ? 'blur-text' : ''}`}>
                                        {candidate.email || "candidate@gmail.com"}
                                    </span>
                                </div>
                            </div>

                            {/* Số điện thoại */}
                            <div className="d-flex align-items-start gap-2.5">
                                <div className="text-success"><i className="bi bi-telephone-fill fs-5"></i></div>
                                <div>
                                    <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Số điện thoại</small>
                                    <span className={`small fw-medium ${!candidate.unlocked ? 'blur-text' : ''}`}>
                                        {candidate.phone || "0987******"}
                                    </span>
                                </div>
                            </div>

                            {/* Địa chỉ nơi ở */}
                            <div className="d-flex align-items-start gap-2.5">
                                <div className="text-warning"><i className="bi bi-geo-alt-fill fs-5"></i></div>
                                <div>
                                    <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Khu vực sinh sống</small>
                                    <span className={`small fw-medium ${!candidate.unlocked ? 'blur-text' : ''}`}>
                                        {candidate.address || "Hà Nội, Việt Nam"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* NÚT THAO TÁC MUA HỒ SƠ NẾU CHƯA UNLOCK */}
                        {!candidate.unlocked && (
                            <div className="mt-4 border-top pt-3 text-center">
                                <div className="alert alert-light p-2 rounded-3 small text-muted mb-3 border">
                                    <i className="bi bi-info-circle me-1 text-danger"></i> Hồ sơ đang được bảo mật thông tin liên hệ.
                                </div>
                                <button className="btn btn-danger w-100 fw-bold rounded-pill shadow-sm py-2">
                                    <i className="bi bi-unlock-fill me-1"></i> Mở khóa liên hệ hồ sơ
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= CỘT PHẢI: KỸ NĂNG, KINH NGHIỆM CHI TIẾT & DỰ ÁN ================= */}
                <div className="col-lg-8 col-12">
                    {/* BANNER THÔNG TIN CHÍNH */}
                    <div className="card cv-header-card p-4 mb-4 shadow-sm">
                        <small className="opacity-75 text-uppercase tracking-wider fw-semibold small">Ứng viên tiềm năng</small>
                        <h2 className={`fw-bold mt-1 mb-2 ${!candidate.unlocked ? 'blur-text' : ''}`}>
                            {candidate.fullName || "Nguyễn Văn A"}
                        </h2>
                        <h5 className="opacity-90 fw-medium mb-0">
                            <i className="bi bi-briefcase me-1.5"></i> Vị trí: {candidate.title || "Chưa cập nhật vị trí"}
                        </h5>
                    </div>

                    {/* CARD THÔNG TIN CHI TIẾT CV */}
                    <div className="card cv-section-card p-4 bg-white mb-4">
                        {/* 1. Phần Giới thiệu bản thân */}
                        <div className="mb-4">
                            <div className="section-title">
                                <i className="bi bi-person-lines-fill me-2"></i> Giới thiệu bản thân
                            </div>
                            <p className="text-secondary small lh-base" style={{ textAlign: 'justify' }}>
                                {candidate.aboutMe || "Ứng viên chưa cập nhật bài viết giới thiệu bản thân chi tiết."}
                            </p>
                        </div>

                        {/* 2. Phần Kỹ năng chuyên môn */}
                        <div className="mb-4">
                            <div className="section-title">
                                <i className="bi bi-cpu-fill me-2"></i> Kỹ năng chuyên môn
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {candidate.skills && candidate.skills.length > 0 ? (
                                    candidate.skills.map((skillName, index) => (
                                        <span key={index} className="badge badge-skill rounded-2 shadow-sm">
                                            {skillName}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted small italic">Chưa cập nhật danh sách kỹ năng chuyên môn.</span>
                                )}
                            </div>
                        </div>

                        {/* 3. Phần Kinh nghiệm làm việc tổng quát */}
                        <div className="mb-4">
                            <div className="section-title">
                                <i className="bi bi-clock-history me-2"></i> Lịch sử kinh nghiệm tóm tắt
                            </div>
                            {candidate.experienceDetail ? (
                                <div
                                    className="text-secondary small lh-lg"
                                    style={{ whiteSpace: 'pre-line' }}
                                >
                                    {candidate.experienceDetail}
                                </div>
                            ) : (
                                <div className="text-center py-3 border border-dashed rounded bg-light text-muted small">
                                    Ứng viên chưa bổ sung chi tiết lịch sử kinh nghiệm làm việc cụ thể.
                                </div>
                            )}
                        </div>

                        <div className="mb-2">
                            <div className="section-title">
                                <i className="bi bi-diagram-3-fill me-2"></i> Các Dự án đã tham gia
                            </div>
                            {projects && projects.length > 0 ? (
                                <div className="d-flex flex-column gap-4 mt-3">
                                    {projects.map((project, index) => (
                                        <div key={project.id || index} className="project-item mb-2">
                                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                {/* Tên dự án */}
                                                <h6 className="fw-bold text-dark mb-0">
                                                    {project.projectName || "Dự án không tên"}
                                                </h6>

                                                {/* Thời gian thực hiện dự án (startDate -> endDate) */}
                                                {(project.startDate || project.endDate) && (
                                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-6 fw-bold px-3 py-2">
                                                        <i className="bi bi-calendar3 me-2"></i>
                                                        {project.startDate ? new Date(project.startDate).toLocaleDateString('vi-VN') : '...'}
                                                        {' → '}
                                                        {project.endDate ? new Date(project.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Mô tả chi tiết dự án */}
                                            {project.description && (
                                                <div className="text-muted small lh-base mt-2" style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>
                                                    <strong>Mô tả dự án:</strong> {project.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 border border-dashed rounded bg-light text-muted small">
                                    <i className="bi bi-folder-symlink d-block display-6 text-muted mb-2"></i>
                                    Ứng viên chưa đính kèm danh sách dự án chi tiết nào.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CandidateDetail;