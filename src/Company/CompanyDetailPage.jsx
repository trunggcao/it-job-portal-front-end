import "./company.css";
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../service/apiService';

function CompanyDetailPage() {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [activeJobs, setActiveJobs] = useState([]); // Khai báo state lưu danh sách việc làm
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyAndJobsData = async () => {
            try {
                setLoading(true);

                // 1. Gọi API lấy chi tiết thông tin công ty
                const companyResponse = await apiService.getCompanyById(id);
                setCompany(companyResponse.data);

                // 2. Gọi API lấy danh sách việc làm theo ID công ty từ Backend
                const jobsResponse = await apiService.getJobsByCompanyId(id);
                setActiveJobs(jobsResponse.data || []);

                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu chi tiết công ty:", err);
                setError("Không thể tải thông tin công ty hoặc danh sách việc làm.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompanyAndJobsData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 small">Đang tải thông tin doanh nghiệp...</p>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="container my-5 py-5 text-center">
                <div className="alert alert-danger d-inline-block px-5 shadow-sm" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error || "Không tìm thấy dữ liệu"}
                </div>
                <div className="mt-3">
                    <Link to="/companies" className="btn btn-primary fw-semibold">
                        <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* COMPANY HEADER BANNER */}
            <div className="company-banner mb-4 bg-dark text-white py-4">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-auto">
                            <div className="company-logo-container bg-white p-2 rounded" style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                                <img
                                    src={company.logoUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80"}
                                    alt={`${company.companyName} Logo`}
                                    className="w-100 h-100 object-fit-contain"
                                />
                            </div>
                        </div>
                        <div className="col">
                            <h1 className="fw-bold mb-2 fs-2">{company.companyName}</h1>
                            <div className="d-flex flex-wrap gap-3 small mt-3">
                                <span className="d-flex align-items-center">
                                    <i className="bi bi-geo-alt-fill me-1.5 text-warning"></i>
                                    {company.address || "Chưa cập nhật địa chỉ"}
                                </span>
                                <span className="d-flex align-items-center">
                                    <i className="bi bi-globe me-1.5 text-info"></i>
                                    <a href={company.website || "#"} target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none hover-link">
                                        {company.website || "Chưa cập nhật website"}
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-auto text-lg-end w-100-mobile">
                            <button className="btn btn-warning fw-bold px-4 py-2">
                                <i className="bi bi-plus-lg me-1"></i> Theo dõi công ty
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB CONTENT & DETAILS */}
            <div className="container pb-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm mb-4 bg-white">
                            {/* Thanh chọn Tab điều hướng */}
                            <ul className="nav company-nav-tabs px-3 border-bottom" id="companyTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="about-tab" data-bs-toggle="tab"
                                        data-bs-target="#about-content" type="button" role="tab" aria-controls="about-content"
                                        aria-selected="true">
                                        <i className="bi bi-building me-1.5"></i>Giới thiệu công ty
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="jobs-tab" data-bs-toggle="tab" data-bs-target="#jobs-content"
                                        type="button" role="tab" aria-controls="jobs-content" aria-selected="false">
                                        <i className="bi bi-briefcase me-1.5"></i>Tuyển dụng ({activeJobs.length})
                                    </button>
                                </li>
                            </ul>

                            <div className="card-body p-4">
                                <div className="tab-content" id="companyTabContent">
                                    {/* TAB 1: GIỚI THIỆU CÔNG TY */}
                                    <div className="tab-pane fade show active" id="about-content" role="tabpanel" aria-labelledby="about-tab">
                                        <h5 className="fw-bold text-dark mb-3">Về chúng tôi</h5>
                                        <div className="text-secondary lh-lg" style={{ whiteSpace: 'pre-line' }}>
                                            {company.description || "Chưa có thông tin mô tả chi tiết từ doanh nghiệp."}
                                        </div>
                                    </div>

                                    {/* TAB 2: DANH SÁCH VIỆC LÀM ĐANG TUYỂN DỤNG */}
                                    <div className="tab-pane fade" id="jobs-content" role="tabpanel" aria-labelledby="jobs-tab">
                                        <h5 className="fw-bold text-dark mb-4">Các vị trí đang mở tuyển</h5>

                                        {activeJobs.length === 0 ? (
                                            <div className="text-center py-4 text-muted">
                                                <i className="bi bi-briefcase-x fs-2 mb-2 d-block"></i>
                                                Hiện tại công ty chưa đăng tuyển vị trí nào.
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                {activeJobs.map((job) => (
                                                    <div className="col-12" key={job.id}>
                                                        <div className="card p-3 job-item-card border-light-subtle shadow-sm-hover">
                                                            <div className="row align-items-center g-3">
                                                                <div className="col">
                                                                    <h6 className="fw-bold text-dark mb-1">
                                                                        <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark hover-primary fw-bold">
                                                                            {job.name} {/* Thay đổi thành job.name khớp JobDTO */}
                                                                        </Link>
                                                                    </h6>
                                                                    <div className="d-flex flex-wrap gap-3 text-muted small mt-2">
                                                                        <span><i className="bi bi-geo-alt me-1"></i> {job.location || company.address}</span>

                                                                        {/* Format tiền tệ VNĐ chuẩn */}
                                                                        <span className="text-danger fw-medium">
                                                                            <i className="bi bi-cash me-1 text-muted"></i>
                                                                            {typeof job.salary === 'number' && job.salary > 0
                                                                                ? `${new Intl.NumberFormat('vi-VN').format(job.salary)} vnđ`
                                                                                : "Thỏa thuận"}
                                                                        </span>

                                                                        <span> Cấp bậc: {job.level || "Intern"}</span>
                                                                    </div>

                                                                    {/* Hiển thị nhanh danh sách Kỹ năng yêu cầu nếu có */}
                                                                    {job.skills && job.skills.length > 0 && (
                                                                        <div className="mt-2 d-flex flex-wrap gap-1">
                                                                            {job.skills.map(skill => (
                                                                                <span key={skill.id} className="badge bg-light text-secondary border small">
                                                                                    {skill.name}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-md-auto text-md-end text-start border-start border-light-subtle ps-md-4">
                                                                    <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm px-4 rounded-pill fw-medium">
                                                                        Xem chi tiết
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDetailPage;