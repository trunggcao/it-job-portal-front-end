import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../service/apiService';// Điều chỉnh đường dẫn chính xác của dự án bạn

function RegisterPage() {
    const navigate = useNavigate();

    // 1. STATE QUẢN LÝ DỮ LIỆU FORM (Khớp các trường với UserDTO ở backend)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'ROLE_CANDIDATE', // Mặc định là Ứng viên
        profileImageUrl: ''    // Có thể để trống hoặc điền ảnh mặc định
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // 2. LẮNG NGHE SỰ KIỆN GÕ PHÍM TRÊN CÁC INPUT
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 3. XỬ LÝ KHI SUBMIT FORM ĐĂNG KÝ
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Kiểm tra khớp mật khẩu ở phía Client trước
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu nhập lại không trùng khớp!");
            return;
        }

        try {
            setLoading(true);

            // Đóng gói dữ liệu chuẩn UserDTO để gửi sang Spring Boot
            const userDTO = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                profileImageUrl: formData.profileImageUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(formData.fullName)
            };

            // Gọi API
            await apiService.register(userDTO);

            setSuccessMessage("Đăng ký thành công! Hãy kiểm tra hòm thư Email để xác thực tài khoản.");

            // Làm sạch Form sau khi hoàn tất
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'ROLE_CANDIDATE',
                profileImageUrl: ''
            });

        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            if (err.response && err.response.data) {
                // Nhận thông báo lỗi từ phía Spring Boot trả về
                setError(err.response.data.message || "Đăng ký thất bại, vui lòng kiểm tra lại dữ liệu.");
            } else {
                setError("Có lỗi xảy ra khi kết nối đến máy chủ.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold text-dark mb-1">Tạo tài khoản mới</h3>
                            <p className="text-muted small">Cơ hội kết nối công việc mơ ước đang chờ bạn</p>
                        </div>

                        {/* HIỂN THỊ CÁC THÔNG BÁO TRẠNG THÁI */}
                        {error && (
                            <div className="alert alert-danger small py-2" role="alert">
                                <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert alert-success small py-2" role="alert">
                                <i className="bi bi-check-circle-fill me-2"></i>{successMessage}
                            </div>
                        )}

                        {/* FORM NHẬP LIỆU */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-medium text-secondary">Họ và tên</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm text-dark"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-medium text-secondary">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-sm text-dark"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-medium text-secondary">Bạn tham gia với tư cách</label>
                                <select
                                    className="form-select form-select-sm text-dark"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="ROLE_CANDIDATE">Ứng viên (Tìm việc làm)</option>
                                    <option value="ROLE_EMPLOYER">Nhà tuyển dụng (Đăng tuyển & Tìm nhân sự)</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-medium text-secondary">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control form-control-sm text-dark"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Tối thiểu 6 ký tự"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-medium text-secondary">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control form-control-sm text-dark"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Nhập lại mật khẩu phía trên"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 fw-bold py-2 mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xử lý đăng ký...
                                    </>
                                ) : "Đăng ký ngay"}
                            </button>

                            <div className="text-center small text-secondary">
                                Bạn đã có tài khoản rồi? <Link to="/login" className="text-primary text-decoration-none fw-medium">Đăng nhập</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;