import React from 'react';

function AdminBlogs() {
    const blogsList = [
        {
            id: 1,
            title: 'Bí kíp vượt qua vòng phỏng vấn Intern/Fresher công nghệ năm 2026',
            author: 'Ban Biên Tập',
            date: '01/06/2026',
            views: '1,420 views'
        }
    ];

    return (
        <div className="blogs-page-container">
            <style>{`
                .table-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
            `}</style>

            <div className="card table-card p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-newspaper text-info me-2"></i>Quản lý bài viết (Blogs)
                    </h5>
                    <button
                        className="btn btn-info btn-sm text-white fw-semibold px-3"
                        onClick={() => alert('Chức năng soạn thảo bài viết mới')}
                    >
                        <i className="bi bi-plus-lg me-1"></i>Viết bài mới
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle border-light">
                        <thead className="table-light small text-secondary">
                            <tr>
                                <th>ID</th>
                                <th>Tiêu đề bài viết</th>
                                <th>Tác giả</th>
                                <th>Ngày đăng</th>
                                <th>Lượt xem</th>
                                <th style={{ width: '120px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogsList.map((blog) => (
                                <tr key={blog.id}>
                                    <td>{blog.id}</td>
                                    <td className="fw-medium text-dark">{blog.title}</td>
                                    <td>{blog.author}</td>
                                    <td>{blog.date}</td>
                                    <td>{blog.views}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-light text-warning border-light-subtle me-1"
                                            title="Sửa bài viết"
                                            onClick={() => alert(`Sửa bài viết: ${blog.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-light text-danger border-light-subtle"
                                            title="Xóa bài viết"
                                            onClick={() => alert(`Xóa bài viết ID: ${blog.id}`)}
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

export default AdminBlogs;