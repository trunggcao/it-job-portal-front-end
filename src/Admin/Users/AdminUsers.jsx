import React, { useState, useEffect } from 'react';
import apiService from '../../service/apiService';
import { toast } from 'react-toastify';

function AdminUsers() {
    // === Các State Quản Lý Dữ Liệu ===
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    // State lưu ID của user đang trong quá trình xử lý gọi API chuyển đổi trạng thái
    const [isChangingStatus, setIsChangingStatus] = useState(null);

    // === Hàm Tải & Tìm Kiếm Danh Sách Người Dùng ===
    const fetchUsers = async (keyword = "") => {
        try {
            setLoading(true);
            const response = await apiService.getAllUsers(keyword);

            // Đảm bảo lấy đúng mảng dữ liệu tùy theo cấu trúc trả về của axiosClient
            setUsersList(response.data || response);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            const errorMsg = error.response?.data?.message || "Không thể kết nối dữ liệu người dùng!";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Tự động load danh sách người dùng khi mở trang lần đầu
    useEffect(() => {
        fetchUsers();
    }, []);

    // Xử lý khi Submit form Tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers(searchKeyword);
    };

    // === Hàm xử lý sự kiện Gạt Công Tắc Thay Đổi Trạng Thái ===
    const handleToggleActive = async (userId, currentStatus) => {
        const targetStatus = !currentStatus;
        try {
            // Đặt ID người dùng vào trạng thái đang xử lý (Khóa switch)
            setIsChangingStatus(userId);

            // Gọi API cập nhật trạng thái
            if (apiService.toggleUserStatus) {
                await apiService.toggleUserStatus(userId, targetStatus);
            }

            // Cập nhật local state trực tiếp để UI thay đổi mượt mà không cần re-fetch toàn bộ danh sách
            setUsersList(prevList =>
                prevList.map(user =>
                    user.id === userId ? { ...user, isActive: targetStatus } : user
                )
            );

            toast.success(`Đã ${targetStatus ? 'KÍCH HOẠT' : 'KHÓA'} tài khoản thành công!`);
        } catch (error) {
            console.error("Lỗi khi chuyển đổi trạng thái người dùng:", error);
            const errorMsg = error.response?.data?.message || "Không thể cập nhật trạng thái hệ thống!";
            toast.error(errorMsg);
        } finally {
            // Giải phóng trạng thái khóa
            setIsChangingStatus(null);
        }
    };

    // gán màu sắc Badge dựa theo tên Role từ DB
    const getBadgeClass = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return 'bg-danger-subtle text-danger';
            case 'ROLE_EMPLOYER':
                return 'bg-success-subtle text-success';
            case 'ROLE_CANDIDATE':
            default:
                return 'bg-primary-subtle text-primary';
        }
    };

    return (
        <div className="users-page-container">
            <style>{`
                .table-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }

                .badge-role {
                    font-size: 0.75rem;
                    padding: 5px 10px;
                }

                .search-input-group {
                    max-width: 380px;
                }

                /* Tùy chỉnh con trỏ hiển thị khi rê vào công tắc */
                .form-switch .form-check-input {
                    cursor: pointer;
                    width: 2.5em;
                    height: 1.25em;
                }
                .form-switch .form-check-input:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }
            `}</style>

            {/* === BẢNG DANH SÁCH USER === */}
            <div className="card table-card p-4 bg-white">

                {/* Thanh Tiêu Đề & Bộ Điều Hướng Tìm Kiếm */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-people-fill text-primary me-2"></i>Danh sách người dùng
                    </h5>

                    <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-md-end">
                        {/* Form Tìm Kiếm */}
                        <form onSubmit={handleSearchSubmit} className="search-input-group input-group input-group-sm w-100">
                            <input
                                type="text"
                                className="form-control px-3"
                                placeholder="Tìm theo tên hoặc email..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                style={{ borderRadius: '6px 0 0 6px' }}
                            />
                            <button className="btn btn-primary px-3" type="submit" disabled={loading}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                ) : (
                                    <><i className="bi bi-search me-1"></i> Tìm</>
                                )}
                            </button>
                        </form>

                        <button
                            className="btn btn-primary btn-sm fw-semibold px-3 text-nowrap"
                            style={{ height: '31px', borderRadius: '6px' }}
                            onClick={() => alert('Chức năng thêm người dùng')}
                        >
                            <i className="bi bi-plus-lg me-1"></i>Thêm User
                        </button>
                    </div>
                </div>

                {/* Bảng Dữ Liệu */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle border-light">
                        <thead className="table-light small text-secondary">
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Vai trò (Role)</th>
                                <th style={{ width: '160px' }}>Trạng thái</th>
                                <th style={{ width: '120px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-secondary">
                                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                        Đang tải dữ liệu người dùng...
                                    </td>
                                </tr>
                            ) : usersList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        Không tìm thấy thành viên nào phù hợp với từ khóa.
                                    </td>
                                </tr>
                            ) : (
                                usersList.map((user) => (
                                    <tr key={user.id}>
                                        <td className="text-secondary">#{user.id}</td>
                                        <td className="fw-bold text-dark">{user.fullName || user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${getBadgeClass(user.role)} badge-role`}>
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="form-check form-switch d-inline-flex align-items-center gap-2 m-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    id={`user-switch-${user.id}`}
                                                    checked={user.isActive === true}
                                                    disabled={isChangingStatus === user.id} // Vô hiệu hóa nút gạt tạm thời khi đang đợi API phản hồi
                                                    onChange={() => handleToggleActive(user.id, user.isActive)}
                                                />
                                                <label
                                                    className={`form-check-label small fw-semibold unselectable ${user.isActive ? 'text-success' : 'text-danger'}`}
                                                    htmlFor={`user-switch-${user.id}`}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {user.isActive ? 'Hoạt động' : 'Đang khóa'}
                                                </label>
                                            </div>
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-sm btn-light text-warning border-light-subtle me-1"
                                                title="Sửa"
                                                onClick={() => alert(`Sửa thông tin: ${user.fullName || user.name}`)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-light text-danger border-light-subtle"
                                                title="Xóa"
                                                onClick={() => alert(`Xóa người dùng ID: ${user.id}`)}
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
        </div>
    );
}

export default AdminUsers;