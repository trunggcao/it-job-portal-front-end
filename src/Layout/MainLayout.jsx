import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './MainLayout.css';

function MainLayout() {
    const navigate = useNavigate();

    // 1. LẤY THÔNG TIN ĐĂNG NHẬP TỪ LOCALSTORAGE
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    // Ép kiểu chuỗi JSON từ localStorage về Object an toàn
    const currentUser = userRaw ? JSON.parse(userRaw) : null;

    // 2. HÀM XỬ LÝ ĐĂNG XUẤT
    const handleLogout = (e) => {
        e.preventDefault();

        // Xóa toàn bộ dữ liệu phiên làm việc cũ
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        // Điều hướng về trang chủ hoặc trang đăng nhập
        navigate('/login');

        // Tải lại trang nhẹ để cập nhật lại toàn bộ giao diện Header
        window.location.reload();
    };

    return (
        <div className="d-flex flex-column min-vh-100">

            <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-primary fs-3" to="/jobs">
                        <i className="bi bi-briefcase-fill me-2"></i>IT JobPortal
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto fw-medium">
                            <li className="nav-item">
                                <Link className="nav-link" to="/jobs">Trang chủ</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/jobs">Việc làm</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/companies">Công ty</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/blogs">Tin tức</Link>
                            </li>
                            {/* Chỉ hiển thị menu Hồ sơ / CV nếu tài khoản đăng nhập là Ứng viên */}
                            {currentUser && currentUser.role === 'ROLE_CANDIDATE' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Hồ sơ / CV</Link>
                                </li>
                            )}
                            {/* Thêm link quản trị nhanh nếu tài khoản đăng nhập là Nhà tuyển dụng */}
                            {currentUser && currentUser.role === 'ROLE_EMPLOYER' && (
                                <li className="nav-item">
                                    <Link className="nav-link nav-link-hot" to="/employer/dashboard">Quản lý tuyển dụng</Link>
                                </li>
                            )}
                            {currentUser && currentUser.role === 'ROLE_EMPLOYER' && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link nav-link-hot"
                                        to="/employer/find-candidates"
                                    >
                                        Tìm kiếm ứng viên
                                        <span className="badge bg-danger ms-2 badge-hot">
                                            HOT
                                        </span>
                                    </Link>
                                </li>
                            )}
                        </ul>

                        <div className="d-flex align-items-center gap-2">
                            {!token ? (
                                // === GIAO DIỆN KHI CHƯA ĐĂNG NHẬP ===
                                <>
                                    <Link to="/login" className="btn btn-outline-primary btn-sm fw-bold px-3">
                                        Đăng nhập
                                    </Link>
                                    <Link to="/register" className="btn btn-primary btn-sm fw-bold px-3">
                                        Đăng ký
                                    </Link>
                                </>
                            ) : (
                                // === GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP THÀNH CÔNG (CÓ DROPDOWN) ===
                                <div className="dropdown">
                                    <a
                                        className="d-flex align-items-center text-decoration-none dropdown-toggle text-dark fw-medium"
                                        href="#"
                                        role="button"
                                        id="userDropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <img
                                            src={currentUser?.profileImageUrl || "https://ui-avatars.com/api/?name=User"}
                                            alt="Avatar"
                                            className="rounded-circle me-2"
                                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                        />
                                        <span className="small text-truncate" style={{ maxWidth: '120px' }}>
                                            {currentUser?.fullName || "Tài khoản"}
                                        </span>
                                    </a>

                                    <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm mt-2" aria-labelledby="userDropdown">
                                        <li className="dropdown-header border-bottom pb-2 mb-1">
                                            <div className="fw-bold text-dark">{currentUser?.fullName}</div>
                                            <div className="small text-muted text-truncate" style={{ maxWidth: '180px' }}>{currentUser?.email}</div>
                                            <span className={`badge mt-1 ${currentUser?.role === 'ROLE_EMPLOYER' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                                                {currentUser?.role === 'ROLE_EMPLOYER' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                                            </span>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item small py-2 text-secondary" to="#">
                                                <i className="bi bi-person me-2"></i>Thông tin cá nhân
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item small py-2 text-secondary" to="#">
                                                <i className="bi bi-gear me-2"></i>Cài đặt tài khoản
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <a
                                                className="dropdown-item small py-2 text-danger fw-medium"
                                                href="#"
                                                onClick={handleLogout}
                                            >
                                                <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>


            <main className="flex-grow-1">
                <Outlet />
            </main>


            <footer className="bg-dark text-white pt-3 pb-2 border-top border-secondary">
                <div className="container text-center text-secondary small">
                    © 2026 IT Job Portal. Khám phá hàng ngàn cơ hội nâng tầm sự nghiệp.
                </div>
            </footer>
        </div>
    );
}

export default MainLayout;