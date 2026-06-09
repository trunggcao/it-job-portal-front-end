import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// Import apiService của bạn
import apiService from '../service/apiService';

function UpdateJob() {
    // useParams lấy chính xác jobId từ URL do thẻ <Link> truyền sang
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Khai báo state lưu danh sách gốc từ DB (Giống CreateJob)
    const [availableSkills, setAvailableSkills] = useState([]);

    // 2. Trạng thái Form (Đồng bộ hoàn toàn theo cấu trúc JSON kiểm thử)
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        salary: '',
        level: 'INTERN',
        description: '',
        selectedSkills: [], // Mảng chứa các object { id: ..., name: ... } được tích chọn
        typeJob: 'FULL_TIME',
        requirement: '',
        startDate: '', // Giữ lại ngày tạo ban đầu từ DB để tránh bị null backend
        endDate: '',
        companyId: 1,
        isActive: true // <-- MỚI: Thêm trường quản lý trạng thái ẩn/hiện bài viết
    });

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true); // Tấm khiên chặn UI khi đang chờ API nạp dữ liệu
    const [message, setMessage] = useState({ type: '', text: '' });

    // 3. Tự động tải danh sách Skill và Chi tiết Job khi vừa mở trang hoặc khi Reload (F5)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setFetchingData(true);
                setMessage({ type: '', text: '' });

                // Gọi đồng thời cả 2 API để tối ưu tốc độ phản hồi
                const [skillsResponse, jobResponse] = await Promise.all([
                    apiService.getAllSkills(),
                    apiService.getJobById(id) // Lấy thông tin bài đăng hiện tại theo ID
                ]);

                // Đổ dữ liệu vào danh sách checkbox gốc
                setAvailableSkills(skillsResponse.data || []);

                // Đọc dữ liệu chi tiết Job từ DB
                const currentJobFromDB = jobResponse.data || jobResponse;

                // Nạp dữ liệu cũ vào Form State để người dùng chỉnh sửa
                setFormData({
                    name: currentJobFromDB.name || '',
                    location: currentJobFromDB.location || '',
                    salary: currentJobFromDB.salary || '',
                    level: currentJobFromDB.level || 'INTERN',
                    description: currentJobFromDB.description || '',
                    requirement: currentJobFromDB.requirement || '',
                    typeJob: currentJobFromDB.typeJob || 'FULL_TIME',
                    startDate: currentJobFromDB.startDate || '',
                    endDate: currentJobFromDB.endDate || '',
                    companyId: currentJobFromDB.companyId || 1,
                    selectedSkills: currentJobFromDB.skills || [], // Đổ mảng các object skill cũ đang có vào state
                    isActive: currentJobFromDB.isActive !== undefined ? currentJobFromDB.isActive : true // <-- MỚI: Đồng bộ dữ liệu isActive từ DB
                });

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu cập nhật:", error);
                setMessage({ type: 'danger', text: '⚠️ Không thể tải thông tin bài đăng công việc hoặc danh sách kỹ năng!' });
            } finally {
                // Tắt màn hình chờ sau khi tất cả dữ liệu ĐÃ NẠP XONG vào Form State
                setFetchingData(false);
            }
        };

        if (id) {
            loadInitialData();
        }
    }, [id]); // Khi F5 reload trang -> id được nạp lại -> useEffect chạy lại để kéo data mới nhất

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Xử lý riêng biệt nếu sau này bạn muốn làm thêm switch/checkbox thay đổi isActive trực tiếp trên UI
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 4. Xử lý logic khi bấm Check/Uncheck từng ô kĩ năng (Giống hệt bên CreateJob)
    const handleSkillCheck = (skill) => {
        setFormData(prev => {
            const isChecked = prev.selectedSkills.some(s => s.id === skill.id);
            let updatedSkills = [];

            if (isChecked) {
                updatedSkills = prev.selectedSkills.filter(s => s.id !== skill.id);
            } else {
                updatedSkills = [...prev.selectedSkills, { id: skill.id, name: skill.name }];
            }

            return { ...prev, selectedSkills: updatedSkills };
        });
    };

    // 5. Xử lý khi nhấn nút Lưu cập nhật bài viết (Tích hợp API updateJob của bạn)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.selectedSkills.length === 0) {
            setMessage({ type: 'danger', text: '❌ Vui lòng chọn ít nhất một kỹ năng yêu cầu!' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        // Tạo jobDTO payload hoàn chỉnh tương thích 100% với Backend định dạng dữ liệu kiểm thử
        const jobDataPayload = {
            name: formData.name,
            location: formData.location,
            salary: formData.salary ? parseFloat(formData.salary) : 0.0,
            level: formData.level,
            description: formData.description,
            requirement: formData.requirement,
            typeJob: formData.typeJob,
            startDate: formData.startDate, // Giữ nguyên ngày tạo cũ từ DB
            endDate: formData.endDate,
            companyId: formData.companyId,
            isActive: formData.isActive, // <-- MỚI: Truyền dữ liệu động từ State thay vì ép cứng giá trị true
            skills: formData.selectedSkills.map(s => ({ id: s.id })) // Chuẩn hóa mảng skill chỉ gửi id lên theo cấu trúc rút gọn của Backend
        };

        try {
            // SỬ DỤNG CHÍNH XÁC HÀM UPDATEJOB CỦA BẠN TẠI ĐÂY
            // id tương ứng với jobId, jobDataPayload tương ứng với jobDTO
            await apiService.updateJob(id, jobDataPayload);

            setMessage({ type: 'success', text: '🎉 Cập nhật thông tin tuyển dụng thành công!' });

            setTimeout(() => {
                navigate('/employer/dashboard');
            }, 1500);
        } catch (error) {
            console.error("Lỗi khi cập nhật tin bài:", error);
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || '❌ Lỗi hệ thống, không thể cập nhật bài đăng!'
            });
        } finally {
            setLoading(false);
        }
    };

    // CHẶN GIAO DIỆN: Nếu đang kéo API, chỉ hiện loading spinner, hoàn toàn không render form để chống lỗi trống dữ liệu.
    if (fetchingData) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <div className="text-muted small">Đang tải thông tin bài đăng công việc...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            {/* TIÊU ĐỀ TRANG */}
            <div className="container mt-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <Link to="/employer/dashboard">
                        <button type="button" className="btn btn-outline-secondary btn-sm rounded-circle">
                            <i className="bi bi-arrow-left"></i>
                        </button>
                    </Link>
                    <h2 className="h4 fw-bold text-dark mb-0">Chỉnh sửa tin tuyển dụng (ID: #{id})</h2>
                </div>
            </div>

            {/* FORM CẬP NHẬT CHÍNH */}
            <div className="container pb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        {message.text && (
                            <div className={`alert alert-${message.type} border-0 shadow-sm mb-4`}>
                                {message.text}
                            </div>
                        )}

                        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                            <form onSubmit={handleSubmit}>

                                {/* PHẦN 1: THÔNG TIN VỊ TRÍ */}
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Tên vị trí công việc <span className="text-danger">*</span></label>
                                    <input type="text" name="name" className="form-control py-2" required value={formData.name} onChange={handleInputChange} />
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Địa điểm làm việc <span className="text-danger">*</span></label>
                                        <input type="text" name="location" className="form-control py-2" required value={formData.location} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Cấp bậc công việc <span className="text-danger">*</span></label>
                                        <select name="level" className="form-select py-2" required value={formData.level} onChange={handleInputChange}>
                                            <option value="INTERN">Intern</option>
                                            <option value="FRESHER">Fresher</option>
                                            <option value="JUNIOR">Junior</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Hình thức làm việc <span className="text-danger">*</span></label>
                                        <select name="typeJob" className="form-select py-2" required value={formData.typeJob} onChange={handleInputChange}>
                                            <option value="FULL_TIME">Full-time</option>
                                            <option value="PART_TIME">Part-time</option>
                                            <option value="REMOTE">Remote</option>
                                            <option value="HYBRID">Hybrid</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-secondary">Mức lương (vnđ)</label>
                                        <input type="number" name="salary" className="form-control py-2" value={formData.salary || ''} onChange={handleInputChange} placeholder="Để trống nếu thỏa thuận" />
                                    </div>
                                </div>

                                {/* PHẦN 2: CHỌN KỸ NĂNG TỪ DATABASE */}
                                <div className="form-section mt-4 border-top pt-3">
                                    <div className="text-primary fw-bold mb-3" style={{ fontSize: '1.1rem' }}>
                                        <i className="bi bi-tags-fill me-2"></i>2. Yêu cầu kỹ năng công nghệ<span className="text-danger">*</span>
                                    </div>

                                    <div className="card p-3 bg-light border-0 rounded-3">
                                        <div className="row g-2">
                                            {availableSkills.map((skill) => {
                                                const isChecked = formData.selectedSkills.some(s => s.id === skill.id);
                                                return (
                                                    <div key={skill.id} className="col-6 col-sm-4 col-md-3">
                                                        <div className={`form-check p-2 rounded border bg-white d-flex align-items-center gap-2 ${isChecked ? 'border-primary shadow-sm' : ''}`} style={{ cursor: 'pointer' }}>
                                                            <input
                                                                className="form-check-input ms-1 mt-0"
                                                                type="checkbox"
                                                                id={`skill-${skill.id}`}
                                                                checked={isChecked}
                                                                onChange={() => handleSkillCheck(skill)}
                                                            />
                                                            <label className="form-check-label text-dark small fw-medium text-truncate w-100" htmlFor={`skill-${skill.id}`} style={{ cursor: 'pointer' }}>
                                                                {skill.name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {availableSkills.length === 0 && (
                                                <div className="text-center text-muted small py-2">Không tìm thấy dữ liệu kỹ năng nào.</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-text small text-muted mt-2">
                                        Đã chọn: <span className="fw-bold text-primary">{formData.selectedSkills.map(s => s.name).join(', ') || 'Chưa chọn kĩ năng nào'}</span>
                                    </div>
                                </div>

                                {/* PHẦN 3: MÔ TẢ & YÊU CẦU CHI TIẾT */}
                                <div className="mb-3 mt-4">
                                    <label className="form-label small fw-bold text-secondary">Mô tả công việc <span className="text-danger">*</span></label>
                                    <textarea name="description" className="form-control" rows="4" required value={formData.description} onChange={handleInputChange} placeholder="Nhiệm vụ, công việc cần làm hàng ngày..."></textarea>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-secondary">Yêu cầu ứng viên <span className="text-danger">*</span></label>
                                    <textarea name="requirement" className="form-control" rows="4" required value={formData.requirement} onChange={handleInputChange} placeholder="Kinh nghiệm, học vấn, tư duy, công cụ cần thiết..."></textarea>
                                </div>

                                <div className="mb-4 col-md-6">
                                    <label className="form-label small fw-bold text-secondary">Hạn cuối tiếp nhận hồ sơ <span className="text-danger">*</span></label>
                                    <input type="date" name="endDate" className="form-control py-2" required value={formData.endDate} onChange={handleInputChange} />
                                </div>

                                {/* HÀNH ĐỘNG HỦY / LƯU THAY ĐỔI */}
                                <div className="d-flex justify-content-end gap-2 border-top pt-4">
                                    <Link to="/employer/dashboard" className="btn btn-outline-secondary px-4">Hủy bỏ</Link>
                                    <button type="submit" className="btn btn-warning text-dark px-5 fw-bold" disabled={loading}>
                                        {loading ? 'Đang lưu đổi...' : 'Lưu thay đổi'}
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

export default UpdateJob;