import React, { useState, useEffect } from 'react';
import apiService from '../service/apiService';
import { Link } from 'react-router-dom';
import "./job.css"

function JobListPage() {
    // 1. KHAI BÁO CÁC STATE ĐỂ QUẢN LÝ DỮ LIỆU
    const [jobs, setJobs] = useState([]);          // Lưu danh sách công việc từ Backend
    const [loading, setLoading] = useState(true);    // Trạng thái đang tải dữ liệu
    const [error, setError] = useState(null);        // Lưu thông báo lỗi nếu có

    // 2. GỌI API KHI COMPONENT ĐƯỢC LOAD (MOUNTED)
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await apiService.getAllJobs();

                // Spring Boot Pageable thường trả về object dạng: response.data.content
                // Nếu Backend của bạn trả trực tiếp mảng, hãy đổi thành: response.data
                const data = response.data.content || response.data;

                setJobs(data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách công việc:", err);
                setError("Không thể kết nối đến máy chủ hoặc tải dữ liệu thất bại.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div>
            {/* SEARCH BAR SECTION */}
            <div className="bg-primary py-4 mb-4 shadow-sm">
                <div className="container">
                    <form className="row g-2" onSubmit={(e) => e.preventDefault()}>
                        <div className="col-md-7">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 py-2.5 shadow-none"
                                    placeholder="Nhập từ khóa tìm kiếm: Vị trí, kỹ năng (Java, Spring Boot, React)..."
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="bi bi-geo-alt"></i>
                                </span>
                                <select className="form-select border-start-0 py-2.5 text-secondary shadow-none" defaultValue="Tất cả địa điểm">
                                    <option>Tất cả địa điểm</option>
                                    <option value="HN">Hà Nội</option>
                                    <option value="HCM">TP. Hồ Chí Minh</option>
                                    <option value="DN">Đà Nẵng</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-warning text-dark fw-bold w-100 h-100 py-2.5">
                                <i className="bi bi-sliders me-1"></i> Tìm kiếm
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MAIN CONTENT BỐ CỤC 2 CỘT */}
            <div className="container pb-5">
                <div className="row g-4">

                    {/* SIDEBAR BỘ LỌC TRÁI */}
                    <div className="col-lg-3">
                        <div className="card filter-card p-4 bg-white sticky-top" style={{ top: '90px', zIndex: 10 }}>
                            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                <h5 className="fw-bold text-dark mb-0">
                                    <i className="bi bi-funnel-fill text-primary me-2"></i>Bộ lọc nâng cao
                                </h5>
                                <a href="#" className="small text-decoration-none">Xóa bộ lọc</a>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-dark mb-2">Hình thức làm việc</label>
                                <div className="form-check mb-2 small text-secondary">
                                    <input className="form-check-input" type="checkbox" id="ft" defaultChecked />
                                    <label className="form-check-label" htmlFor="ft">Toàn thời gian (Full-time)</label>
                                </div>
                                <div className="form-check mb-2 small text-secondary">
                                    <input className="form-check-input" type="checkbox" id="pt" />
                                    <label className="form-check-label" htmlFor="pt">Bán thời gian (Part-time)</label>
                                </div>
                                <div className="form-check mb-0 small text-secondary">
                                    <input className="form-check-input" type="checkbox" id="rm" />
                                    <label className="form-check-label" htmlFor="rm">Làm việc từ xa (Remote)</label>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-dark mb-2">Cấp bậc</label>
                                <div className="form-check mb-2 small text-secondary">
                                    <input className="form-check-input" type="checkbox" id="lvl1" />
                                    <label className="form-check-label" htmlFor="lvl1">Intern / Fresher</label>
                                </div>
                                <div className="form-check mb-2 small text-secondary">
                                    <input className="form-check-input" type="checkbox" id="lvl2" defaultChecked />
                                    <label className="form-check-label" htmlFor="lvl2">Junior / Senior</label>
                                </div>
                                <div className="form-check mb-0 small text-secondary">
                                    <input className="form-check-input" type="checkbox" id="lvl3" defaultChecked />
                                    <label className="form-check-label" htmlFor="lvl3">Manager / Leader</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: DANH SÁCH THẺ JOB DỰA TRÊN STATE */}
                    <div className="col-lg-9">
                        <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded-3 shadow-sm border border-light-subtle">
                            <span className="text-secondary small fw-medium">
                                Tìm thấy <strong className="text-primary">{jobs.length}</strong> việc làm công nghệ phù hợp
                            </span>
                        </div>

                        {/* HIỂN THỊ TRẠNG THÁI LOADING / BÁO LỖI / HOẶC ĐỔ DATA */}
                        {loading ? (
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted mt-2 small">Đang tải danh sách việc làm...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger shadow-sm small" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center bg-white p-5 rounded shadow-sm text-muted">
                                <i className="bi bi-search fs-2 d-block mb-2 text-secondary"></i>
                                Hiện tại chưa có việc làm nào được đăng tuyển.
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {/* VÒNG LẶP RENDER DANH SÁCH CÔNG VIỆC TỪ BACKEND */}
                                {jobs.map((job) => (
                                    <div className="card job-list-card p-4 bg-white border-0 shadow-sm" key={job.id}>
                                        <div className="row align-items-center g-3">
                                            <div className="col-auto">
                                                {/* Logo viết tắt từ tên công ty */}
                                                <div className="bg-primary-subtle text-primary company-logo-box rounded d-flex align-items-center justify-content-center fw-bold" style={{ width: '50px', height: '50px' }}>
                                                    {job.companyName ? job.companyName.substring(0, 2).toUpperCase() : 'IT'}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <h5 className="fw-bold mb-1 fs-5">
                                                    <a href="#" className="text-decoration-none text-dark hover-primary">
                                                        {job.title}
                                                    </a>
                                                </h5>
                                                <h6 className="text-secondary fw-semibold mb-2 small">{job.companyName || "Công ty công nghệ"}</h6>

                                                <div className="d-flex flex-wrap text-muted small mb-2">
                                                    <span className="me-3"><i className="bi bi-geo-alt me-1"></i> {job.location}</span>
                                                    <span className="me-3"><i className="bi bi-briefcase me-1"></i> {job.jobType || "Toàn thời gian"}</span>
                                                    <span><i className="bi bi-clock me-1"></i> {job.createdAt || "Vừa xong"}</span>
                                                </div>

                                                {/* Hiển thị danh sách kỹ năng nếu Backend trả về mảng chuỗi kỹ năng */}
                                                <div className="gap-1 d-flex flex-wrap">
                                                    {job.skills && job.skills.map((skill, index) => (
                                                        <span className="badge bg-light text-secondary border" key={index}>
                                                            {skill.name || skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-md-auto text-md-end text-start border-start border-light-subtle ps-md-4">
                                                <span className="text-danger fw-bold d-block mb-2 fs-5">
                                                    {typeof job.salary === 'number' ? `${job.salary} vnđ` : job.salary || "Thỏa thuận"}
                                                </span>
                                                <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm px-4 rounded-pill fw-medium">
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PHÂN TRANG TĨNH (TẠM THỜI) */}
                        <nav aria-label="Page navigation" className="mt-4">
                            <ul className="pagination justify-content-center shadow-sm d-inline-flex rounded-3 bg-white p-1">
                                <li className="page-item disabled"><a className="page-link border-0 rounded-2" href="#"><i className="bi bi-chevron-left"></i></a></li>
                                <li className="page-item active"><a className="page-link border-0 rounded-2" href="#">1</a></li>
                                <li className="page-item"><a className="page-link border-0 rounded-2" href="#">2</a></li>
                                <li className="page-item"><a className="page-link border-0 rounded-2" href="#"><i className="bi bi-chevron-right"></i></a></li>
                            </ul>
                        </nav>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default JobListPage;