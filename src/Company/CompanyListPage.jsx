import React, { useEffect, useState } from 'react';
import apiService from '../service/apiService'; // Điều chỉnh đường dẫn phù hợp với project của bạn

function CompanyListPage() {
    // 1. KHAI BÁO CÁC STATE
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State phục vụ việc tìm kiếm
    const [searchKeyword, setSearchKeyword] = useState("");
    const [query, setQuery] = useState(""); // Lưu giá trị thực tế khi bấm nút "Tìm công ty"

    // 2. HÀM GỌI API LẤY DANH SÁCH CÔNG TY
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                // Truyền từ khóa tìm kiếm (nếu có) vào API
                const response = await apiService.getAllCompanies(query);

                // Giả định backend trả về mảng dữ liệu nằm ở response.data
                setCompanies(response.data || []);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải danh sách công ty:", err);
                setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [query]); // Mỗi khi 'query' thay đổi, useEffect này sẽ tự động chạy lại

    // 3. XỬ LÝ SỰ KIỆN KHI BẤM SUBMIT FORM TÌM KIẾM
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setQuery(searchKeyword); // Cập nhật query để kích hoạt useEffect gọi lại API
    };

    return (
        <div>
            {/* BANNER & SEARCH SECTION */}
            <div className="bg-dark py-5 mb-5 text-white">
                <div className="container text-center">
                    <h2 className="fw-bold mb-3">Khám phá hơn 100+ Công ty Công nghệ Hàng đầu</h2>
                    <p className="text-white-50 small mb-4">
                        Tra cứu môi trường làm việc, chế độ đãi ngộ và tìm kiếm những cơ hội bứt phá sự nghiệp.
                    </p>

                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <form className="row g-2 bg-white p-2 rounded-3 shadow" onSubmit={handleSearchSubmit}>
                                <div className="col-md-8">
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-0 text-muted">
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-0 shadow-none text-dark"
                                            placeholder="Nhập tên công ty cần tìm..."
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                                        <i className="bi bi-search me-1"></i> Tìm công ty
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT SECTION */}
            <div className="container pb-5">

                {/* Tiêu đề hiển thị số lượng kết quả */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="text-secondary small fw-medium">
                        Hiển thị danh sách <strong className="text-primary">{companies.length < 10 ? `0${companies.length}` : companies.length}</strong> doanh nghiệp nổi bật
                    </span>
                </div>

                {/* XỬ LÝ KHU VỰC HIỂN THỊ LOGIC: LOADING / ERROR / DATA */}
                {loading ? (
                    <div className="text-center my-5 py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="text-muted mt-2 small">Đang tải danh sách doanh nghiệp...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger text-center shadow-sm" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                    </div>
                ) : companies.length === 0 ? (
                    <div className="text-center my-5 py-5 text-muted">
                        <i className="bi bi-building-x fs-1 mb-2"></i>
                        <p>Không tìm thấy công ty nào phù hợp với từ khóa của bạn.</p>
                    </div>
                ) : (
                    /* RENDER DANH SÁCH CÔNG TY BẰNG VÒNG LẶP .MAP() */
                    <div className="row g-4">
                        {companies.map((company) => (
                            <div className="col-md-6 col-lg-4" key={company.id || company._id}>
                                <div className="card company-card p-4 d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div className="logo-wrapper" style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '8px' }}>
                                                <img
                                                    src={company.logoUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80"}
                                                    alt={`${company.companyName} Logo`}
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold text-dark mb-1 fs-6 text-truncate" style={{ maxWidth: '200px' }}>
                                                    {company.companyName}
                                                </h5>
                                                <a
                                                    href={company.website || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary small text-decoration-none text-truncate d-block"
                                                    style={{ maxWidth: '200px' }}
                                                >
                                                    <i className="bi bi-link-45deg"></i> {company.website ? company.website.replace(/https?:\/\/(www\.)?/, '') : 'Chưa cập nhật'}
                                                </a>
                                            </div>
                                        </div>

                                        <p
                                            className="text-secondary small lh-base mb-3"
                                            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '4.5em' }}
                                        >
                                            {company.description || "Chưa có thông tin mô tả chi tiết về doanh nghiệp này."}
                                        </p>

                                        <div className="text-muted small mb-2 text-truncate">
                                            <i className="bi bi-geo-alt me-1"></i> {company.address || "Chưa cập nhật địa chỉ"}
                                        </div>
                                    </div>

                                    <div className="border-top pt-3 mt-2 d-flex justify-content-between align-items-center">
                                        <span className={`badge rounded-pill fw-medium small ${company.activeJobsCount > 0 ? 'bg-primary-subtle text-primary' : 'bg-secondary-subtle text-secondary'}`}>
                                            {company.activeJobsCount || 0} việc làm đang tuyển
                                        </span>
                                        <a href={`/companies/${company.id}`} className="btn btn-outline-primary btn-sm px-3 fw-semibold">
                                            Chi tiết
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* BỘ PHÂN TRANG (PAGINATION STUB) */}
                <nav aria-label="Page navigation" className="mt-5">
                    <ul className="pagination justify-content-center rounded-3 shadow-sm d-inline-flex bg-white p-1">
                        <li className="page-item disabled">
                            <a className="page-link border-0 rounded-2" href="#"><i className="bi bi-chevron-left"></i></a>
                        </li>
                        <li className="page-item active">
                            <a className="page-link border-0 rounded-2" href="#">1</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link border-0 rounded-2" href="#">2</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link border-0 rounded-2" href="#"><i className="bi bi-chevron-right"></i></a>
                        </li>
                    </ul>
                </nav>

            </div>
        </div>
    );
}

export default CompanyListPage;