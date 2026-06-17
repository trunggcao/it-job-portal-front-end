import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../../service/apiService';

function AdminDetailCompanyVerification() {
    const { id } = useParams(); // ID của bản ghi xác thực (verification request ID)
    const navigate = useNavigate();

    // === State quản lý dữ liệu và trạng thái tải ===
    const [requestDetail, setRequestDetail] = useState(null);
    const [historyList, setHistoryList] = useState([]); // Lưu lịch sử duyệt
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // === State xử lý tương tác Từ chối ===
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleOpenDetail = (id) => {
        navigate(`/admin/companyverifications/${id}`);
    };

    // --- Hàm tải chi tiết hồ sơ và lịch sử từ API ---
    const fetchDetailData = async () => {
        try {
            setLoading(true);

            // 1. Lấy chi tiết hồ sơ hiện tại trước
            const detailResponse = await apiService.getVerificationRequestById(id);
            const detailData = detailResponse.data || detailResponse;
            setRequestDetail(detailData);

            // 2. LẤY THEO companyId ĐỂ GỌI API LỊCH SỬ
            // Lấy trực tiếp từ thuộc tính companyId 
            const companyId = detailData.companyId || (detailData.company && detailData.company.id);

            if (companyId && apiService.getHistoryVerification) {
                const historyResponse = await apiService.getHistoryVerification(companyId);
                const historyData = historyResponse.data || historyResponse;
                setHistoryList(Array.isArray(historyData) ? historyData : []);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu hệ thống:", error);
            toast.error("Không thể tải đầy đủ thông tin hồ sơ và lịch sử!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDetailData();
        }
    }, [id]);

    // --- Hàm xử lý phê duyệt hồ sơ ---
    const handleApprove = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn PHÊ DUYỆT cho doanh nghiệp này không?")) return;

        try {
            setActionLoading(true);
            await apiService.approveVerificationRequest(id);
            toast.success("Đã phê duyệt yêu cầu xác thực thành công!");
            fetchDetailData(); // Tải lại toàn bộ dữ liệu bao gồm cả lịch sử mới cập nhật
        } catch (error) {
            console.error("Lỗi phê duyệt hồ sơ:", error);
            toast.error(error.response?.data?.message || "Phê duyệt thất bại, vui lòng thử lại!");
        } finally {
            setActionLoading(false);
        }
    };

    // --- Hàm xử lý từ chối hồ sơ ---
    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.warning("Vui lòng nhập lý do từ chối hồ sơ!");
            return;
        }

        try {
            setActionLoading(true);
            if (apiService.rejectVerificationRequest) {
                await apiService.rejectVerificationRequest(id, { rejectReason: rejectReason });
            } else {
                throw new Error("Chưa cấu hình API từ chối yêu cầu trong apiService");
            }

            toast.success("Đã từ chối yêu cầu xác thực thành công!");
            setShowRejectInput(false);
            setRejectReason('');
            fetchDetailData(); // Tải lại dữ liệu và lịch sử
        } catch (error) {
            console.error("Lỗi khi từ chối hồ sơ:", error);
            toast.error(error.response?.data?.message || "Xử lý từ chối thất bại!");
        } finally {
            setActionLoading(false);
        }
    };

    // --- Định dạng màu sắc nhãn Trạng thái (Badge) ---
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="badge bg-warning text-dark px-2.5 py-1.5 fw-semibold">Đang chờ xử lý</span>;
            case 'APPROVED':
                return <span className="badge bg-success px-2.5 py-1.5 fw-semibold"><i className="bi bi-check-circle-fill me-1"></i>Đã duyệt</span>;
            case 'REJECTED':
                return <span className="badge bg-danger px-2.5 py-1.5 fw-semibold"><i className="bi bi-x-circle-fill me-1"></i>Từ chối</span>;
            default:
                return <span className="badge bg-secondary px-2.5 py-1.5">{status}</span>;
        }
    };

    // --- Giao diện Loading khi đang tải dữ liệu ban đầu ---
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary my-4" role="status"></div>
                <h5 className="text-secondary">Đang tải thông tin chi tiết và lịch sử...</h5>
            </div>
        );
    }

    // --- Giao diện khi không tìm thấy dữ liệu ---
    if (!requestDetail) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning py-4">
                    <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2"></i>
                    Không tìm thấy dữ liệu phù hợp hoặc hồ sơ không tồn tại.
                </div>
                <button className="btn btn-primary btn-sm px-4" onClick={() => window.close()}>
                    Đóng Tab này
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <style>{`
                .detail-card, .history-card {
                    border: none;
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
                }
                .document-preview-pane {
                    max-height: 600px;
                    overflow-y: auto;
                    border: 2px dashed #dee2e6;
                    border-radius: 12px;
                    background-color: #f8f9fa;
                }
                .info-group-title {
                    border-left: 4px solid #0d6efd;
                    padding-left: 10px;
                }
                .table-middle td {
                    vertical-align: middle;
                }
            `}</style>

            {/* Thanh điều hướng / Tiêu đề */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark m-0">Chi tiết hồ sơ minh chứng</h4>
                    <span className="text-muted small">Mã số hồ sơ hệ thống: #{requestDetail.id}</span>
                </div>
                <button className="btn btn-outline-secondary btn-sm px-3 fw-medium" onClick={() => window.close()}>
                    <i className="bi bi-x-lg me-1"></i>Đóng Tab
                </button>
            </div>

            {/* PHẦN I: KHỐI THÔNG TIN CHI TIẾT HỒ SƠ */}
            <div className="card detail-card p-4 bg-white mb-4">
                <div className="row g-4">

                    {/* KHỐI BÊN TRÁI: Hình ảnh giấy phép / minh chứng */}
                    <div className="col-lg-7 col-12">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label small fw-bold text-secondary m-0">
                                <i className="bi bi-image me-1"></i>Giấy phép kinh doanh / Minh chứng đính kèm
                            </label>
                            {requestDetail.businessLicenseUrl && (
                                <a
                                    href={requestDetail.businessLicenseUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-link btn-sm p-0 text-decoration-none"
                                >
                                    <i className="bi bi-box-arrow-up-right me-1"></i>Xem ảnh gốc
                                </a>
                            )}
                        </div>
                        <div className="document-preview-pane p-2 text-center d-flex align-items-center justify-content-center">
                            {requestDetail.businessLicenseUrl ? (
                                <img
                                    src={requestDetail.businessLicenseUrl}
                                    alt="Giấy phép kinh doanh chính thức"
                                    className="img-fluid rounded"
                                    style={{ maxWidth: '100%', maxHeight: '550px', objectFit: 'contain' }}
                                />
                            ) : (
                                <div className="text-muted p-5 small">
                                    <i className="bi bi-image-alt fs-1 d-block mb-2 text-black-50"></i>
                                    Không có hình ảnh đính kèm minh chứng từ doanh nghiệp
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KHỐI BÊN PHẢI: Chi tiết thông tin bằng chữ */}
                    <div className="col-lg-5 col-12 d-flex flex-column justify-content-between">
                        <div>
                            {/* Trạng thái duyệt */}
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary mb-2 d-block">Trạng thái phê duyệt hiện tại</label>
                                <div>
                                    {renderStatusBadge(requestDetail.status)}
                                </div>
                            </div>

                            {/* Chi tiết nội dung văn bản */}
                            <h6 className="fw-bold text-dark info-group-title mb-3">Thông tin doanh nghiệp</h6>
                            <div className="bg-light p-3 rounded-3 mb-4 text-secondary" style={{ fontSize: '0.95rem' }}>
                                <div className="mb-2.5 d-flex justify-content-between border-bottom pb-2">
                                    <strong>Mã hồ sơ:</strong>
                                    <span className="text-dark fw-medium">#{requestDetail.id}</span>
                                </div>
                                <div className="mb-2.5 d-flex justify-content-between border-bottom pb-2 pt-1">
                                    <strong>Mã số thuế:</strong>
                                    <span className="text-dark fw-medium">{requestDetail.taxCode || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="mb-2.5 d-flex justify-content-between border-bottom pb-2 pt-1">
                                    <strong>Doanh nghiệp:</strong>
                                    <span className="text-dark fw-medium text-end ms-3">{requestDetail.companyName}</span>
                                </div>
                                <div className="mb-2.5 d-flex justify-content-between border-bottom pb-2 pt-1">
                                    <strong>Người đại diện:</strong>
                                    <span className="text-dark fw-medium">{requestDetail.employerName || 'N/A'}</span>
                                </div>
                                <div className="mb-2.5 d-flex justify-content-between border-bottom pb-2 pt-1">
                                    <strong>Email liên hệ:</strong>
                                    <span className="text-primary fw-medium">{requestDetail.email}</span>
                                </div>
                                <div className="d-flex justify-content-between pt-1">
                                    <strong>Ngày gửi yêu cầu:</strong>
                                    <span className="text-dark fw-medium">{requestDetail.createdAt}</span>
                                </div>
                            </div>

                            {/* Hiển thị lý do từ chối nếu có sẵn */}
                            {requestDetail.status === 'REJECTED' && (requestDetail.rejectReason) && (
                                <div className="alert alert-danger border-0 small mb-4 shadow-sm">
                                    <strong className="d-block mb-1"><i className="bi bi-x-octagon-fill me-1"></i>Lý do từ chối trước đó:</strong>
                                    <span>{requestDetail.rejectReason}</span>
                                </div>
                            )}

                            {/* Giao diện nhập lý do từ chối */}
                            {showRejectInput && (
                                <div className="p-3 bg-danger-subtle rounded border border-danger-subtle mb-4">
                                    <label className="form-label text-danger fw-bold small">
                                        Lý do từ chối hồ sơ <span className="text-black-50">(Bắt buộc)</span>
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm mb-2"
                                        rows="3"
                                        placeholder="Nhập lý do chi tiết vì sao hồ sơ này không hợp lệ..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        disabled={actionLoading}
                                    ></textarea>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                                            disabled={actionLoading}
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger fw-semibold"
                                            onClick={handleReject}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* THANH HÀNH ĐỘNG DUYỆT / TỪ CHỐI DÀNH CHO ADMIN */}
                        <div className="mt-4 border-top pt-3">
                            {requestDetail.status === 'PENDING' && !showRejectInput ? (
                                <div className="d-flex gap-3">
                                    <button
                                        type="button"
                                        className="btn btn-success flex-grow-1 py-2 fw-bold shadow-sm"
                                        disabled={actionLoading}
                                        onClick={handleApprove}
                                    >
                                        <i className="bi bi-check-lg me-1"></i> Xác nhận Duyệt
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger px-4 py-2 fw-medium"
                                        disabled={actionLoading}
                                        onClick={() => setShowRejectInput(true)}
                                    >
                                        <i className="bi bi-x-lg me-1"></i> Từ chối
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center text-muted small bg-light p-2 rounded-2">
                                    <i className="bi bi-info-circle me-1"></i> Hồ sơ này đã hoàn tất xử lý và không thể thay đổi trạng thái.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* LỊCH SỬ DUYỆT CỦA DOANH NGHIỆP NÀY */}
            <div className="card history-card p-4 bg-white">
                <div className="border-bottom pb-2 mb-3">
                    <h5 className="fw-bold text-dark m-0">
                        <i className="bi bi-clock-history me-2 text-primary"></i>
                        Lịch sử yêu cầu & xác thực của doanh nghiệp {requestDetail.companyName}
                    </h5>
                    <p className="text-muted small m-0">Tất cả các lượt gửi yêu cầu trước đây của doanh nghiệp này</p>
                </div>

                {historyList.length === 0 ? (
                    <div className="text-center py-4 text-muted small">
                        <i className="bi bi-folder-x fs-2 d-block mb-2 text-black-50"></i>
                        Không có dữ liệu lịch sử yêu cầu nào khác cho doanh nghiệp này.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-striped table-middle align-middle border rounded-3 overflow-hidden text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
                            <thead className="table-light text-dark fw-semibold">
                                <tr>
                                    <th style={{ width: '90px' }}>Mã hồ sơ</th>
                                    <th>Mã số thuế</th>
                                    <th>Ngày tạo</th>
                                    <th style={{ width: '150px' }}>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyList.map((hist) => {
                                    // Kiểm tra xem dòng này có phải là hồ sơ đang xem hay không
                                    const isCurrentRecord = Number(hist.id) === Number(id);

                                    return (
                                        <tr
                                            key={hist.id}
                                            className={isCurrentRecord ? "table-warning" : ""}
                                            style={isCurrentRecord ? {
                                                backgroundColor: '#fff3cd',
                                                fontWeigh: '700',
                                                borderLeft: '5px solid #ffc107',
                                                color: '#212529'
                                            } : {}}
                                        >
                                            {/* Cột mã hồ sơ */}
                                            <td className={isCurrentRecord ? "fw-bold text-dark" : ""}>
                                                #{hist.id}
                                                {isCurrentRecord && (
                                                    <span className="badge bg-danger ms-1 small px-1.5 py-0.5 animate-pulse" style={{ fontSize: '0.65rem' }}>
                                                        <i className="bi bi-pin-angle-fill me-0.5"></i>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Cột mã số thuế */}
                                            <td className={isCurrentRecord ? "fw-bold text-dark" : "text-dark fw-semibold"}>
                                                {hist.taxCode || 'N/A'}
                                            </td>

                                            {/* Cột ngày tạo */}
                                            <td className={isCurrentRecord ? "fw-bold text-dark" : ""}>
                                                {hist.createdAt}
                                            </td>

                                            {/* Cột trạng thái */}
                                            <td>
                                                {renderStatusBadge(hist.status)}
                                            </td>

                                            {/* Cột hành động */}
                                            <td>
                                                <button
                                                    className={`btn btn-sm fw-semibold px-3 ${isCurrentRecord ? 'btn-dark' : 'btn-primary'}`}
                                                    title="Xem chi tiết tin"
                                                    onClick={() => handleOpenDetail(hist.id)}
                                                    disabled={isCurrentRecord} // Ngăn không cho admin bấm xem lại chính trang đang mở
                                                >
                                                    {isCurrentRecord ? (
                                                        <>
                                                            <i className="bi bi-eye-slash-fill me-1"></i>Đang xem
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-eye-fill me-1"></i>Xem chi tiết
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    )
}

export default AdminDetailCompanyVerification;