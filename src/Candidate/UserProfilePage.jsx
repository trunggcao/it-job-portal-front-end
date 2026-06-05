import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../service/apiService';

function UserProfilePage() {
    // 1. STATE QUẢN LÝ DỮ LIỆU THẬT
    const [profile, setProfile] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editFullName, setEditFullName] = useState('');

    // 2. CALL API THỰC TẾ
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Gọi đồng thời 2 API lấy thông tin Profile và danh sách đơn ứng tuyển
                const [profileRes, appliedRes] = await Promise.all([
                    apiService.getMyProfile(),
                    apiService.getMyAppliedJobs()
                ]);

                console.log("--- DEBUG API ĐĂNG NHẬP ---");
                console.log("1. Dữ liệu Profile cá nhân (profileRes):", profileRes);
                console.log("2. Dữ liệu Đơn ứng tuyển (appliedRes):", appliedRes);

                if (profileRes) {
                    let realProfileData = null;
                    if (profileRes.data && typeof profileRes.data === 'object') {
                        realProfileData = profileRes.data;
                    } else {
                        realProfileData = profileRes;
                    }

                    console.log("=> Dữ liệu Profile thực tế sau khi lọc:", realProfileData);

                    if (realProfileData) {
                        setProfile(realProfileData);
                        setEditFullName(realProfileData.fullName || '');
                    }
                }
                if (appliedRes) {
                    if (appliedRes.data && Array.isArray(appliedRes.data)) {
                        setAppliedJobs(appliedRes.data);
                    } else if (appliedRes.content && Array.isArray(appliedRes.content)) {
                        setAppliedJobs(appliedRes.content);
                    }
                    else if (Array.isArray(appliedRes)) {
                        setAppliedJobs(appliedRes);
                    }
                    else {
                        setAppliedJobs([]);
                    }
                }
            } catch (err) {
                console.error("Lỗi kết nối API:", err);
                setError("Không thể kết nối đến máy chủ hoặc phiên đăng nhập đã hết hạn.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // 3. HÀM XỬ LÝ LƯU THAY ĐỔI THÔNG TIN
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        // Bạn có thể viết thêm API PUT/POST để cập nhật fullName tại đây nếu cần
        alert(`Đang phát triển tính năng cập nhật cho: ${editFullName}`);
    };

    // Hàm phân loại màu sắc hiển thị Badge Trạng thái từ dữ liệu Spring Boot
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return (
                    <span className="badge bg-warning text-dark px-2.5 py-1.5 rounded-pill fw-semibold small">
                        <i className="bi bi-hourglass-split me-1"></i> Chờ duyệt
                    </span>
                );
            case 'APPROVED':
                return (
                    <span className="badge bg-success px-2.5 py-1.5 rounded-pill fw-semibold small">
                        <i className="bi bi-check-circle me-1"></i> Được nhận
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="badge bg-danger px-2.5 py-1.5 rounded-pill fw-semibold small">
                        <i className="bi bi-x-circle me-1"></i> Từ chối
                    </span>
                );
            default:
                return <span className="badge bg-secondary px-2.5 py-1.5 rounded-pill fw-semibold small">{status}</span>;
        }
    };

    // Trạng thái chờ tải dữ liệu
    if (loading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted small mt-2">Đang tải thông tin tài khoản...</p>
            </div>
        );
    }

    // Nếu xảy ra lỗi kết nối hệ thống
    if (error || !profile) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger shadow-sm text-center py-4 rounded-3">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-3 d-block mb-2"></i>
                    <h5 className="fw-bold">Đã xảy ra lỗi</h5>
                    <p className="small mb-0">{error || "Không tìm thấy dữ liệu hồ sơ cá nhân."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5 text-dark">
            <div className="row g-4">

                {/* CỘT BÊN TRÁI: AVATAR & THÔNG TIN CÁ NHÂN */}
                <div className="col-lg-4">
                    {/* Card tóm tắt thực tế */}
                    <div className="card border-0 shadow-sm p-4 text-center bg-white mb-4 rounded-3">
                        <div className="position-relative mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                                alt="Avatar"
                                className="w-100 h-100 object-fit-cover rounded-circle border border-4 border-white shadow-sm"
                            />
                            <label htmlFor="avatarFile" className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 border border-2 border-white shadow-sm cursor-pointer" style={{ fontSize: '0.85rem' }}>
                                <i className="bi bi-camera-fill"></i>
                            </label>
                            <input type="file" id="avatarFile" accept="image/*" className="d-none" />
                        </div>

                        <h4 className="fw-bold text-dark mb-1">{profile.fullName || "Chưa cập nhật họ tên"}</h4>
                        <p className="text-muted small mb-3">Tài khoản: {profile.role || "Ứng viên"}</p>
                        <div className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-medium small mb-2">
                            <i className="bi bi-shield-check me-1"></i> Đã xác thực Hệ thống
                        </div>
                    </div>

                    {/* Card Form Quản lý tài khoản */}
                    <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                        <h5 className="fw-bold text-dark mb-4 fs-6 border-bottom pb-2">
                            <i className="bi bi-gear-fill me-2 text-primary"></i>Sửa thông tin cá nhân
                        </h5>
                        <form onSubmit={handleSaveProfile}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Họ và tên</label>
                                <input
                                    type="text"
                                    className="form-control py-2 small"
                                    value={editFullName}
                                    onChange={(e) => setEditFullName(e.target.value)}
                                    placeholder="Nhập họ tên đầy đủ"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    className="form-control py-2 small bg-light text-muted"
                                    value={profile.email || ''}
                                    disabled
                                />
                                <div className="form-text small x-small text-muted">Email tài khoản không thể thay đổi.</div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control py-2 small bg-light text-muted"
                                    value="********"
                                    disabled
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2 fw-medium shadow-sm small">
                                <i className="bi bi-check-circle me-1"></i> Lưu thay đổi
                            </button>
                        </form>
                    </div>
                </div>

                {/* CỘT BÊN PHẢI: DANH SÁCH LỊCH SỬ ỨNG TUYỂN TỪ API */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h5 className="fw-bold text-dark mb-0">
                                <i className="bi bi-folder-symlink-fill me-2 text-primary"></i>Danh sách việc làm đã ứng tuyển
                            </h5>
                            <span className="badge bg-primary rounded-pill px-3 py-2">
                                Hồ sơ đã nộp: {appliedJobs.length}
                            </span>
                        </div>

                        {appliedJobs.length === 0 ? (
                            <div className="text-center py-5 text-secondary">
                                <i className="bi bi-file-earmark-x fs-1 d-block mb-3 text-muted"></i>
                                Bạn chưa nộp hồ sơ ứng tuyển vào vị trí nào trên hệ thống.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle border-light small mb-0">
                                    <thead className="table-light small fw-bold text-secondary text-uppercase">
                                        <tr>
                                            <th scope="col" className="ps-3">Vị trí ứng tuyển</th>
                                            <th scope="col">Công ty</th>
                                            <th scope="col">Ngày nộp</th>
                                            <th scope="col" className="text-center">Trạng thái</th>
                                            <th scope="col" className="text-end pe-3">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appliedJobs.map((item) => (
                                            <tr key={item.id}>
                                                <td className="ps-3">
                                                    <span className="fw-bold text-dark d-block mb-1">
                                                        {item.jobName || "Vị trí lập trình"}
                                                    </span>
                                                    <span className="text-muted small x-small">Mã: #{item.id}</span>
                                                </td>
                                                <td className="fw-medium text-secondary">{item.companyName || "N/A"}</td>
                                                <td className="text-muted small">
                                                    {item.createdAt ? item.createdAt.substring(0, 10) : "Vừa xong"}
                                                </td>
                                                <td className="text-center">
                                                    {renderStatusBadge(item.status)}
                                                </td>
                                                <td className="text-end pe-3">
                                                    <Link
                                                        to={`/jobs/${item.jobId || item.id}`}
                                                        className="btn btn-light btn-sm text-primary border-light-subtle"
                                                        title="Xem chi tiết công việc"
                                                    >
                                                        <i className="bi bi-eye-fill"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserProfilePage;