import React from 'react';

function AdminJobs() {
    const jobsList = [
        {
            id: '#JOB-88',
            position: 'Senior Java Web Developer',
            company: 'FPT Software',
            deadline: '30/06/2026',
            status: 'Đang hiển thị',
            badgeClass: 'bg-success-subtle text-success'
        }
    ];

    return (
        <div className="jobs-page-container">
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
                        <i className="bi bi-briefcase-fill text-warning me-2"></i>Kiểm soát tin tuyển dụng (Jobs)
                    </h5>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Tìm kiếm tin..."
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle border-light">
                        <thead className="table-light small text-secondary">
                            <tr>
                                <th>Mã tin</th>
                                <th>Vị trí</th>
                                <th>Công ty đăng</th>
                                <th>Hạn nộp</th>
                                <th>Trạng thái</th>
                                <th style={{ width: '120px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobsList.map((job, index) => (
                                <tr key={index}>
                                    <td>{job.id}</td>
                                    <td className="fw-medium text-dark">{job.position}</td>
                                    <td>{job.company}</td>
                                    <td>{job.deadline}</td>
                                    <td>
                                        <span className={`badge ${job.badgeClass} rounded-pill px-2.5 py-1.5 small`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-light text-primary border-light-subtle me-1"
                                            title="Khóa tin"
                                            onClick={() => alert(`Khóa tin: ${job.id}`)}
                                        >
                                            <i className="bi bi-eye-slash-fill"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-light text-danger border-light-subtle"
                                            title="Gỡ tin hoàn toàn"
                                            onClick={() => alert(`Xóa tin vĩnh viễn: ${job.id}`)}
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

export default AdminJobs;