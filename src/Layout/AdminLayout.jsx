import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // LẤY THÔNG TIN ĐĂNG NHẬP TỪ LOCALSTORAGE
    const userRaw = localStorage.getItem('user');
    const currentUser = userRaw ? JSON.parse(userRaw) : null;

    // HÀM XỬ LÝ ĐĂNG XUẤT
    const handleLogout = (e) => {
        e.preventDefault();

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        navigate('/login');
        window.location.reload();
    };

    // HÀM KIỂM TRA ROUTE ĐỂ ACTIVE MENU SIDEBAR
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="admin-container">
            {/* === SIDEBAR FIXED BÊN TRÁI === */}
            <div className="sidebar d-flex flex-column justify-content-between pb-3">
                <div>
                    <div className="p-4 text-center border-bottom border-secondary border-opacity-25">
                        <Link className="text-white fw-bold fs-4 text-decoration-none" to="/admin/dashboard">
                            IT Admin
                        </Link>
                    </div>

                    {/* Menu Điều Hướng */}
                    <div className="nav flex-column nav-pills mt-4">
                        <Link to="/admin/dashboard" className={`nav-link border-0 text-start ${isActive('/admin/dashboard')}`}>
                            <i className="bi bi-speedometer2"></i> Bảng điều khiển
                        </Link>
                        <Link to="/admin/users" className={`nav-link border-0 text-start ${isActive('/admin/users')}`}>
                            <i className="bi bi-people-fill"></i> Người dùng (User)
                        </Link>
                        <Link to="/admin/skills" className={`nav-link border-0 text-start ${isActive('/admin/skills')}`}>
                            <i className="bi bi-tags-fill"></i> Kỹ năng (Skill)
                        </Link>
                        <Link to="/admin/jobs" className={`nav-link border-0 text-start ${isActive('/admin/jobs')}`}>
                            <i className="bi bi-briefcase-fill"></i> Việc làm (Job)
                        </Link>
                        <Link to="/admin/companies" className={`nav-link border-0 text-start ${isActive('/admin/companies')}`}>
                            <i className="bi bi-building-fill"></i> Công ty (Company)
                        </Link>
                        <Link to="/admin/companyverifications" className={`nav-link border-0 text-start ${isActive('/admin/companyverifications')}`}>
                            <i className="bi bi-newspaper"></i> Xác thực công ty (Company Verification)
                        </Link>
                        <Link to="/admin/blogs" className={`nav-link border-0 text-start ${isActive('/admin/blogs')}`}>
                            <i className="bi bi-newspaper"></i> Bài viết (Blog)
                        </Link>
                    </div>
                </div>

                {/* Nút Đăng Xuất nằm ở đáy Sidebar */}
                <div className="px-3">
                    <hr className="text-secondary opacity-25" />
                    <div className="small text-muted mb-2 text-center text-truncate px-2">
                        {currentUser?.fullName || "Admin"}
                    </div>
                    <a href="#" onClick={handleLogout} className="btn btn-outline-danger w-100 btn-sm py-2 rounded-3 fw-medium">
                        <i className="bi bi-box-arrow-left me-2"></i>Đăng xuất
                    </a>
                </div>
            </div>

            {/* === PHẦN THÂN TRANG CHÍNH BÊN PHẢI (MAIN CONTENT WRAPPER) === */}
            <div className="main-wrapper">
                {/* Tiêu đề Header chung của Admin */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h3 fw-bold text-dark mb-1">Hệ Thống Quản Trị</h1>
                        <p className="text-secondary small mb-0">Xin chào Quản trị viên, cập nhật mới nhất vào hôm nay.</p>
                    </div>
                    <div className="bg-white p-2 rounded-3 shadow-sm px-3 small fw-semibold text-secondary">
                        <i className="bi bi-calendar3 text-primary me-2"></i>Năm hệ thống: 2026
                    </div>
                </div>

                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;