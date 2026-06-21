import React, { useState, useEffect } from 'react';
import apiService from '../../service/apiService';
import { useAuth } from '../../Auth/AuthContext';
import { toast } from 'react-toastify';

export default function CandidateProfile() {
    // --- 1. LẤY THÔNG TIN USER TỪ AUTH CONTEXT ---
    const { user, loading: authLoading } = useAuth();

    const [skillSearchQuery, setSkillSearchQuery] = useState('');

    // --- STATE HỒ SƠ TỪ SERVER ---
    const [profile, setProfile] = useState({
        title: '',
        yearsOfExperience: 0,
        isOpenToWork: false,
        skills: [],
        projects: []
    });

    // Danh sách tất cả kỹ năng hiển thị trong bộ chọn
    const [allSystemSkills, setAllSystemSkills] = useState([]);

    // --- STATE QUẢN LÝ TRẠNG THÁI UI PROFILE ---
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ title: '', yearsOfExperience: 0, isOpenToWork: false, skillIds: [] });

    // --- STATE QUẢN LÝ MODAL PROJECT---
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [isEditProjectMode, setIsEditProjectMode] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [projectForm, setProjectForm] = useState({
        projectName: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    // --- KIỂM TRA HỒ SƠ CÓ TRỐNG HAY KHÔNG ---
    const isProfileEmpty = !profile.title && (!profile.skills || profile.skills.length === 0);

    // --- 2. EFFECT TẢI DỮ LIỆU BAN ĐẦU ---
    useEffect(() => {
        if (!authLoading && user?.id) {
            fetchProfileData();
            fetchAllSkills();
        }
    }, [user, authLoading]);

    const fetchProfileData = async () => {
        try {
            const response = await apiService.getCandidateProfile(user.id);
            if (response && response.data) {
                const projectResponse = await apiService.getCandidateProjectsByUserId(user.id);
                setProfile({
                    ...response.data,
                    projects: projectResponse?.data || []
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin hồ sơ:", error);
            toast.warning('Không thể tải thông tin hồ sơ hoặc hồ sơ chưa được tạo.');
        }
    };

    const fetchAllSkills = async () => {
        try {
            const response = await apiService.getAllSkills();
            if (response && response.data) {
                setAllSystemSkills(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách kỹ năng:", error);
        }
    };

    // --- 3. EFFECT TÌM KIẾM SKILL ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (skillSearchQuery.trim() !== '') {
                apiService.searchSkills(skillSearchQuery)
                    .then(response => {
                        if (response && response.data) {
                            setAllSystemSkills(response.data);
                        }
                    })
                    .catch(error => console.error("Lỗi khi tìm kiếm kỹ năng:", error));
            } else {
                if (!authLoading && user?.id) {
                    fetchAllSkills();
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [skillSearchQuery, user, authLoading]);

    // --- LOGIC XỬ LÝ PROFILE ---
    const handleOpenEditProfile = () => {
        setProfileForm({
            title: profile.title || '',
            yearsOfExperience: profile.yearsOfExperience || 0,
            isOpenToWork: profile.isOpenToWork || false,
            skillIds: profile.skills ? profile.skills.map(s => s.id) : []
        });
        setIsEditingProfile(true);
    };

    const handleSkillCheckboxChange = (skillId) => {
        const updatedSkillIds = profileForm.skillIds.includes(skillId)
            ? profileForm.skillIds.filter(id => id !== skillId)
            : [...profileForm.skillIds, skillId];
        setProfileForm({ ...profileForm, skillIds: updatedSkillIds });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            toast.error('Lỗi: Không tìm thấy thông tin tài khoản người dùng!');
            return;
        }

        const skillsDTO = profileForm.skillIds.map(id => ({ id }));
        const profileDTO = {
            title: profileForm.title,
            yearsOfExperience: parseInt(profileForm.yearsOfExperience) || 0,
            isOpenToWork: profileForm.isOpenToWork,
            skills: skillsDTO
        };

        try {
            const response = await apiService.createOrSaveCandidateProfile(user.id, profileDTO);
            if (response) {
                toast.success('Khởi tạo/Cập nhật thông tin hồ sơ thành công!');
                setIsEditingProfile(false);
                fetchProfileData();
            }
        } catch (error) {
            console.error("Lỗi khi lưu hồ sơ:", error);
            toast.error('Lưu hồ sơ thất bại. Vui lòng kiểm tra lại dữ liệu!');
        }
    };

    // --- LOGIC THÊM, SỬA, XÓA DỰ ÁN ---
    const openAddProjectModal = () => {
        setIsEditProjectMode(false);
        setProjectForm({ projectName: '', startDate: '', endDate: '', description: '' });
        setShowProjectModal(true);
    };

    const openEditProjectModal = (project) => {
        setIsEditProjectMode(true);
        setSelectedProjectId(project.id);
        setProjectForm({
            projectName: project.projectName,
            startDate: project.startDate || '',
            endDate: project.endDate || '',
            description: project.description
        });
        setShowProjectModal(true);
    };

    const handleSaveProject = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            toast.error('Lỗi: Phiên đăng nhập không hợp lệ!');
            return;
        }

        // Kiểm tra logic ngày tháng cơ bản trước khi gửi lên API
        if (projectForm.startDate && projectForm.endDate && projectForm.startDate > projectForm.endDate) {
            toast.error('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
            return;
        }

        try {
            if (isEditProjectMode) {
                await apiService.updateCandidateProject(selectedProjectId, projectForm);
                toast.success('Cập nhật dự án thành công!');
            } else {
                await apiService.createCandidateProject(user.id, projectForm);
                toast.success('Thêm dự án mới thành công!');
            }
            setShowProjectModal(false);
            fetchProfileData();
        } catch (error) {
            console.error("Lỗi khi lưu dự án:", error);
            toast.error('Thao tác dự án thất bại. Vui lòng thử lại!');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
            try {
                await apiService.deleteCandidateProject(projectId);
                toast.success('Đã xóa dự án thành công!');
                fetchProfileData();
            } catch (error) {
                console.error("Lỗi khi xóa dự án:", error);
                toast.error('Xóa dự án thất bại!');
            }
        }
    };

    // --- GIAO DIỆN CHỜ XÁC THỰC ---
    if (authLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải thông tin tài khoản...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger shadow-sm rounded-4 d-inline-block px-5">
                    <i className="bi bi-exclamation-octagon-fill display-6 d-block mb-3"></i>
                    <h5>Vui lòng đăng nhập để xem hồ sơ cá nhân!</h5>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ maxWidth: '850px' }}>
            {/* BLOCK 1: THÔNG TIN HỒ SƠ TỔNG QUAN */}
            <div className="card shadow-sm border-0 mb-4 bg-white rounded">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="card-title fw-bold m-0 text-dark">
                            <i className="bi bi-person-lines-fill text-primary me-2"></i>Hồ Sơ Cá Nhân
                        </h4>
                        {!isEditingProfile && !isProfileEmpty && (
                            <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={handleOpenEditProfile}>
                                <i className="bi bi-pencil-square me-1"></i> Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {isEditingProfile ? (
                        <form onSubmit={handleSaveProfile}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Vị trí công việc (Title)</label>
                                <input type="text" className="form-control" value={profileForm.title} onChange={e => setProfileForm({ ...profileForm, title: e.target.value })} placeholder="Ví dụ: Senior Java Backend Developer" required />
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Số năm kinh nghiệm</label>
                                    <input type="number" className="form-control" min="0" value={profileForm.yearsOfExperience} onChange={e => setProfileForm({ ...profileForm, yearsOfExperience: e.target.value })} required />
                                </div>
                                <div className="col-md-6 d-flex align-items-end">
                                    <div className="p-3 bg-light rounded border w-100 d-flex align-items-center justify-content-between">
                                        <div>
                                            <label className="form-label fw-semibold mb-0 d-block">Trạng thái công việc</label>
                                            <small className={profileForm.isOpenToWork ? "text-success fw-bold" : "text-muted"}>
                                                {profileForm.isOpenToWork ? "● Đang bật Open To Work" : "○ Đang đóng tìm việc"}
                                            </small>
                                        </div>

                                        <label style={{ position: 'relative', display: 'inline-block', width: '54px', height: '28px', cursor: 'pointer', margin: 0 }}>
                                            <input
                                                type="checkbox"
                                                id="openToWorkSwitch"
                                                checked={profileForm.isOpenToWork}
                                                onChange={e => setProfileForm({ ...profileForm, isOpenToWork: e.target.checked })}
                                                style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span style={{
                                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: profileForm.isOpenToWork ? '#2ec4b6' : '#ccc',
                                                transition: 'all 0.3s ease', borderRadius: '34px'
                                            }}>
                                                <span style={{
                                                    position: 'absolute', height: '20px', width: '20px',
                                                    left: profileForm.isOpenToWork ? '29px' : '5px', bottom: '4px',
                                                    backgroundColor: 'white', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '50%'
                                                }}></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold d-flex justify-content-between align-items-center mb-2">
                                    <span>Chọn kỹ năng chuyên môn</span>
                                    <span className="badge bg-secondary-subtle text-dark border rounded-pill">
                                        Đã chọn: {profileForm.skillIds.length}
                                    </span>
                                </label>

                                <div className="input-group mb-3 shadow-sm rounded-pill overflow-hidden border">
                                    <span className="input-group-text bg-white border-0 pe-2">
                                        <i className="bi bi-search text-muted ps-2"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-0 ps-2 py-2"
                                        placeholder="Tìm nhanh kỹ năng từ hệ thống..."
                                        value={skillSearchQuery}
                                        onChange={e => setSkillSearchQuery(e.target.value)}
                                        style={{ fontSize: '0.9rem', boxShadow: 'none' }}
                                    />
                                    {skillSearchQuery && (
                                        <button type="button" className="btn bg-white border-0 text-muted pe-3" onClick={() => setSkillSearchQuery('')}>
                                            <i className="bi bi-x-circle-fill"></i>
                                        </button>
                                    )}
                                </div>

                                <div className="d-flex flex-wrap gap-2 bg-light p-3 rounded-4 border" style={{ minHeight: '60px' }}>
                                    {allSystemSkills.length > 0 ? (
                                        allSystemSkills.map(skill => {
                                            const isSelected = profileForm.skillIds.includes(skill.id);
                                            return (
                                                <button
                                                    key={skill.id}
                                                    type="button"
                                                    onClick={() => handleSkillCheckboxChange(skill.id)}
                                                    className="btn btn-sm d-flex align-items-center rounded-pill px-3 py-2 fw-medium transition-all"
                                                    style={{
                                                        backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                                                        color: isSelected ? '#4f46e5' : '#4b5563',
                                                        border: isSelected ? '1.5px solid #4f46e5' : '1.5px solid #e5e7eb',
                                                    }}
                                                >
                                                    {isSelected && <i className="bi bi-check2-circle me-1 fw-bold"></i>}
                                                    {skill.name}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center w-100 py-2 text-muted italic small">
                                            <i className="bi bi-patch-question me-1"></i> Không có kỹ năng tương ứng trên hệ thống
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex gap-2 justify-content-end">
                                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setIsEditingProfile(false)}>Hủy bỏ</button>
                                <button type="submit" className="btn btn-primary rounded-pill px-4">Lưu hồ sơ</button>
                            </div>
                        </form>
                    ) : isProfileEmpty ? (
                        <div className="text-center py-5 border rounded bg-light-subtle">
                            <div className="mb-3 text-warning">
                                <i className="bi bi-exclamation-triangle-fill display-5"></i>
                            </div>
                            <h5 className="fw-bold text-dark">Hồ sơ chưa hoàn thiện</h5>
                            <p className="text-muted px-4 mb-4" style={{ fontSize: '0.95rem' }}>
                                Hãy tạo hồ sơ cá nhân để sử dụng chức năng <strong className="text-success">OpenToWork</strong> giúp nhà tuyển dụng tìm thấy bạn dễ dàng hơn.
                            </p>
                            <button className="btn btn-primary rounded-pill px-4" onClick={handleOpenEditProfile}>
                                <i className="bi bi-plus-circle me-2"></i>Tạo hồ sơ ngay
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-2"><strong>Vị trí ứng tuyển:</strong> {profile.title}</div>
                            <div className="mb-2"><strong>Kinh nghiệm làm việc:</strong> {profile.yearsOfExperience} năm</div>
                            <div className="mb-3 d-flex align-items-center">
                                <strong>Trạng thái tìm việc:</strong>
                                {profile.isOpenToWork ? (
                                    <span className="badge bg-success ms-2 px-3 py-2 rounded-pill"><i className="bi bi-briefcase-fill me-1"></i> Open To Work</span>
                                ) : (
                                    <span className="badge bg-secondary ms-2 px-3 py-2 rounded-pill">Đang đóng tìm việc</span>
                                )}
                            </div>
                            <div className="mt-3">
                                <strong className="d-block mb-2">Kỹ năng chuyên môn:</strong>
                                <div className="d-flex flex-wrap gap-2">
                                    {profile.skills && profile.skills.map(skill => (
                                        <span key={skill.id} className="badge bg-light text-primary border border-primary px-3 py-2 rounded-pill fw-medium">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* BLOCK 2: QUẢN LÝ DANH SÁCH DỰ ÁN */}
            {!isProfileEmpty && (
                <div className="card shadow-sm border-0 bg-white rounded">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="card-title fw-bold m-0 text-dark">
                                <i className="bi bi-folder-symlink-fill text-success me-2"></i>Dự Án Đã Tham Gia
                            </h4>
                            <button className="btn btn-success btn-sm rounded-pill px-3" onClick={openAddProjectModal}>
                                <i className="bi bi-plus-circle me-1"></i> Thêm dự án
                            </button>
                        </div>

                        {profile.projects && profile.projects.length > 0 ? (
                            <div className="row g-3">
                                {profile.projects.map((project) => (
                                    <div key={project.id} className="col-12">
                                        <div className="p-3 rounded border bg-light position-relative">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h5 className="fw-bold text-dark mb-1">{project.projectName}</h5>
                                                    <span className="badge bg-secondary-subtle text-dark border px-2 py-1 rounded mb-2 d-inline-block small fw-normal">
                                                        <i className="bi bi-calendar3 me-1"></i>
                                                        {project.startDate || '...'} ~ {project.endDate || 'Hiện tại'}
                                                    </span>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    <button className="btn btn-sm btn-link text-primary p-1" onClick={() => openEditProjectModal(project)}>
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-link text-danger p-1" onClick={() => handleDeleteProject(project.id)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-muted small mb-0" style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-light rounded border border-dashed">
                                <i className="bi bi-folder2-open display-6 text-muted"></i>
                                <p className="text-muted mt-2 mb-0 small">Chưa có thông tin dự án nào.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL ĐIỀN THÔNG TIN DỰ ÁN */}
            {showProjectModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title fw-bold">
                                    {isEditProjectMode ? 'Cập Nhật Dự Án' : 'Thêm Dự Án Mới'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowProjectModal(false)}></button>
                            </div>
                            <form onSubmit={handleSaveProject}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Tên dự án</label>
                                        <input type="text" className="form-control" value={projectForm.projectName} onChange={e => setProjectForm({ ...projectForm, projectName: e.target.value })} placeholder="Nhập tên dự án" required />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Ngày bắt đầu</label>
                                            <input type="date" className="form-control" value={projectForm.startDate} onChange={e => setProjectForm({ ...projectForm, startDate: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Ngày kết thúc</label>
                                            <input type="date" className="form-control" value={projectForm.endDate} onChange={e => setProjectForm({ ...projectForm, endDate: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Mô tả chi tiết</label>
                                        <textarea className="form-control" rows="4" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Nhập mô tả chi tiết về dự án" required></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowProjectModal(false)}>Đóng</button>
                                    <button type="submit" className="btn btn-success rounded-pill px-4">Xác nhận</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}