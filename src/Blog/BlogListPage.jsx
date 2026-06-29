import React, { useEffect, useState } from 'react';
import apiService from '../service/apiService';
import { toast } from 'react-toastify';

function BlogListPage() {
    // 1. CÁC STATE QUẢN LÝ DỮ LIỆU
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State phục vụ bộ lọc danh mục và tìm kiếm
    const [selectedCategory, setSelectedCategory] = useState(null); // null = Tất cả bài viết
    const [searchKeyword, setSearchKeyword] = useState("");
    const [activeQuery, setActiveQuery] = useState(""); // Lưu từ khóa thực tế khi submit

    // CẬP NHẬT: Khớp danh sách categories từ backend của bạn (id: 1 là Công nghệ, v.v...)
    const categories = [
        { id: 1, name: "Công nghệ" },
        { id: 2, name: "Mới" },
        { id: 3, name: "Tuyển dụng" }
    ];

    // Hàm kiểm tra xem đường dẫn ảnh có hợp lệ hay không (bắt đầu bằng http/https)
    const isValidImageUrl = (url) => {
        if (!url) return false;
        return url.startsWith('http://') || url.startsWith('https://');
    };

    // 2. EFFECT XỬ LÝ GỌI API ĐA NĂNG
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                let response;

                // Logic phân luồng gọi API dựa vào việc: Có Danh mục hay không? Có Từ khóa hay không?
                if (selectedCategory) {
                    if (activeQuery) {
                        response = await apiService.searchBlogsByCategory(selectedCategory, activeQuery);
                    } else {
                        response = await apiService.getBlogsByCategory(selectedCategory);
                    }
                } else {
                    if (activeQuery) {
                        response = await apiService.searchBlogs(activeQuery);
                    } else {
                        response = await apiService.getPublishedBlogs();
                    }
                }

                setBlogs(response.data || []);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải danh sách bài viết:", err);
                setError("Không thể kết nối dữ liệu bài viết. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [selectedCategory, activeQuery]); // Chạy lại khi đổi danh mục hoặc bấm tìm kiếm

    // 3. XỬ LÝ SỰ KIỆN TÌM KIẾM
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setActiveQuery(searchKeyword);
    };

    // 4. XỬ LÝ RESET TẤT CẢ BỘ LỌC
    const handleClearAllFilters = () => {
        setSearchKeyword("");
        setActiveQuery("");
        setSelectedCategory(null);
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">

                {/* HEADER SECTION */}
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-dark mb-2">Khám phá những bản tin mới nhất</h1>
                    <p className="text-muted small">Cập nhật tin tức công nghệ, xu hướng việc làm và bí quyết phát triển bản thân.</p>
                </div>

                <div className="row g-4">
                    {/* SIDEBAR LỌC DANH MỤC (LEFT COLUMN) */}
                    <div className="col-lg-3">
                        {/* Thanh tìm kiếm bài viết */}
                        <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
                            <h6 className="fw-bold text-dark mb-3"><i className="bi bi-search me-2 text-primary"></i>Tìm kiếm bài viết</h6>
                            <form onSubmit={handleSearchSubmit}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control text-dark border-end-0 shadow-none bg-light"
                                        placeholder="Nhập từ khóa..."
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                    <button className="btn btn-primary px-3" type="submit">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Danh mục bài viết */}
                        <div className="card border-0 shadow-sm p-3 rounded-3">
                            <h6 className="fw-bold text-dark mb-3"><i className="bi bi-grid me-2 text-primary"></i>Danh mục</h6>
                            <div className="list-group list-group-flush">
                                <button
                                    type="button"
                                    className={`list-group-item list-group-item-action border-0 rounded-2 mb-1 fw-medium ${!selectedCategory ? 'active bg-primary' : 'text-secondary'}`}
                                    onClick={() => { setSelectedCategory(null); setActiveQuery(""); setSearchKeyword(""); }}
                                >
                                    Tất cả bài viết
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        className={`list-group-item list-group-item-action border-0 rounded-2 mb-1 fw-medium ${selectedCategory === cat.id ? 'active bg-primary' : 'text-secondary'}`}
                                        onClick={() => { setSelectedCategory(cat.id); setActiveQuery(""); setSearchKeyword(""); }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DANH SÁCH BÀI VIẾT (RIGHT COLUMN) */}
                    <div className="col-lg-9">
                        {/* Tiêu đề trạng thái tìm kiếm */}
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            <span className="text-secondary small">
                                {activeQuery && <>Kết quả tìm kiếm cho: "<strong className="text-primary">{activeQuery}</strong>" trong </>}
                                <strong>
                                    {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Tất cả danh mục"}
                                </strong>
                                &nbsp;({blogs.length} bài viết)
                            </span>
                            {(selectedCategory || activeQuery) && (
                                <button className="btn btn-link text-decoration-none btn-sm small p-0 text-danger" onClick={handleClearAllFilters}>
                                    Xóa tất cả bộ lọc
                                </button>
                            )}
                        </div>

                        {/* HIỂN THỊ LOGIC */}
                        {loading ? (
                            <div className="text-center py-5 card border-0 shadow-sm">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted mt-2 small mb-0">Đang tải các bài báo mới nhất...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger border-0 shadow-sm text-center" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-5 text-muted card border-0 shadow-sm rounded-3">
                                <i className="bi bi-journal-x fs-1 mb-2 text-secondary"></i>
                                <h5 className="fw-bold text-dark">Chưa có bài viết nào</h5>
                                <p className="small mb-0">Không tìm thấy bài báo nào phù hợp với bộ lọc hiện tại.</p>
                            </div>
                        ) : (
                            /* DANH SÁCH BÀI BÁO */
                            <div className="row g-4">
                                {blogs.map((blog) => (
                                    <div className="col-md-6" key={blog.id}>
                                        <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden card-blog-hover">

                                            {/* SỬA & THÊM LOGIC KIỂM TRA HÌNH ẢNH */}
                                            <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                                {isValidImageUrl(blog.image) ? (
                                                    <img
                                                        src={blog.image}
                                                        alt={blog.title}
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                ) : (
                                                    <div className="w-100 h-100 bg-secondary bg-opacity-10 d-flex flex-column align-items-center justify-content-center border-bottom text-muted small">
                                                        <i className="bi bi-image text-secondary fs-3 mb-1"></i>
                                                        <span>Chưa có hình ảnh</span>
                                                    </div>
                                                )}
                                                <span className="badge bg-dark bg-opacity-75 position-absolute bottom-0 start-0 m-3 rounded-pill small">
                                                    {/* SỬA: Lấy đúng categoryName lồng bên trong object category */}
                                                    {blog.category?.categoryName || "Chưa phân loại"}
                                                </span>
                                            </div>

                                            {/* Nội dung Card */}
                                            <div className="card-body d-flex flex-column justify-content-between p-4">
                                                <div>
                                                    <h5 className="card-title fw-bold text-dark mb-2 fs-6 lh-base text-truncate-2" style={{ height: '2.8em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {blog.title}
                                                    </h5>
                                                    <p className="card-text text-secondary small lh-base text-truncate-3 mb-3" style={{ height: '4.5em', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {blog.summary || blog.content || "Nhấp vào để xem nội dung chi tiết bài báo..."}
                                                    </p>
                                                </div>

                                                <div className="border-top pt-3 d-flex justify-content-between align-items-center mt-2">
                                                    <div className="text-muted small">
                                                        {/* SỬA: Chuyển sang map trường blog.time */}
                                                        <i className="bi bi-calendar3 me-1"></i> {blog.time ? `Lúc ${new Date(blog.time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, ${new Date(blog.time).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}` : 'Vừa cập nhật'}
                                                    </div>
                                                    <a href={`/blogs/${blog.id}`} className="btn btn-outline-primary btn-sm px-3 fw-medium rounded-pill">
                                                        Đọc thêm <i className="bi bi-arrow-right small ms-1"></i>
                                                    </a>
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

            {/* Hiệu ứng zoom nhẹ ảnh khi hover card blog */}
            <style>{`
                .card-blog-hover {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .card-blog-hover:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.12)!important;
                }
                .card-blog-hover img {
                    transition: transform 0.3s ease;
                }
                .card-blog-hover:hover img {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
}

export default BlogListPage;