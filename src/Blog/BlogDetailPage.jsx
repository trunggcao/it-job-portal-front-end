import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';

function BlogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // KHAI BÁO CÁC STATE QUẢN LÝ DỮ LIỆU
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm kiểm tra xem đường dẫn ảnh có hợp lệ hay không (bắt đầu bằng http/https)
    const isValidImageUrl = (url) => {
        if (!url) return false;
        return url.startsWith('http://') || url.startsWith('https://');
    };

    // 3. GỌI API LẤY CHI TIẾT BÀI BÁO
    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);
                // Gọi API: GET /blogs/{id}
                const response = await apiService.getBlogDetail(id);
                setBlog(response.data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết bài viết:", err);
                setError("Không thể tải nội dung bài viết này. Bài viết có thể không tồn tại hoặc đã bị ẩn.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogDetail();
        }
    }, [id]);

    // 4. XỬ LÝ KHU VỰC LOGIC HIỂN THỊ (LOADING / ERROR)
    if (loading) {
        return (
            <div className="container my-5 py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 small">Đang tải nội dung bài viết...</p>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="container my-5 py-5">
                <div className="alert alert-danger text-center shadow-sm border-0" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error || "Không tìm thấy dữ liệu."}
                </div>
                <div className="text-center mt-3">
                    <button className="btn btn-primary btn-sm px-4 fw-medium" onClick={() => navigate('/blogs')}>
                        <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách Blog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-vh-100 py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9 col-xl-8">

                        {/* NÚT QUAY LẠI & THÔNG TIN DANH MỤC */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <button
                                className="btn btn-link text-decoration-none p-0 text-secondary small fw-medium"
                                onClick={() => navigate(-1)} // Quay lại trang trước đó
                            >
                                <i className="bi bi-arrow-left me-1"></i> Quay lại
                            </button>
                            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-medium small">
                                {/* ĐỒNG BỘ backend: category.categoryName */}
                                {blog.category.categoryName || "Cẩm nang nghề nghiệp"}
                            </span>
                        </div>

                        {/* TÊN TIÊU ĐỀ CHỮ TO (H1) */}
                        <h1 className="fw-extrabold text-dark lh-base mb-3 display-5">
                            {blog.title}
                        </h1>

                        {/* THỜI GIAN ĐĂNG BÀI */}
                        <div className="d-flex align-items-center gap-3 text-muted small pb-4 mb-4 border-bottom">
                            <div>
                                <i className="bi bi-calendar3 me-1"></i>
                                {/* ĐỒNG BỘ backend: blog.time */}
                                {blog.time ? `Lúc ${new Date(blog.time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, ${new Date(blog.time).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}` : 'Vừa cập nhật'}
                            </div>
                        </div>

                        {/* TÓM TẮT BÀI BÁO (NẾU CÓ) */}
                        {blog.summary && (
                            <p className="lead text-secondary fw-medium lh-lg mb-4 ps-3 border-start border-4 border-primary bg-light py-2 rounded-end">
                                {blog.summary}
                            </p>
                        )}

                        {/* KIỂM TRA HÌNH ẢNH: CÓ THÌ HIỆN, KHÔNG HỢP LỆ THÌ THÔI (ẨN HOÀN TOÀN) */}
                        {isValidImageUrl(blog.image) && (
                            <div className="text-center my-4">
                                <figure className="figure d-inline-block shadow-sm rounded-3 overflow-hidden mw-100">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="img-fluid rounded-3 object-fit-cover"
                                        style={{ maxHeight: '450px', width: '100%' }}
                                    />
                                    {blog.imageCaption && (
                                        <figcaption className="figure-caption text-center mt-2 small text-muted fst-italic">
                                            {blog.imageCaption}
                                        </figcaption>
                                    )}
                                </figure>
                            </div>
                        )}

                        {/* NỘI DUNG CHI TIẾT BÀI BÁO */}
                        <div
                            className="blog-content text-dark lh-lg fs-5 mt-4"
                            style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}
                        >
                            {/* Nếu nội dung là HTML từ Rich Text Editor, hãy đổi thành: 
                                <div dangerouslySetInnerHTML={{ __html: blog.content }} /> 
                            */}
                            {blog.content || "Nội dung bài viết đang được cập nhật..."}
                        </div>

                        {/* THỂ TAGS / FOOTER BÀI VIẾT */}
                        <div className="border-top pt-4 mt-5">
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <span className="text-secondary small fw-bold me-2">Từ khóa:</span>
                                <span className="badge bg-light text-secondary rounded-pill border px-3 py-2 small">{blog.category.categoryName}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogDetailPage;