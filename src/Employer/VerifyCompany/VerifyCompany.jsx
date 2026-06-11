import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Import cả cấu trúc hiển thị toast và CSS trực tiếp vào đây
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import apiService from '../../service/apiService';
import { useAuth } from '../../Auth/AuthContext';

function VerifyCompany() {
    // Trạng thái kiểm soát giao diện (Giao diện Danh sách hoặc Giao diện Form điền)
    const [isCreating, setIsCreating] = useState(false);

    // Các trạng thái quản lý Form giống cấu trúc CreateCompany
    const [validated, setValidated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Trạng thái lưu trữ danh sách lịch sử gửi yêu cầu xác thực
    const [historyRequests, setHistoryRequests] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const navigate = useNavigate();

    // Lấy thông tin user từ AuthContext 
    const { user } = useAuth();
    const companyId = user?.companyId;

    // Quản lý tập trung dữ liệu Form text (taxCode và chuỗi đường dẫn liên kết)
    const [formData, setFormData] = useState({
        taxCode: '',
        businessLicenseUrl: ''
    });

    // Tự động tải danh sách lịch sử khi có thông tin companyId
    useEffect(() => {
        fetchVerificationHistory();
    }, [companyId]);

    const fetchVerificationHistory = async () => {
        if (!companyId) {
            setIsLoadingHistory(false);
            return;
        }
        try {
            setIsLoadingHistory(true);
            const response = await apiService.getHistoryVerification(companyId);
            setHistoryRequests(response.data || response || []);
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử xác thực của công ty:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // Cập nhật giá trị chuỗi văn bản khi người dùng nhập dữ liệu vào ô input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm reset form sạch sẽ khi đóng/hủy form
    const resetForm = () => {
        setFormData({ taxCode: '', businessLicenseUrl: '' });
        setValidated(false);
        setIsCreating(false);
    };

    // Xử lý kiểm tra dữ liệu và gửi thẳng data dạng JSON lên API
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        if (!companyId) {
            toast.warning("⚠️ Không tìm thấy thông tin công ty liên kết với tài khoản này!");
            return;
        }

        try {
            setIsSubmitting(true);

            // Tạo đối tượng DTO đúng cấu trúc JSON backend yêu cầu với chuỗi URL người dùng điền vào
            const verificationDTO = {
                taxCode: formData.taxCode,
                businessLicenseUrl: formData.businessLicenseUrl,
                companyId: String(companyId),
                employerId: String(user?.id || '')
            };

            // Gọi API gửi JSON trực tiếp lên hệ thống backend
            await apiService.createVerificationRequest(verificationDTO);

            // Hiển thị thông báo thành công
            toast.success("🎉 Gửi hồ sơ xác minh thành công! Vui lòng chờ phê duyệt.", {
                autoClose: 3000
            });

            // Làm mới lại danh sách lịch sử sau khi gửi thành công
            await fetchVerificationHistory();
            // Quay về màn hình danh sách lịch sử
            resetForm();

        } catch (error) {
            console.error("Lỗi khi nộp hồ sơ xác thực:", error);
            const errorMsg = error.response?.data?.message || error.message || "Có lỗi xảy ra trong quá trình kết nối dữ liệu!";

            // Hiển thị thông báo thất bại
            toast.error("❌ Thất bại: " + errorMsg, {
                autoClose: 4000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm trả về màu sắc badge tương ứng với trạng thái
    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
            case 'SUCCESS':
                return <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded">Đã xác thực</span>;
            case 'REJECTED':
            case 'FAILED':
                return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded">Bị từ chối</span>;
            default:
                return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1.5 rounded">Chờ phê duyệt</span>;
        }
    };

    // Hàm định dạng ngày tháng sang tiếng Việt
    const formatDateTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="create-company-body py-5">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="container mt-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Link to="/employer/dashboard">
                            <button type="button" className="btn btn-outline-secondary btn-sm rounded-circle">
                                <i className="bi bi-arrow-left"></i>
                            </button>
                        </Link>
                        <h2 className="h4 fw-bold text-dark mb-0">Đăng tin tuyển dụng</h2>
                    </div>
                </div>
                {/* 1. MÀN HÌNH DANH SÁCH LỊCH SỬ REQUEST */}
                {!isCreating ? (
                    <div className="card border-0 shadow rounded-3 p-4 bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <div>
                                <h4 className="fw-bold text-dark mb-1">Lịch sử gửi yêu cầu xác thực</h4>
                                <p className="text-muted small mb-0">Theo dõi trạng thái và tiến độ phê duyệt hồ sơ pháp lý công ty của bạn.</p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary fw-bold px-4 d-flex align-items-center gap-2"
                                onClick={() => setIsCreating(true)}
                                disabled={!companyId}
                            >
                                <i className="bi bi-plus-lg"></i> Tạo yêu cầu mới
                            </button>
                        </div>

                        {isLoadingHistory ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-2" role="status"></div>
                                <div className="text-muted small">Đang tải lịch sử hồ sơ...</div>
                            </div>
                        ) : !companyId ? (
                            <div className="text-center py-5 bg-light rounded-3 border border-dashed">
                                <i className="bi bi-exclamation-triangle fs-1 text-warning"></i>
                                <h5 className="mt-3 fw-semibold text-secondary">Tài khoản chưa liên kết công ty</h5>
                                <p className="text-muted small px-4">Bạn cần tạo hoặc tham gia vào một công ty trước khi thực hiện xác thực.</p>
                            </div>
                        ) : historyRequests.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded-3 border border-dashed">
                                <i className="bi bi-folder-x fs-1 text-muted"></i>
                                <h5 className="mt-3 fw-semibold text-secondary">Chưa có yêu cầu xác thực nào</h5>
                                <p className="text-muted small px-4">Doanh nghiệp của bạn chưa thực hiện gửi thông tin xác minh tính pháp lý lên hệ thống.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle border-light">
                                    <thead className="table-light text-secondary small">
                                        <tr>
                                            <th scope="col" className="py-3 ps-3">Mã yêu cầu</th>
                                            <th scope="col" className="py-3 ps-3">Ngày gửi</th>
                                            <th scope="col" className="py-3 ps-3">Mã số thuế</th>
                                            <th scope="col" className="py-3">Tài liệu minh chứng</th>
                                            <th scope="col" className="py-3">Người gửi</th>
                                            <th scope="col" className="py-3 text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {historyRequests.map((req, index) => (
                                            <tr key={req.id || index}>
                                                <td className="fw-bold text-dark ps-3">#{req.id}</td>
                                                <td className="text-dark ps-3">{formatDateTime(req.createdAt)}</td>
                                                <td className="fw-bold text-dark ps-3">{req.taxCode}</td>
                                                <td>
                                                    <a href={req.businessLicenseUrl || req.fileUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none d-inline-flex align-items-center gap-1 text-primary fw-medium">
                                                        <i className="bi bi-link-45deg"></i> Xem liên kết
                                                    </a>
                                                </td>
                                                <td className="text-dark ps-3">{req.employerName}</td>
                                                <td className="text-center">{getStatusBadge(req.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    /* 2. MÀN HÌNH ĐIỀN DATA FORM */
                    <div className="step-form-container mx-auto" style={{ maxWidth: '700px' }}>
                        <div className="alert alert-info border-0 shadow-sm d-flex align-items-center mb-4 bg-white" role="alert" style={{ borderLeft: '4px solid #0dcaf0' }}>
                            <i className="bi bi-info-circle-fill fs-4 me-3 text-info"></i>
                            <div>
                                <strong className="text-dark">Quy trình xác thực:</strong> Vui lòng cung cấp chính xác mã số thuế và đính kèm đường dẫn liên kết đến Giấy phép đăng ký kinh doanh. Ban quản trị sẽ tiến hành phê duyệt hồ sơ của bạn trong vòng 24h làm việc.
                            </div>
                        </div>

                        <div className="card border-0 shadow rounded-3 overflow-hidden">
                            <div className="card-header bg-white border-0 pt-4 px-4 text-center">
                                <h4 className="fw-bold text-dark mb-1">Xác thực pháp lý doanh nghiệp</h4>
                                <p className="text-muted small mb-0">Hoàn thiện thông tin dưới đây để gửi yêu cầu chứng minh tính pháp lý tới hệ thống.</p>
                            </div>

                            <div className="card-body p-4 bg-white">
                                <form id="verifyForm" className={validated ? 'was-validated' : ''} onSubmit={handleSubmit} noValidate>

                                    {/* Ô NHẬP MÃ SỐ THUẾ */}
                                    <div className="mb-4">
                                        <label htmlFor="taxCode" className="form-label small fw-bold text-dark">
                                            Mã số thuế doanh nghiệp <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-muted"><i className="bi bi-shield-check"></i></span>
                                            <input
                                                type="text"
                                                className="form-control py-2"
                                                id="taxCode"
                                                name="taxCode"
                                                value={formData.taxCode}
                                                onChange={handleInputChange}
                                                placeholder="Nhập mã số thuế (10 hoặc 13 chữ số)"
                                                pattern="[0-9]{10,13}"
                                                required
                                            />
                                            <div className="invalid-feedback">Vui lòng nhập đúng định dạng mã số thuế (chỉ gồm từ 10 đến 13 chữ số).</div>
                                        </div>
                                    </div>

                                    {/* Ô NHẬP LINK ĐƯỜNG DẪN MINH CHỨNG */}
                                    <div className="mb-4">
                                        <label htmlFor="businessLicenseUrl" className="form-label small fw-bold text-dark">
                                            Đường dẫn Giấy phép đăng ký kinh doanh (URL tài liệu/hình ảnh trực tuyến) <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-muted"><i className="bi bi-link-45deg"></i></span>
                                            <input
                                                type="url"
                                                className="form-control py-2"
                                                id="businessLicenseUrl"
                                                name="businessLicenseUrl"
                                                value={formData.businessLicenseUrl}
                                                onChange={handleInputChange}
                                                placeholder="Ví dụ: https://example.com/gpkd.pdf hoặc link lưu trữ Driver/Cloud..."
                                                required
                                            />
                                            <div className="invalid-feedback">Vui lòng điền đúng định dạng đường dẫn liên kết hợp lệ (bắt đầu bằng http:// hoặc https://).</div>
                                        </div>
                                        <div className="form-text text-muted small">Vui lòng dán trực tiếp liên kết công khai dẫn tới ảnh scan hoặc file tài liệu minh chứng của bạn.</div>
                                    </div>

                                    {/* Khu vực nút bấm điều hướng */}
                                    <div className="d-flex justify-content-end pt-3 mt-3 border-top">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary px-4 fw-medium me-2"
                                            onClick={resetForm}
                                            disabled={isSubmitting}
                                        >
                                            Hủy bỏ
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-success px-5 fw-bold"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Đang gửi dữ liệu...
                                                </>
                                            ) : (
                                                <>
                                                    Gửi hồ sơ duyệt <i className="bi bi-send-fill ms-2"></i>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Đặt ToastContainer ở đây để quản lý hiển thị cục bộ cho trang này ở góc trên bên phải */}
            <ToastContainer position="top-right" hideProgressBar={false} newestOnTop={true} closeOnClick />
        </div>
    );
}

export default VerifyCompany;