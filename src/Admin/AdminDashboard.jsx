import React from 'react';

function AdminDashboard() {
    return (
        <div className="dashboard-page-container">
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
            `}</style>

            <div className="row g-3 mb-4">
                {/* Users Card */}
                <div className="col-md-4 col-lg-2.4 col-6">
                    <div className="card stat-card p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Users</span>
                                <h3 className="fw-bold m-0">1,240</h3>
                            </div>
                            <div className="fs-3 text-primary bg-primary-subtle rounded p-2 px-3">
                                <i className="bi bi-people"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Card */}
                <div className="col-md-4 col-lg-2.4 col-6">
                    <div className="card stat-card p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Skills</span>
                                <h3 className="fw-bold m-0">45</h3>
                            </div>
                            <div className="fs-3 text-success bg-success-subtle rounded p-2 px-3">
                                <i className="bi bi-tags"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs Card */}
                <div className="col-md-4 col-lg-2.4 col-6">
                    <div className="card stat-card p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Jobs</span>
                                <h3 className="fw-bold m-0">380</h3>
                            </div>
                            <div className="fs-3 text-warning bg-warning-subtle rounded p-2 px-3">
                                <i className="bi bi-briefcase"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Companies Card */}
                <div className="col-md-6 col-lg-2.4 col-6">
                    <div className="card stat-card p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Companies</span>
                                <h3 className="fw-bold m-0">120</h3>
                            </div>
                            <div className="fs-3 text-danger bg-danger-subtle rounded p-2 px-3">
                                <i className="bi bi-building"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-2.4 col-6">
                    <div className="card stat-card p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">CompanyVerifications</span>
                                <h3 className="fw-bold m-0">120</h3>
                            </div>
                            <div className="fs-3 text-danger bg-danger-subtle rounded p-2 px-3">
                                <i className="bi bi-building"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blogs Card */}
                <div className="col-md-6 col-lg-2.4 col-12">
                    <div className="card stat-card p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Blogs</span>
                                <h3 className="fw-bold m-0">86</h3>
                            </div>
                            <div className="fs-3 text-info bg-info-subtle rounded p-2 px-3">
                                <i className="bi bi-newspaper"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === THÔNG BÁO CHUNG HOẶC TRẠNG THÁI HỆ THỐNG === */}
            <div className="card border-0 p-4 rounded-3 shadow-sm bg-white">
                <h5 className="fw-bold text-dark mb-2">Chào mừng quay trở lại hệ thống quản trị!</h5>
                <p className="text-secondary mb-0">
                    Sử dụng thanh điều hướng bên trái để quản lý thông tin dữ liệu cho Cổng thông tin việc làm IT Portal.
                </p>
            </div>
        </div>
    );
}

export default AdminDashboard;