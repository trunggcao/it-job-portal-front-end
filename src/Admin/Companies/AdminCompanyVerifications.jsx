import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiService from '../../service/apiService';

function AdminCompanyVerifications() {
    // === State quản lý dữ liệu gốc từ API ===
    const [requestsList, setRequestsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mặc định ban đầu chọn tab 'PENDING'
    const [filterStatus, setFilterStatus] = useState('PENDING');

    // --- Hàm tải danh sách yêu cầu xác thực từ API ---
    const fetchVerificationRequests = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAllVerificationRequests();
            const data = response.data || response;
            setRequestsList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách xác thực:", error);
            toast.error("Không thể lấy danh sách yêu cầu từ hệ thống!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerificationRequests();
    }, []);

    // --- HÀM XỬ LÝ MỞ TAB MỚI ---
    const handleOpenDetail = (id) => {
        const detailUrl = `/admin/companyverifications/${id}`;
        window.open(detailUrl, '_blank', 'noopener,noreferrer');
    };

    // Tính toán số lượng hồ sơ dựa vào dữ liệu thực tế
    const countByStatus = (status) => {
        if (status === 'ALL') return requestsList.length;
        return requestsList.filter(req => req.status === status).length;
    };

    // Lọc danh sách hiển thị trên Table theo Tab trạng thái đang chọn
    const filteredRequests = filterStatus === 'ALL'
        ? requestsList
        : requestsList.filter(req => req.status === filterStatus);

    return (
        <div className="verifications-page-container">
            <style>{`
                .stat-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                    transition: transform 0.2s;
                    cursor: pointer;
                }
                .stat-card:hover, .stat-card.active {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.08);
                }
                .stat-card.active-all { border-left: 4px solid #0d6efd; }
                .stat-card.active-pending { border-left: 4px solid #ffc107; }
                .stat-card.active-approved { border-left: 4px solid #198754; }
                .stat-card.active-rejected { border-left: 4px solid #dc3545; }
                
                .table-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
            `}</style>

            {/* === 1. THẺ THỐNG KÊ / CHUYỂN TAB === */}
            <div className="row g-3 mb-4">
                <div className="col-md-3 col-12" onClick={() => setFilterStatus('ALL')}>
                    <div className={`card stat-card p-3 bg-white ${filterStatus === 'ALL' ? 'active active-all' : ''}`}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Tất cả hồ sơ</span>
                                <h3 className="fw-bold m-0 text-primary">{loading ? "..." : countByStatus('ALL')}</h3>
                            </div>
                            <div className="fs-3 text-primary bg-primary-subtle rounded p-2 px-3">
                                <i className="bi bi-collection-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-12" onClick={() => setFilterStatus('PENDING')}>
                    <div className={`card stat-card p-3 bg-white ${filterStatus === 'PENDING' ? 'active active-pending' : ''}`}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Yêu cầu chờ duyệt</span>
                                <h3 className="fw-bold m-0 text-warning">{loading ? "..." : countByStatus('PENDING')}</h3>
                            </div>
                            <div className="fs-3 text-warning bg-warning-subtle rounded p-2 px-3">
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-6" onClick={() => setFilterStatus('APPROVED')}>
                    <div className={`card stat-card p-3 bg-white ${filterStatus === 'APPROVED' ? 'active active-approved' : ''}`}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Doanh nghiệp đã xác thực</span>
                                <h3 className="fw-bold m-0 text-success">{loading ? "..." : countByStatus('APPROVED')}</h3>
                            </div>
                            <div className="fs-3 text-success bg-success-subtle rounded p-2 px-3">
                                <i className="bi bi-patch-check-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-6" onClick={() => setFilterStatus('REJECTED')}>
                    <div className={`card stat-card p-3 bg-white ${filterStatus === 'REJECTED' ? 'active active-rejected' : ''}`}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small d-block mb-1">Yêu cầu bị từ chối</span>
                                <h3 className="fw-bold m-0 text-danger">{loading ? "..." : countByStatus('REJECTED')}</h3>
                            </div>
                            <div className="fs-3 text-danger bg-danger-subtle rounded p-2 px-3">
                                <i className="bi bi-x-octagon-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === 2. BẢNG HIỂN THỊ DANH SÁCH HỒ SƠ === */}
            <div className="card table-card p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-shield-check text-primary me-2"></i>
                        Hồ sơ: {
                            filterStatus === 'ALL' ? 'Tất cả danh sách' :
                                filterStatus === 'PENDING' ? 'Chờ kiểm duyệt' :
                                    filterStatus === 'APPROVED' ? 'Đã xác thực' : 'Đã từ chối'
                        }
                    </h5>
                    <span className="badge bg-light text-secondary border px-3 py-2 fw-medium">
                        Số lượng: {filteredRequests.length} hồ sơ
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle border-light">
                        <thead className="table-light small text-secondary">
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Tên doanh nghiệp</th>
                                <th>Email liên hệ</th>
                                <th>Thời gian yêu cầu</th>
                                {filterStatus === 'ALL' && <th style={{ width: '130px' }}>Trạng thái</th>}
                                <th style={{ width: '150px' }} className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={filterStatus === 'ALL' || filterStatus === 'REJECTED' ? "6" : "5"} className="text-center py-4 text-secondary">
                                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                        Đang tải dữ liệu hồ sơ từ hệ thống...
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={filterStatus === 'ALL' || filterStatus === 'REJECTED' ? "6" : "5"} className="text-center py-4 text-muted">
                                        Không tìm thấy yêu cầu xác thực nào trong phân mục này.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td className="fw-semibold">#{req.id}</td>
                                        <td>
                                            <div className="fw-semibold text-dark">{req.companyName || req.company?.name}</div>
                                        </td>
                                        <td className="text-secondary small">{req.email || req.company?.email}</td>
                                        <td className="text-secondary small">{req.createdAt}</td>

                                        {filterStatus === 'ALL' && (
                                            <td>
                                                {req.status === 'PENDING' && <span className="badge bg-warning text-dark">Chờ duyệt</span>}
                                                {req.status === 'APPROVED' && <span className="badge bg-success">Đã duyệt</span>}
                                                {req.status === 'REJECTED' && <span className="badge bg-danger">Từ chối</span>}
                                            </td>
                                        )}


                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-primary fw-semibold px-3"
                                                onClick={() => handleOpenDetail(req.id)}
                                            >
                                                <i className="bi bi-eye-fill me-1"></i>Xem chi tiết
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

export default AdminCompanyVerifications;