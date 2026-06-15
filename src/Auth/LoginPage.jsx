import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../service/apiService';

function LoginPage() {
    const navigate = useNavigate();

    // 1. STATE QUẢN LÝ FORM ĐĂNG NHẬP (Khớp với AuthDTO ở backend)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. LẮNG NGHE SỰ KIỆN GÕ PHÍM
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 3. XỬ LÝ SUBMIT FORM
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Gọi API đăng nhập từ apiService
            const response = await apiService.login(formData);

            // Backend trả về Map.of("token", token, "user", UserDTO)
            // Tùy thuộc vào cấu trúc bọc dữ liệu của axiosClient (thường là response hoặc response.data)
            const data = response.data || response;

            if (data && data.token) {
                // Lưu token vào localStorage để cấu hình trong axiosClient Authorization header
                localStorage.setItem("token", data.token);

                // Lưu thông tin user và role để ẩn/hiển thị giao diện ở Frontend
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("role", data.user.role); // "ROLE_CANDIDATE" hoặc "ROLE_EMPLOYER"

                // Điều hướng người dùng dựa trên vai trò (Role) sau khi đăng nhập thành công
                if (data.user.role === "ROLE_ADMIN") {
                    navigate('/admin/dashboard');
                }
                else if (data.user.role === "ROLE_EMPLOYER") {
                    navigate('/employer/dashboard'); // Trang quản lý của nhà tuyển dụng
                } else {
                    navigate('/jobs'); // Trang danh sách việc làm cho ứng viên
                }

                // Tải lại trang nhẹ để các component như Navbar cập nhật ngay trạng thái mới
                window.location.reload();
            }

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            // Hiển thị thông báo lỗi từ khối catch của backend ("Invalid email or password")
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Email hoặc mật khẩu không chính xác.");
            } else {
                setError("Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối mạng.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5" style={{ minHeight: '70vh' }}>
            <div className="row justify-content-center align-items-center h-100 pt-5">
                <div className="col-md-5 col-lg-4">
                    <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold text-dark mb-1">Đăng nhập</h3>
                            <p className="text-muted small">Chào mừng bạn quay trở lại với IT Job Portal</p>
                        </div>

                        {/* HIỂN THỊ THÔNG BÁO LỖI */}
                        {error && (
                            <div className="alert alert-danger small py-2 animate__animated animate__fadeIn" role="alert">
                                <i className="bi bi-exclamation-circle-fill me-2"></i> {error}
                            </div>
                        )}

                        {/* FORM ĐĂNG NHẬP */}
                        <form onSubmit={handleLoginSubmit}>
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

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label className="form-label small fw-medium text-secondary mb-0">Mật khẩu</label>
                                    <a href="#" className="text-decoration-none small text-muted">Quên mật khẩu?</a>
                                </div>
                                <input
                                    type="password"
                                    className="form-control form-control-sm text-dark"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
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
                                        Đang xác thực...
                                    </>
                                ) : "Đăng nhập"}
                            </button>

                            <div className="text-center small text-secondary mt-2">
                                Bạn chưa có tài khoản? <Link to="/register" className="text-primary text-decoration-none fw-medium">Đăng ký ngay</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;