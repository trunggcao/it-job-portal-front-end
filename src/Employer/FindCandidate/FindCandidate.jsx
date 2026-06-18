import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// Giả sử bạn dùng axiosClient đã cấu hình sẵn hoặc đổi thành axios của bạn
import axios from 'axios';

function FindCandidate() {
    // === State danh sách dữ liệu cứng/API phục vụ bộ lọc ===
    const [availableSkills, setAvailableSkills] = useState([
        { id: 1, name: 'Java' },
        { id: 2, name: 'React' },
        { id: 3, name: 'Spring Boot' },
        { id: 4, name: 'MySQL' },
        { id: 5, name: 'Bootstrap' }
    ]);

    // === State lưu trữ tiêu chí lọc của Nhà tuyển dụng ===
    const [searchFilters, setSearchFilters] = useState({
        keyword: '',
        title: '',
        minExp: '',
        skillIds: [] // Mảng lưu các ID kỹ năng được chọn
    });

    // === State quản lý dữ liệu kết quả và Phân trang ===
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 5
    });

    // --- Hàm gọi API tìm kiếm ứng viên ---
    const fetchCandidates = async (pageNumber = 0) => {
        try {
            setLoading(true);

            // Chuẩn hóa dữ liệu trước khi gửi lên Backend
            const payload = {
                keyword: searchFilters.keyword.trim() || null,
                title: searchFilters.title.trim() || null,
                minExp: searchFilters.minExp ? parseInt(searchFilters.minExp) : null,
                skillIds: searchFilters.skillIds.length > 0 ? searchFilters.skillIds : null
            };

            // Gọi API endpoint của Spring Boot (đang truyền kèm tham số phân trang trên URL)
            const response = await axios.post(
                `http://localhost:8080/api/employer/candidates/search?page=${pageNumber}&size=${pagination.pageSize}&sortBy=id&sortDir=desc`,
                payload
            );

            const data = response.data; // Spring Boot Page object
            if (data) {
                setCandidates(data.content || []);
                setPagination(prev => ({
                    ...prev,
                    currentPage: data.number,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements
                }));
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm ứng viên:", error);
            toast.error("Không thể kết nối hệ thống dữ liệu ứng viên!");
        } finally {
            setLoading(false);
        }
    };

    // Tự động tải dữ liệu lần đầu tiên khi mở trang
    useEffect(() => {
        fetchCandidates(0);
        // axios.get('/api/skills').then(res => setAvailableSkills(res.data));
    }, []);

    // --- Xử lý thay đổi dữ liệu các ô input cơ bản ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters(prev => ({ ...prev, [name]: value }));
    };

    // --- Xử lý chọn/bỏ chọn Checkbox Kỹ năng ---
    const handleSkillCheckboxChange = (skillId) => {
        setSearchFilters(prev => {
            const isSelected = prev.skillIds.includes(skillId);
            const updatedSkills = isSelected
                ? prev.skillIds.filter(id => id !== skillId) // Bỏ chọn
                : [...prev.skillIds, skillId];              // Chọn thêm

            return { ...prev, skillIds: updatedSkills };
        });
    };

    // --- Hàm Reset bộ lọc về mặc định ---
    const handleResetFilters = () => {
        setSearchFilters({ keyword: '', title: '', minExp: '', skillIds: [] });
        // Sau khi reset, tải lại trang đầu tiên
        setTimeout(() => fetchCandidates(0), 50);
    };

    // --- Hàm kích hoạt tìm kiếm khi nhấn nút ---
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchCandidates(0); // Luôn quay về trang 0 khi tìm kiếm mới
    };

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
                    background-color: #eecfcd-subtle;
                }
            `}</style>

            {/* TIÊU ĐỀ TRANG */}
            <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">
                    <i className="bi bi-person-search me-2 text-primary"></i>
                    Hệ thống tìm kiếm & săn ứng viên tiềm năng
                </h4>
                <p className="text-muted small">Nhà tuyển dụng có thể chủ động tìm kiếm hồ sơ phù hợp theo mọi tiêu chí</p>
            </div>

            {/* BỘ LỌC TÌM KIẾM (FILTER FORM) */}
            <div className="card filter-card p-4 bg-white mb-4">
                <form onSubmit={handleSearchSubmit}>
                    <div className="row g-3">
                        {/* Nhập từ khóa */}
                        <div className="col-md-4 col-12">
                            <label className="form-label small fw-bold text-secondary">Từ khóa tìm kiếm</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light text-muted"><i className="bi bi-search"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="keyword"
                                    placeholder="Nhập tên, email ứng viên..."
                                    value={searchFilters.keyword}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Vị trí / Định danh công việc */}
                        <div className="col-md-4 col-12">
                            <label className="form-label small fw-bold text-secondary">Vị trí công việc (Title)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                placeholder="Ví dụ: Java Developer, Fullstack..."
                                value={searchFilters.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Số năm kinh nghiệm tối thiểu */}
                        <div className="col-md-4 col-12">
                            <label className="form-label small fw-bold text-secondary">Kinh nghiệm tối thiểu (Năm)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="minExp"
                                min="0"
                                placeholder="Nhập số năm kinh nghiệm..."
                                value={searchFilters.minExp}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Chọn kỹ năng theo nhóm Checkbox */}
                        <div className="col-12 border-top pt-3 mt-3">
                            <label className="form-label small fw-bold text-secondary d-block mb-2">
                                <i className="bi bi-tags-fill me-1 text-primary"></i> Lọc theo kỹ năng yêu cầu:
                            </label>
                            <div className="d-flex flex-wrap gap-3">
                                {availableSkills.map((skill) => (
                                    <div key={skill.id} className="form-check form-check-inline bg-light px-3 py-1.5 rounded border">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`skill-${skill.id}`}
                                            checked={searchFilters.skillIds.includes(skill.id)}
                                            onChange={() => handleSkillCheckboxChange(skill.id)}
                                        />
                                        <label className="form-check-label fw-medium text-dark small cursor-pointer" htmlFor={`skill-${skill.id}`}>
                                            {skill.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nhóm nút điều hướng hành động */}
                        <div className="col-12 d-flex justify-content-end gap-2 border-top pt-3 mt-3">
                            <button type="button" className="btn btn-outline-secondary px-4 fw-medium" onClick={handleResetFilters}>
                                <i className="bi bi-arrow-counterclockwise me-1"></i>Xóa bộ lọc
                            </button>
                            <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm" disabled={loading}>
                                {loading ? "Đang tìm..." : <><i className="bi bi-funnel-fill me-1"></i>Lọc Kết Quả</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* KẾT QUẢ TÌM KIẾM */}
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="text-muted small fw-medium">
                    Tìm thấy <strong className="text-dark">{pagination.totalElements}</strong> ứng viên phù hợp
                </span>
            </div>

            {loading ? (
                /* Giao diện Đang Loading */
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-2 small">Hệ thống đang truy quét hồ sơ phù hợp...</p>
                </div>
            ) : candidates.length === 0 ? (
                /* Không có kết quả */
                <div className="card text-center p-5 border-0 shadow-sm bg-white rounded-3">
                    <i className="bi bi-person-x-fill fs-1 text-black-50 mb-2"></i>
                    <h5 className="text-secondary fw-semibold">Không tìm thấy ứng viên nào</h5>
                    <p className="text-muted small m-0">Hãy thử nới lỏng từ khóa hoặc bỏ tích bớt các kỹ năng để tăng phạm vi tìm kiếm.</p>
                </div>
            ) : (
                /* Khối render danh sách ứng viên */
                <div className="d-flex flex-column gap-3 mb-4">
                    {candidates.map((cand) => (
                        <div key={cand.id} className="card candidate-card p-4 bg-white">
                            <div className="row align-items-center">
                                {/* Cột thông tin cơ bản */}
                                <div className="col-md-8 col-12">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <h5 className="fw-bold text-dark m-0">{cand.fullName}</h5>
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small px-2 py-1">
                                            {cand.title || 'Chưa cập nhật vị trí'}
                                        </span>
                                    </div>

                                    <div className="text-muted small d-flex flex-wrap gap-3 mb-3">
                                        <span><i className="bi bi-envelope me-1"></i>{cand.email}</span>
                                        <span><i className="bi bi-briefcase me-1"></i>Kinh nghiệm: <strong>{cand.yearsOfExperience || 0} năm</strong></span>
                                        <span><i className="bi bi-hash me-1"></i>Mã số: #{cand.id}</span>
                                    </div>

                                    {/* Render nhãn kỹ năng của ứng viên */}
                                    <div className="d-flex flex-wrap gap-1.5">
                                        {cand.skills && cand.skills.map((s) => (
                                            <span key={s.id} className="badge bg-light text-secondary border px-2 py-1.5 rounded-2 skill-badge">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Cột nút thao tác */}
                                <div className="col-md-4 col-12 text-md-end text-start mt-md-0 mt-3">
                                    <button
                                        className="btn btn-outline-primary btn-sm px-3 fw-bold rounded-pill me-2"
                                        onClick={() => window.open(`/employer/candidate-cv/${cand.id}`, '_blank')}
                                    >
                                        <i className="bi bi-file-earmark-person me-1"></i>Xem CV
                                    </button>
                                    <button className="btn btn-success btn-sm px-3 fw-bold rounded-pill">
                                        <i className="bi bi-telephone-outbound me-1"></i>Liên hệ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* THANH PHÂN TRANG (PAGINATION NAV) */}
                    {pagination.totalPages > 1 && (
                        <nav className="d-flex justify-content-center mt-3">
                            <ul className="pagination pagination-sm shadow-sm">
                                <li className={`page-item ${pagination.currentPage === 0 ? 'disabled' : ''}`}>
                                    <button className="page-item page-link" onClick={() => fetchCandidates(pagination.currentPage - 1)}>
                                        Trước
                                    </button>
                                </li>
                                {[...Array(pagination.totalPages).keys()].map((pageIndex) => (
                                    <li key={pageIndex} className={`page-item ${pagination.currentPage === pageIndex ? 'active' : ''}`}>
                                        <button className="page-link fw-semibold" onClick={() => fetchCandidates(pageIndex)}>
                                            {pageIndex + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${pagination.currentPage === pagination.totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-item page-link" onClick={() => fetchCandidates(pagination.currentPage + 1)}>
                                        Sau
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            )}
        </div>
    );
}

export default FindCandidate;