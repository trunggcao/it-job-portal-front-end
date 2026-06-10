import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext'; // Import hook useAuth
import apiService from '../../service/apiService';   // Import apiService của bạn
import './employer-company.css';

// 1. Import Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateCompany() {
    const totalSteps = 3;
    const [currentStep, setCurrentStep] = useState(1);
    const [validated, setValidated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái block button khi đang gửi API

    const navigate = useNavigate();
    const { user, refreshProfile } = useAuth(); // Lấy thông tin tài khoản và hàm làm mới profile

    // Quản lý tập trung toàn bộ các trường dữ liệu của Công ty
    const [formData, setFormData] = useState({
        companyName: '',
        website: '',
        address: '',
        logoUrl: '',
        description: ''
    });

    // Cập nhật giá trị khi người dùng nhập dữ liệu vào ô input/textarea
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý chuyển đổi qua lại giữa các bước đi và validate dữ liệu form
    const changeStep = (direction) => {
        if (direction === 1) {
            const currentStepElement = document.getElementById(`step-${currentStep}`);
            // Tìm tất cả các trường bắt buộc của bước hiện tại
            const requiredInputs = currentStepElement.querySelectorAll('input[required], textarea[required]');
            let isCurrentStepValid = true;

            requiredInputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.classList.add('is-invalid');
                    isCurrentStepValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });

            // Nếu thông tin của bước hiện tại không hợp lệ -> chặn lại không cho đi tiếp
            if (!isCurrentStepValid) {
                setValidated(true);
                return;
            }
        }

        // Đặt lại trạng thái validate ban đầu cho bước mới
        setValidated(false);
        const nextStep = currentStep + direction;

        if (nextStep > totalSteps) {
            submitData();
        } else {
            setCurrentStep(nextStep);
        }
    };

    // Gửi payload dữ liệu JSON lên hệ thống API Spring Boot thông qua apiService
    const submitData = async () => {
        // Đảm bảo user đã đăng nhập và có ID trước khi gửi
        if (!user || !user.id) {
            toast.warn("⚠️ Không tìm thấy thông tin tài khoản nhà tuyển dụng! Vui lòng đăng nhập lại.");
            return;
        }

        // Đóng gói dữ liệu formData kèm theo employerId lấy từ Context
        const payload = {
            ...formData,
            employerId: user.id
        };

        try {
            setIsSubmitting(true); // Khóa nút bấm, hiển thị trạng thái chờ

            // Gọi API tạo công ty từ dịch vụ apiService đã import
            const response = await apiService.createCompany(payload);

            // 2. Thay thế alert bằng toast thông báo thành công
            toast.success("Khởi tạo hồ sơ công ty thành công!", {
                position: "top-right",
                autoClose: 2000, // Đóng sau 2 giây
            });

            // Cập nhật lại dữ liệu Profile trong AuthContext để 
            await refreshProfile();

            // Đợi 2 giây cho người dùng kịp nhìn thấy Toast rồi mới điều hướng
            setTimeout(() => {
                navigate('/employer/dashboard');
            }, 2000);

        } catch (error) {
            console.error("Lỗi khi tạo công ty:", error);
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra trong quá trình kết nối dữ liệu!";

            // 3. Thay thế alert bằng toast thông báo thất bại
            toast.error("Thất bại: " + errorMsg, {
                position: "top-right",
                autoClose: 4000,
            });

            // Đưa người dùng quay về bước 3 để họ kiểm tra lại hoặc nhấn gửi lại
            setCurrentStep(totalSteps);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-company-body py-5">
            {/* 4. Thêm container để render danh sách Toast ở góc trên bên phải */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <div className="container">
                <div className="step-form-container mx-auto">

                    {/* Hộp thông báo cảnh báo ban đầu */}
                    <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center mb-4 bg-white" role="alert" style={{ borderLeft: '4px solid #ffc107' }}>
                        <i className="bi bi-exclamation-triangle-fill fs-4 me-3 text-warning"></i>
                        <div>
                            <strong className="text-dark">Tài khoản mới đăng nhập:</strong> Hệ thống nhận thấy bạn chưa có thông tin công ty quản lý. Vui lòng hoàn tất các bước đăng ký dưới đây để có thể bắt đầu đăng tin tuyển dụng.
                        </div>
                    </div>

                    {/* Thân Card chứa form nhập liệu nhiều bước */}
                    <div className="card border-0 shadow rounded-3 overflow-hidden">

                        {/* Phần đầu chứa thanh tiến trình động */}
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h4 className="fw-bold text-dark mb-4 text-center">Khởi tạo hồ sơ công ty</h4>

                            <div className="d-flex justify-content-between align-items-center position-relative mb-2">
                                <div className="position-absolute top-50 start-0 end-0 translate-middle-y bg-light" style={{ height: '4px', zIndex: 1 }}>
                                    <div
                                        id="progressBar"
                                        className="bg-primary"
                                        style={{
                                            height: '4px',
                                            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                                            transition: 'width 0.3s ease'
                                        }}
                                    ></div>
                                </div>

                                {/* Vòng tròn số 1 */}
                                <div className={`step-node ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} style={{ zIndex: 2 }}>
                                    {currentStep > 1 ? <i className="bi bi-check-lg"></i> : '1'}
                                </div>
                                {/* Vòng tròn số 2 */}
                                <div className={`step-node ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} style={{ zIndex: 2 }}>
                                    {currentStep > 2 ? <i className="bi bi-check-lg"></i> : '2'}
                                </div>
                                {/* Vòng tròn số 3 */}
                                <div className={`step-node ${currentStep === 3 ? 'active' : ''}`} style={{ zIndex: 2 }}>
                                    3
                                </div>
                            </div>

                            <div className="d-flex justify-content-between text-muted small px-1 mb-3">
                                <span className={`fw-medium ${currentStep === 1 ? 'text-primary' : ''}`}>Thông tin cơ bản</span>
                                <span className={`fw-medium ${currentStep === 2 ? 'text-primary' : ''}`}>Hình ảnh & Địa chỉ</span>
                                <span className={`fw-medium ${currentStep === 3 ? 'text-primary' : ''}`}>Mô tả chi tiết</span>
                            </div>
                        </div>

                        {/* Thân Form nhập liệu */}
                        <div className="card-body p-4 bg-white">
                            <form id="companyForm" className={validated ? 'was-validated' : ''} noValidate>

                                {/* BƯỚC 1: THÔNG TIN CƠ BẢN */}
                                <div className={`form-step ${currentStep === 1 ? 'active' : ''}`} id="step-1">
                                    <h5 className="fw-bold text-secondary mb-3">
                                        <i className="bi bi-info-circle me-2 text-primary"></i>Bước 1: Thông tin cơ bản
                                    </h5>

                                    <div className="mb-3">
                                        <label htmlFor="companyName" className="form-label small fw-bold text-dark">
                                            Tên công ty / Doanh nghiệp <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            id="companyName"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: Công ty Cổ phần Công nghệ ABC"
                                            required
                                        />
                                        <div className="invalid-feedback">Vui lòng nhập tên công ty.</div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="website" className="form-label small fw-bold text-dark">Địa chỉ Website công ty</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-muted"><i className="bi bi-globe"></i></span>
                                            <input
                                                type="text"
                                                className="form-control py-2"
                                                id="website"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                placeholder="www.abc.com"
                                            />
                                        </div>
                                        <div className="form-text text-muted">Không bắt buộc.</div>
                                    </div>
                                </div>

                                {/* BƯỚC 2: ĐỊNH VỊ & THƯƠNG HIỆU */}
                                <div className={`form-step ${currentStep === 2 ? 'active' : ''}`} id="step-2">
                                    <h5 className="fw-bold text-secondary mb-3">
                                        <i className="bi bi-geo-alt me-2 text-primary"></i>Bước 2: Định vị & Thương hiệu
                                    </h5>

                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label small fw-bold text-dark">
                                            Địa chỉ trụ sở chính <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Số nhà, tên đường, Quận/Huyện, Tỉnh/Thành phố"
                                            required
                                        />
                                        <div className="invalid-feedback">Vui lòng nhập địa chỉ công ty.</div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="logoUrl" className="form-label small fw-bold text-dark">Đường dẫn ảnh Logo (Logo URL)</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-muted"><i className="bi bi-image"></i></span>
                                            <input
                                                type="text"
                                                className="form-control py-2"
                                                id="logoUrl"
                                                name="logoUrl"
                                                value={formData.logoUrl}
                                                onChange={handleInputChange}
                                                placeholder="https://link-anh-logo.png"
                                            />
                                        </div>
                                        <div className="form-text text-muted">Dán link ảnh đại diện thương hiệu công ty.</div>
                                    </div>
                                </div>

                                {/* BƯỚC 3: GIỚI THIỆU DOANH NGHIỆP */}
                                <div className={`form-step ${currentStep === 3 ? 'active' : ''}`} id="step-3">
                                    <h5 className="fw-bold text-secondary mb-3">
                                        <i className="bi bi-card-text me-2 text-primary"></i>Bước 3: Giới thiệu doanh nghiệp
                                    </h5>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label small fw-bold text-dark">
                                            Mô tả ngắn gọn về công ty <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="5"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Chia sẻ về lĩnh vực hoạt động, văn hóa công ty, quy mô nhân sự để thu hút ứng viên..."
                                            required
                                        ></textarea>
                                        <div className="invalid-feedback">Vui lòng viết một vài dòng mô tả công ty.</div>
                                    </div>
                                </div>

                                {/* Thanh điều hướng các nút bấm cuối biểu mẫu */}
                                <div className="d-flex justify-content-between pt-4 mt-4 border-top">
                                    <button
                                        type="button"
                                        className={`btn btn-outline-secondary px-4 fw-medium ${currentStep === 1 || isSubmitting ? 'invisible' : 'visible'}`}
                                        onClick={() => changeStep(-1)}
                                        disabled={isSubmitting}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>Quay lại
                                    </button>

                                    <button
                                        type="button"
                                        className={`btn px-5 fw-bold ${currentStep === totalSteps ? 'btn-success' : 'btn-primary'}`}
                                        onClick={() => changeStep(1)}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang xử lý...
                                            </>
                                        ) : currentStep === totalSteps ? (
                                            <>Hoàn tất & Khởi tạo <i className="bi bi-check-circle-fill ms-2"></i></>
                                        ) : (
                                            <>Tiếp theo <i className="bi bi-arrow-right ms-2"></i></>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCompany;