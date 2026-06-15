import React from 'react';

function AdminUsers() {
    const usersList = [
        { id: 1, fullName: 'Cao Quốc Trung', email: 'trungcaodev@gmail.com', role: 'ROLE_CANDIDATE', badgeClass: 'bg-primary-subtle text-primary' },
        { id: 2, fullName: 'Trần Văn B', email: 'recruiter.b@example.com', role: 'ROLE_RECRUITER', badgeClass: 'bg-success-subtle text-success' }
    ];

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
            `}</style>

            {/* === BẢNG DANH SÁCH USER === */}
            <div className="card table-card p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-people-fill text-primary me-2"></i>Danh sách người dùng
                    </h5>
                    <button className="btn btn-primary btn-sm fw-semibold px-3" onClick={() => alert('Chức năng thêm người dùng')}>
                        <i className="bi bi-plus-lg me-1"></i>Thêm User
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle border-light">
                        <thead className="table-light small text-secondary">
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Vai trò (Role)</th>
                                <th style={{ width: '120px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td className="fw-bold text-dark">{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.badgeClass} badge-role`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-light text-warning border-light-subtle me-1"
                                            title="Sửa"
                                            onClick={() => alert(`Sửa thông tin: ${user.fullName}`)}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;