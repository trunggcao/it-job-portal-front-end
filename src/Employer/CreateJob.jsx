import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';

function CreateJob() {
    const navigate = useNavigate();

    // 1. Khai báo state lưu danh sách gốc từ DB
    const [availableSkills, setAvailableSkills] = useState([]);

    // 2. Trạng thái Form (Bỏ trường skillsInput cũ, thay bằng mảng chứa các object skill được chọn)
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        salary: '',
        level: 'INTERN',
        description: '',
        selectedSkills: [], // Mảng chứa các object { id: ..., name: ... } được tích chọn
        endDate: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetchingSkills, setFetchingSkills] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 3. Tự động tải danh sách Skill từ Database khi vừa mở trang lên
    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                setFetchingSkills(true);
                const response = await apiService.getAllSkills();
                // response.data thường là một mảng: [{id: 1, name: 'Java'}, {id: 2, name: 'React'}]
                setAvailableSkills(response.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách kỹ năng:", error);
                setMessage({ type: 'danger', text: '⚠️ Không thể tải danh sách kỹ năng từ hệ thống!' });
            } finally {
                setFetchingSkills(false);
            }
        };
        fetchSkillsData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 4. Xử lý logic khi bấm Check/Uncheck từng ô kĩ năng
    const handleSkillCheck = (skill) => {
        setFormData(prev => {
            const isChecked = prev.selectedSkills.some(s => s.id === skill.id);
            let updatedSkills = [];

            if (isChecked) {
                // Nếu đã chọn rồi -> Click lại thì loại bỏ ra khỏi mảng
                updatedSkills = prev.selectedSkills.filter(s => s.id !== skill.id);
            } else {
                // Nếu chưa chọn -> Thêm nguyên cả đối tượng vào mảng (gồm cả ID và Name)
                updatedSkills = [...prev.selectedSkills, { id: skill.id, name: skill.name }];
            }

            return { ...prev, selectedSkills: updatedSkills };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.selectedSkills.length === 0) {
            setMessage({ type: 'danger', text: '❌ Vui lòng chọn ít nhất một kỹ năng yêu cầu!' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        // Gửi dữ liệu khớp chính xác 100% cấu trúc JobDTO của bạn
        const jobDataPayload = {
            name: formData.name,
            location: formData.location,
            salary: formData.salary ? parseFloat(formData.salary) : 0.0,
            level: formData.level,
            description: formData.description,
            startDate: new Date().toISOString().split('T')[0],
            endDate: formData.endDate,
            isActive: true,
            companyId: 1, // Thay bằng ID thực tế của User/Company đăng nhập
            skills: formData.selectedSkills // Truyền mảng dạng [{id: 1, name: 'Java'}, ...] khớp hoàn toàn với Backend nhận diện
        };

        try {
            await apiService.createJob(jobDataPayload);
            setMessage({ type: 'success', text: '🎉 Đăng tin tuyển dụng mới thành công!' });

            setTimeout(() => {
                navigate('/employer/dashboard');
            }, 1500);
        } catch (error) {
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || '❌ Lỗi hệ thống, không thể đăng bài!'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            <div className="container mt-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <Link to="/employer/dashboard">
                        <button type="button" className="btn btn-outline-secondary btn-sm rounded-circle">
                            <i className="bi bi-arrow-left"></i>
                        </button>
                    </Link>
                    <h2 className="h4 fw-bold text-dark mb-0">Đăng tin tuyển dụng công nghệ mới</h2>
                </div>
            </div>

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

                                <div className="mb-4 col-md-6">
                                    <label className="form-label small fw-bold text-secondary">Mức lương (vnđ)</label>
                                    <input type="number" name="salary" className="form-control py-2" value={formData.salary} onChange={handleInputChange} />
                                </div>

                                {/* PHẦN 2: THAY ĐỔI Ô CHỌN KỸ NĂNG TỪ DATABASE */}
                                <div className="form-section mt-4 border-top pt-3">
                                    <div className="text-primary fw-bold mb-3" style={{ fontSize: '1.1rem' }}>
                                        <i className="bi bi-tags-fill me-2"></i>2. Yêu cầu kỹ năng<span className="text-danger">*</span>
                                    </div>

                                    {fetchingSkills ? (
                                        <div className="text-muted small py-2">
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Đang tải danh sách kỹ năng từ dữ liệu...
                                        </div>
                                    ) : (
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
                                    )}
                                    <div className="form-text small text-muted mt-2">
                                        Đã chọn: <span className="fw-bold text-primary">{formData.selectedSkills.map(s => s.name).join(', ') || 'Chưa chọn kĩ năng nào'}</span>
                                    </div>
                                </div>

                                {/* PHẦN 3: MÔ TẢ CÔNG VIỆC */}
                                <div className="mb-4 mt-4">
                                    <label className="form-label small fw-bold text-secondary">Mô tả công việc <span className="text-danger">*</span></label>
                                    <textarea name="description" className="form-control" rows="6" required value={formData.description} onChange={handleInputChange}></textarea>
                                </div>

                                <div className="mb-4 col-md-6">
                                    <label className="form-label small fw-bold text-secondary">Hạn cuối tiếp nhận hồ sơ <span className="text-danger">*</span></label>
                                    <input type="date" name="endDate" className="form-control py-2" required value={formData.endDate} onChange={handleInputChange} />
                                </div>

                                <div className="d-flex justify-content-end gap-2 border-top pt-4">
                                    <Link to="/employer/dashboard" className="btn btn-outline-secondary px-4">Hủy bỏ</Link>
                                    <button type="submit" className="btn btn-primary px-5 fw-bold" disabled={loading || fetchingSkills}>
                                        {loading ? 'Đang đăng tin...' : 'Xuất bản bài đăng'}
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

export default CreateJob;