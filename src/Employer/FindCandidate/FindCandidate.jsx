import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiService from '../../service/apiService';
import { useAuth } from '../../Auth/AuthContext';

function FindCandidate() {
    // Lấy thông tin user đăng nhập và trạng thái chờ xác thực từ Context
    const { user, loading: authLoading } = useAuth();

    // === State danh sách dữ liệu kỹ năng từ API đổ vào bộ lọc ===
    const [availableSkills, setAvailableSkills] = useState([]);

    // === State lưu trữ tiêu chí lọc của Nhà tuyển dụng ===
    const [searchFilters, setSearchFilters] = useState({
        title: '',
        minYearsOfExperience: '',
        skillIds: []
    });

    // === State quản lý danh sách kết quả ứng viên và trạng thái loading ===
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    // === State quản lý trạng thái loading riêng cho từng nút mở khóa (lưu theo profileId) ===
    const [unlockingIds, setUnlockingIds] = useState({});

    // --- 1. Gọi API lấy danh sách kỹ năng hệ thống để render ra các ô checkbox ---
    const fetchSystemSkills = async () => {
        try {
            const response = await apiService.getAllSkills();
            if (response && response.data) {
                setAvailableSkills(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách kỹ năng hệ thống:", error);
            toast.error("Không thể tải danh sách kỹ năng bộ lọc!");
        }
    };

    const fetchCandidates = async () => {
        // Nếu thông tin user chưa tồn tại hoặc không có ID, không gọi API
        if (!user || !user.id) return;

        try {
            setLoading(true);
            const params = {
                employerId: user.id,
                title: searchFilters.title.trim() || null,
                minYearsOfExperience: searchFilters.minYearsOfExperience ? parseInt(searchFilters.minYearsOfExperience) : null,
                skillIds: searchFilters.skillIds.length > 0 ? searchFilters.skillIds.join(',') : null
            };

            const response = await apiService.findCandidates(params);

            if (response && response.data) {
                setCandidates(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm ứng viên:", error);
            toast.error("Không thể kết nối hệ thống dữ liệu ứng viên!");
        } finally {
            setLoading(false);
        }
    };

    const handleUnlockProfile = async (profileId, candidateName) => {
        if (!user || !user.id) {
            toast.error("Phiên đăng nhập không hợp lệ!");
            return;
        }

        const displayName = candidateName ? `"${candidateName}"` : "ứng viên này";
        if (!window.confirm(`Bạn có chắc chắn muốn mở khóa thông tin liên hệ của ${displayName} không?`)) {
            return;
        }

        try {
            // Đặt trạng thái loading riêng cho profileId này
            setUnlockingIds(prev => ({ ...prev, [profileId]: true }));

            const response = await apiService.unlockCandidateProfile(profileId, user.id);

            toast.success(response.data || "Mở khóa thông tin ứng viên thành công!");

            // Tải lại danh sách ứng viên để cập nhật UI mới nhất (bỏ mờ thông tin liên hệ)
            await fetchCandidates();
        } catch (error) {
            console.error("Lỗi khi mở khóa hồ sơ:", error);
            const errorMsg = error.response?.data || "Mở khóa thất bại, vui lòng thử lại!";
            toast.error(errorMsg);
        } finally {
            // Tắt trạng thái loading cho profileId này
            setUnlockingIds(prev => ({ ...prev, [profileId]: false }));
        }
    };

    // --- 3. Lắng nghe trạng thái đăng nhập để tải dữ liệu ban đầu ---
    useEffect(() => {
        fetchSystemSkills();
        if (!authLoading && user?.id) {
            fetchCandidates();
        }
    }, [user, authLoading]);

    // --- Xử lý thay đổi dữ liệu các ô nhập Text / Number ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters(prev => ({ ...prev, [name]: value }));
    };

    // --- Xử lý Chọn / Bỏ chọn các ô Checkbox kỹ năng ---
    const handleSkillCheckboxChange = (skillId) => {
        setSearchFilters(prev => {
            const isSelected = prev.skillIds.includes(skillId);
            const updatedSkills = isSelected
                ? prev.skillIds.filter(id => id !== skillId) // Loại bỏ khỏi mảng nếu bỏ tích
                : [...prev.skillIds, skillId];              // Thêm vào mảng nếu tích chọn mới

            return { ...prev, skillIds: updatedSkills };
        });
    };

    // --- Hàm Reset toàn bộ form lọc về rỗng ---
    const handleResetFilters = () => {
        setSearchFilters({ title: '', minYearsOfExperience: '', skillIds: [] });
        // Trì hoãn một chút để state kịp clear, sau đó tải lại toàn bộ ứng viên công khai
        setTimeout(() => {
            if (user?.id) fetchCandidates();
        }, 50);
    };

    // --- Hàm kích hoạt tìm kiếm khi nhấn submit Form ---
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchCandidates();
    };

    // === GIAO DIỆN CHỜ XÁC THỰC TÀI KHOẢN===
    if (authLoading) {
        return (
            <div className="text-center py-5" style={{ minHeight: '400px', marginTop: '100px' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 small fw-medium">Đang đồng bộ thông tin nhà tuyển dụng...</p>
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
                    <p className="text-muted small mb-0">Vui lòng đăng nhập với tài khoản dành cho **Nhà tuyển dụng** để thực hiện chức năng tìm kiếm, sàng lọc và mua hồ sơ ứng viên này.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <style>{`
                .filter-card {
                    border: none;
                    border-radius: 14px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .candidate-card {
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    transition: all 0.25s ease;
                }
                .candidate-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
                    border-color: #0d6efd;
                }
                .skill-badge {
                    font-size: 0.8rem;
                    padding: 5px 10px;
                }
                .blur-text {
                    filter: blur(4px);
                    user-select: none;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>

            {/* TIÊU ĐỀ TRANG */}
            <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">
                    <i className="bi bi-person-search me-2 text-primary"></i>
                    Hệ thống tìm kiếm & săn ứng viên tiềm năng
                </h4>
                <p className="text-muted small">Nhà tuyển dụng chủ động sàng lọc nguồn nhân lực chất lượng cao theo kỹ năng và thâm niên</p>
            </div>

            {/* (FILTER FORM) */}
            <div className="card filter-card p-4 bg-white mb-4">
                <form onSubmit={handleSearchSubmit}>
                    <div className="row g-3">
                        {/* Vị trí công việc (Title) */}
                        <div className="col-md-6 col-12">
                            <label className="form-label small fw-bold text-secondary">Vị trí công việc (Title)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light text-muted"><i className="bi bi-briefcase"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    placeholder="Ví dụ: Java Developer, Frontend, React..."
                                    value={searchFilters.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Số năm kinh nghiệm tối thiểu */}
                        <div className="col-md-6 col-12">
                            <label className="form-label small fw-bold text-secondary">Kinh nghiệm tối thiểu (Số năm)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light text-muted"><i className="bi bi-calendar-check"></i></span>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="minYearsOfExperience"
                                    min="0"
                                    placeholder="Ví dụ: 1, 2, 3 năm..."
                                    value={searchFilters.minYearsOfExperience}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Chọn kỹ năng theo nhóm Checkbox*/}
                        <div className="col-12 border-top pt-3 mt-3">
                            <label className="form-label small fw-bold text-secondary d-block mb-2">
                                <i className="bi bi-tags-fill me-1 text-primary"></i> Lọc theo kỹ năng yêu cầu:
                            </label>
                            <div className="d-flex flex-wrap gap-2">
                                {availableSkills.length > 0 ? (
                                    availableSkills.map((skill) => (
                                        <div key={skill.id} className="form-check form-check-inline bg-white px-3 py-1.5 rounded-pill border shadow-sm d-flex align-items-center gap-1 cursor-pointer">
                                            <input
                                                className="form-check-input m-0 cursor-pointer"
                                                type="checkbox"
                                                id={`skill-${skill.id}`}
                                                checked={searchFilters.skillIds.includes(skill.id)}
                                                onChange={() => handleSkillCheckboxChange(skill.id)}
                                            />
                                            <label className="form-check-label fw-medium text-dark small cursor-pointer ps-1" htmlFor={`skill-${skill.id}`}>
                                                {skill.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-muted small italic"><div className="spinner-border spinner-border-sm text-secondary me-2"></div>Đang tải kho kỹ năng...</span>
                                )}
                            </div>
                        </div>

                        {/* Nhóm nút hành động của Form */}
                        <div className="col-12 d-flex justify-content-end gap-2 border-top pt-3 mt-3">
                            <button type="button" className="btn btn-outline-secondary px-4 fw-medium rounded-pill" onClick={handleResetFilters}>
                                <i className="bi bi-arrow-counterclockwise me-1"></i>Xóa bộ lọc
                            </button>
                            <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm rounded-pill" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Đang tìm...</>
                                ) : (
                                    <><i className="bi bi-funnel-fill me-1"></i>Lọc Kết Quả</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* SỐ LƯỢNG KẾT QUẢ TÌM THẤY */}
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="text-muted small fw-medium">
                    Tìm thấy <strong className="text-dark">{candidates.length}</strong> ứng viên tương thích dữ liệu
                </span>
            </div>

            {/* TRẠNG THÁI LOADING DANH SÁCH */}
            {loading ? (
                <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-2 small fw-medium">Hệ thống đang rà soát thông tin hồ sơ ứng viên...</p>
                </div>
            ) : candidates.length === 0 ? (
                /* GIAO DIỆN KHÔNG CÓ KẾT QUẢ */
                <div className="card text-center p-5 border-0 shadow-sm bg-white rounded-3">
                    <i className="bi bi-person-x-fill fs-1 text-black-50 mb-2"></i>
                    <h5 className="text-secondary fw-semibold">Không tìm thấy ứng viên nào phù hợp</h5>
                    <p className="text-muted small m-0">Hãy thử giảm yêu cầu số năm kinh nghiệm hoặc bỏ chọn bớt các tiêu chí kỹ năng.</p>
                </div>
            ) : (
                /* DANH SÁCH ỨNG VIÊN ĐƯỢC RENDER */
                <div className="d-flex flex-column gap-3 mb-4">
                    {candidates.map((cand) => (
                        <div key={cand.profileId} className="card candidate-card p-4 bg-white">
                            <div className="row align-items-center">
                                {/* Cột nội dung thông tin ứng viên */}
                                <div className="col-md-8 col-12">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        {/* Nếu hồ sơ chưa unlock thì sẽ thực hiện che mờ tên bằng CSS class blur-text */}
                                        <h5 className={`fw-bold text-dark m-0 ${!cand.unlocked ? 'blur-text' : ''}`}>
                                            {cand.fullName || "Nguyễn Văn A"}
                                        </h5>
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small px-2 py-1">
                                            {cand.title || 'Chưa cập nhật vị trí'}
                                        </span>
                                    </div>

                                    <div className="text-muted small d-flex flex-wrap gap-3 mb-3">
                                        <span className={!cand.unlocked ? 'blur-text' : ''}>
                                            <i className="bi bi-envelope me-1"></i>{cand.email || "candidate@gmail.com"}
                                        </span>
                                        <span>
                                            <i className="bi bi-briefcase me-1"></i>Kinh nghiệm: <strong>{cand.yearsOfExperience || 0} năm</strong>
                                        </span>
                                        <span>
                                            <i className="bi bi-hash me-1"></i>Mã hồ sơ: #{cand.profileId}
                                        </span>
                                    </div>

                                    {/* Hiển thị mảng kỹ năng String */}
                                    <div className="d-flex flex-wrap gap-1.5">
                                        {cand.skills && cand.skills.map((skillName, index) => (
                                            <span key={index} className="badge bg-light text-secondary border px-2 py-1.5 rounded-2 skill-badge fw-medium">
                                                {skillName}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Cột các nút bấm tương tác hành động */}
                                <div className="col-md-4 col-12 text-md-end text-start mt-md-0 mt-3 d-flex flex-wrap justify-content-md-end gap-2 align-items-center">
                                    {/* 1. NÚT XEM CV CHI TIẾT */}
                                    <button
                                        className="btn btn-outline-primary btn-sm px-3 fw-bold rounded-pill shadow-sm"
                                        onClick={() => window.open(`/employer/candidate-cv/${cand.profileId}`, '_blank')}
                                    >
                                        <i className="bi bi-file-earmark-person me-1"></i>Xem CV chi tiết
                                    </button>

                                    {/* 2. CÁC NÚT ĐIỀU KIỆN THEO TRẠNG THÁI UNLOCKED */}
                                    {cand.unlocked ? (
                                        /* Đã mua / Mở khóa hồ sơ: Hiện thêm nút liên hệ trực tiếp */
                                        <button className="btn btn-success btn-sm px-3 fw-bold rounded-pill shadow-sm">
                                            <i className="bi bi-telephone-outbound me-1"></i>Liên hệ ngay
                                        </button>
                                    ) : (
                                        /* Chưa mua / Mở khóa hồ sơ: Gắn sự kiện handleUnlockProfile */
                                        <button
                                            className="btn btn-danger btn-sm px-3 fw-bold rounded-pill shadow-sm"
                                            disabled={unlockingIds[cand.profileId]}
                                            onClick={() => handleUnlockProfile(cand.profileId, cand.fullName)}
                                        >
                                            {unlockingIds[cand.profileId] ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-lock-fill me-1"></i> Mở khóa thông tin
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FindCandidate;