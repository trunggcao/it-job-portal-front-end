import React, { useState, useEffect } from 'react';
import apiService from '../../service/apiService';
import { toast } from 'react-toastify';

function AdminSkills() {
    // === Các State quản lý dữ liệu ===
    const [skillsList, setSkillsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // === Các State quản lý Form thêm mới ===
    const [showModal, setShowModal] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Hàm lấy danh sách kỹ năng từ API
    const fetchSkills = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAllSkills();
            setSkillsList(response.data || response);
        } catch (error) {
            console.error("Lỗi hệ thống khi gọi API lấy Skills:", error);
            toast.error("Không thể tải danh sách kỹ năng từ máy chủ!");
        } finally {
            setLoading(false);
        }
    };

    // Tự động gọi API khi load trang lần đầu
    useEffect(() => {
        fetchSkills();
    }, []);

    // Hàm xử lý gửi dữ liệu Form Thêm kỹ năng
    const handleCreateSkillSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra hợp lệ dữ liệu đầu vào
        if (!newSkillName.trim()) {
            toast.warn("Vui lòng nhập tên kỹ năng!");
            return;
        }

        try {
            setSubmitting(true);
            const skillDTO = {
                name: newSkillName.trim()
            };

            // Gọi API lưu vào DB
            await apiService.createSkill(skillDTO);

            // Bắn thông báo thành công góc trên bên phải bằng react-toastify
            toast.success(`Thêm kỹ năng "${skillDTO.name}" thành công!`);

            // Reset dữ liệu, đóng modal và nạp làm mới danh sách
            setNewSkillName('');
            setShowModal(false);
            fetchSkills();
        } catch (error) {
            console.error("Lỗi khi thêm kỹ năng:", error);
            // Bắn thông báo lỗi dựa trên phản hồi từ server
            const errorMsg = error.response?.data?.message || "Thêm kỹ năng thất bại, vui lòng thử lại!";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="skills-page-container">
            {/* Styles dành riêng cho trang quản lý Kỹ năng */}
            <style>{`
                .stat-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                    transition: transform 0.2s;
                }
                .stat-card:hover {
                    transform: translateY(-3px);
                }
                .table-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
            `}</style>

            {/* === 1. THẺ THỐNG KÊ NHANH === */}
            <div className="row g-3 mb-4">
                <div className="col-md-4 col-lg-3 col-6">
                    <div className="card stat-card p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Tổng Kỹ năng</span>
                                <h3 className="fw-bold m-0">
                                    {loading ? "..." : skillsList.length}
                                </h3>
                            </div>
                            <div className="fs-3 text-success bg-success-subtle rounded p-2 px-3">
                                <i className="bi bi-tags"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === 2. BẢNG QUẢN LÝ DANH SÁCH KỸ NĂNG === */}
            <div className="card table-card p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-tags-fill text-success me-2"></i>Quản lý thẻ kỹ năng (Skills)
                    </h5>
                    {/* Bắt sự kiện Click để mở Bootstrap Modal */}
                    <button className="btn btn-success btn-sm fw-semibold px-3" onClick={() => setShowModal(true)}>
                        <i className="bi bi-plus-lg me-1"></i>Thêm Kỹ năng
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle border-light">
                        <thead className="table-light small text-secondary">
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th style={{ width: '180px' }}>Tên kỹ năng</th>
                                <th>Ngày tạo</th>
                                <th style={{ width: '220px' }}>Số lượng bài đăng dùng</th>
                                <th style={{ width: '120px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-secondary">
                                        <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                                        Đang tải dữ liệu từ API hệ thống...
                                    </td>
                                </tr>
                            ) : skillsList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        Không tìm thấy dữ liệu kỹ năng nào trên hệ thống.
                                    </td>
                                </tr>
                            ) : (
                                skillsList.map((skill) => (
                                    <tr key={skill.id}>
                                        <td># {skill.id}</td>
                                        <td>
                                            <span className="badge bg-light text-dark border px-3 py-2 fw-semibold">
                                                {skill.name}
                                            </span>
                                        </td>
                                        <td className="text-secondary small">{skill.createAt || 'Chưa rõ'}</td>
                                        <td>{skill.usage || '0 bài đăng'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-light text-warning border-light-subtle me-1"
                                                title="Chỉnh sửa"
                                                onClick={() => alert(`Sửa kỹ năng: ${skill.name}`)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-light text-danger border-light-subtle"
                                                title="Xóa"
                                                onClick={() => alert(`Xóa kỹ năng ID: ${skill.id}`)}
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

            {/* === 3. BOOTSTRAP MODAL FORM THÊM KỸ NĂNG === */}
            {showModal && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={() => !submitting && setShowModal(false)} // Click ra ngoài nền để đóng form (khi không submitting)
                    >
                        {/* modal-dialog-centered giúp căn giữa màn hình theo chiều dọc */}
                        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>

                                {/* Modal Header */}
                                <div className="modal-header border-bottom-0 pb-0">
                                    <h5 className="modal-title fw-bold text-dark">Thêm thẻ kỹ năng mới</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        disabled={submitting}
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>

                                {/* Form Wrapper */}
                                <form onSubmit={handleCreateSkillSubmit}>
                                    {/* Modal Body */}
                                    <div className="modal-body py-4">
                                        <div className="mb-2">
                                            <label className="form-label small fw-semibold text-secondary">
                                                Tên kỹ năng (Name)
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control text-dark border-secondary-subtle"
                                                placeholder="Ví dụ: C++, Python, AWS, React..."
                                                value={newSkillName}
                                                onChange={(e) => setNewSkillName(e.target.value)}
                                                disabled={submitting}
                                                autoFocus
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer border-top-0 pt-0">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light border fw-medium px-3"
                                            disabled={submitting}
                                            onClick={() => setShowModal(false)}
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-success fw-semibold px-4"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                "Xác nhận"
                                            )}
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>

                    {/* Lớp Backdrop làm mờ toàn cảnh phía sau*/}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
}

export default AdminSkills;