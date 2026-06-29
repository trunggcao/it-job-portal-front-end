import React, { useEffect, useState } from 'react';
import apiService from '../../service/apiService';
import { ToastContainer, toast } from 'react-toastify';

function AdminBlogs() {
    // --- KHAI BÁO CÁC STATE QUẢN LÝ ---
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    // State quản lý dữ liệu form (Đã bỏ trường summary)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        categoryId: ''
    });

    // State riêng để lưu ảnh preview và file thô để chuẩn bị upload
    const [imagePreview, setImagePreview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // --- GỌI API LẤY DANH SÁCH BAN ĐẦU ---
    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [blogsRes, categoriesRes] = await Promise.all([
                apiService.adminGetAllBlogs(),
                apiService.getBlogCategories()
            ]);
            setBlogs(blogsRes.data || []);
            setCategories(categoriesRes.data || []);
            setError(null);
        } catch (err) {
            console.error("Lỗi tải dữ liệu admin:", err);
            setError("Không thể đồng bộ dữ liệu với máy chủ hệ thống.");
            toast.error("Lỗi: Không thể đồng bộ dữ liệu từ hệ thống!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    // --- XỬ LÝ KÉO THẢ & CHỌN ẢNH ---
    const processFile = (file) => {
        if (!file) return;

        // Kiểm tra định dạng file
        if (!file.type.startsWith('image/')) {
            toast.error("Vui lòng chỉ chọn tệp tin hình ảnh!");
            return;
        }

        // Tạo đường dẫn tạm thời hiển thị Preview lập tức trên trình duyệt
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        // Lưu file thô vào State để chuẩn bị submit lên Cloudinary
        setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    // Xóa ảnh hiện tại
    const handleRemoveImage = (e) => {
        e.stopPropagation(); // Tránh kích hoạt click vào ô input ẩn
        setImagePreview('');
        setSelectedFile(null);
        setFormData(prev => ({ ...prev, image: '' }));
    };

    // --- HÀM UPLOAD ẢNH TRỰC TIẾP LÊN CLOUDINARY ---
    const uploadToCloudinary = async (file) => {
        const cloudName = "dxtbzcyj9";
        const uploadPreset = "blog_preset";

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                throw new Error("Lỗi phản hồi từ Cloudinary");
            }

            const result = await response.json();
            return result.secure_url; // Trả về chuỗi URL dạng https://res.cloudinary.com/...
        } catch (error) {
            console.error("Lỗi khi upload hình ảnh:", error);
            return null;
        }
    };

    // --- XỬ LÝ ẨN / HIỆN BÀI VIẾT (PUBLISH / UNPUBLISH) ---
    const handleTogglePublish = async (id, currentStatus) => {
        try {
            const nextStatus = !currentStatus;
            const response = await apiService.adminPublishBlog(id, nextStatus);

            setBlogs(blogs.map(b => b.id === id ? { ...b, published: response.data.published } : b));

            if (nextStatus) {
                toast.success("Đã xuất bản bài viết công khai!");
            } else {
                toast.info("Đã hạ bài viết xuống chế độ ẩn.");
            }
        } catch (err) {
            toast.error("Lỗi khi thay đổi trạng thái xuất bản.");
        }
    };

    // --- XỬ LÝ XÓA BÀI VIẾT ---
    const handleDeleteBlog = async (id, title) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết: "${title}"?`)) {
            try {
                await apiService.adminDeleteBlog(id);
                setBlogs(blogs.filter(b => b.id !== id));
                toast.success("Xóa bài viết thành công!");
            } catch (err) {
                toast.error("Lỗi khi xóa bài viết.");
            }
        }
    };

    // --- MỞ MODAL FORM (THÊM / SỬA) ---
    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedBlogId(null);
        setFormData({ title: '', content: '', image: '', categoryId: '' });
        setImagePreview('');
        setSelectedFile(null); // Reset file cũ
        setShowModal(true);
    };

    const openEditModal = async (id) => {
        try {
            setIsEditMode(true);
            setSelectedBlogId(id);
            const response = await apiService.adminGetBlogDetail(id);
            const blogData = response.data;

            const fetchedImage = blogData.image || blogData.thumbnailUrl || '';

            setFormData({
                title: blogData.title || '',
                content: blogData.content || '',
                image: fetchedImage,
                categoryId: blogData.categoryId ? String(blogData.categoryId) : (blogData.category?.id ? String(blogData.category.id) : '')
            });

            // Đồng bộ dữ liệu hiển thị preview khi sửa bài
            setImagePreview(fetchedImage);
            setSelectedFile(null); // Chưa chọn file mới thì reset file thô về null
            setShowModal(true);
        } catch (err) {
            toast.error("Không thể lấy thông tin chi tiết bài viết cần sửa.");
        }
    };

    // --- SUBMIT FORM LƯU DỮ LIỆU ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalImageUrl = formData.image; // Mặc định lấy URL ảnh hiện tại (phục vụ Edit khi không đổi ảnh)

            // Bước 1: Kiểm tra xem người dùng có chọn file mới không, nếu có thì upload lên Cloudinary trước
            if (selectedFile) {
                toast.info("Đang tiến hành tải ảnh lên hệ thống đám mây...", { autoClose: 2000 });
                const uploadedUrl = await uploadToCloudinary(selectedFile);

                if (!uploadedUrl) {
                    toast.error("Tải ảnh thất bại! Vui lòng thử lại.");
                    return; // Dừng tiến trình gửi form nếu upload ảnh lỗi
                }
                finalImageUrl = uploadedUrl; // Gán URL mới lấy từ Cloudinary về
            }

            // Bước 2: Chuẩn bị dữ liệu JSON cuối cùng kèm theo URL ảnh mới/cũ gửi về Backend Java của bạn
            const dataToSubmit = {
                ...formData,
                image: finalImageUrl
            };

            if (isEditMode) {
                await apiService.adminUpdateBlog(selectedBlogId, dataToSubmit);
                toast.success("Cập nhật bài viết thành công!");
            } else {
                await apiService.adminCreateBlog(dataToSubmit);
                toast.success("Tạo bài viết mới thành công!");
            }

            setShowModal(false);
            setSelectedFile(null); // Xóa file thô sau khi submit thành công
            fetchAdminData();
        } catch (err) {
            toast.error("Lỗi trong quá trình xử lý lưu bài viết.");
        }
    };

    return (
        <div className="blogs-page-container p-3">
            <style>{`
                .table-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
                .custom-modal-backdrop {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.5); z-index: 1050; display: flex;
                    align-items: center; justify-content: center;
                }
                /* CSS CHO VÙNG KÉO THẢ ẢNH */
                .image-dropzone {
                    border: 2px dashed #ced4da;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    background: #f8f9fa;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    position: relative;
                }
                .image-dropzone.dragging {
                    border-color: #0dcaf0;
                    background: #f0fafd;
                }
                .image-dropzone:hover {
                    border-color: #6c757d;
                }
                .preview-container {
                    position: relative;
                    display: inline-block;
                    max-width: 100%;
                }
                .preview-image {
                    max-height: 160px;
                    border-radius: 6px;
                    object-fit: cover;
                }
                .btn-remove-preview {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    font-size: 12px;
                    line-height: 1;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
            `}</style>

            <div className="card table-card p-4 bg-white">
                {/* HEADER MANAGEMENT */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-newspaper text-info me-2"></i>Quản lý bài viết (Blogs Admin)
                    </h5>
                    <button
                        className="btn btn-info btn-sm text-white fw-semibold px-3 py-2"
                        onClick={openCreateModal}
                    >
                        <i className="bi bi-plus-lg me-1"></i>Viết bài mới
                    </button>
                </div>

                {/* BẢNG DỮ LIỆU */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-info" role="status"></div>
                        <p className="text-muted mt-2 small">Đang đồng bộ dữ liệu hệ thống...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger text-center border-0 shadow-sm">{error}</div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-5 text-muted">Hệ thống chưa có bài viết nào.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle border-light">
                            <thead className="table-light small text-secondary">
                                <tr>
                                    <th>ID</th>
                                    <th>Tiêu đề bài viết</th>
                                    <th>Danh mục</th>
                                    <th>Xuất bản</th>
                                    <th style={{ width: '150px' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map((blog) => (
                                    <tr key={blog.id}>
                                        <td className="text-secondary small">{blog.id}</td>
                                        <td>
                                            <div className="fw-medium text-dark text-truncate" style={{ maxWidth: '350px' }}>
                                                {blog.title}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {blog.categoryName || blog.category?.categoryName || blog.category?.name || "Chưa phân loại"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={blog.published || false}
                                                    onChange={() => handleTogglePublish(blog.id, blog.published)}
                                                />
                                                <span className={`small fw-medium ms-1 ${blog.published ? 'text-success' : 'text-muted'}`}>
                                                    {blog.published ? 'Hiển thị' : 'Đang ẩn'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-light text-warning border-light-subtle me-1"
                                                title="Sửa bài viết"
                                                onClick={() => openEditModal(blog.id)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-light text-danger border-light-subtle"
                                                title="Xóa bài viết"
                                                onClick={() => handleDeleteBlog(blog.id, blog.title)}
                                            >
                                                <i className="bi bi-trash3-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* FORM DIALOG MODAL (THÊM / SỬA BÀI VIẾT) */}
            {showModal && (
                <div className="custom-modal-backdrop">
                    <div className="card shadow-lg border-0 w-100 m-3" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
                            <h6 className="mb-0 fw-bold">
                                {isEditMode ? (
                                    <><i className="bi bi-pencil-square me-2"></i>Cập nhật bài viết</>
                                ) : (
                                    <><i className="bi bi-plus-circle me-2"></i>Tạo bài viết mới</>
                                )}
                            </h6>
                            <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setShowModal(false)}></button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="card-body p-4 text-dark">

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Tiêu đề bài viết</label>
                                <input
                                    type="text" required className="form-control"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-5 mb-3">
                                    <label className="form-label small fw-bold">Danh mục bài viết</label>
                                    <select
                                        className="form-select text-dark" required
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* KHU VỰC KÉO THẢ HÌNH ẢNH BANNER BÀI VIẾT */}
                                <div className="col-md-7 mb-3">
                                    <label className="form-label small fw-bold">Hình ảnh bài viết</label>

                                    <div
                                        className={`image-dropzone ${isDragging ? 'dragging' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('fileInput').click()}
                                    >
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="image/*"
                                            className="d-none"
                                            onChange={handleFileChange}
                                        />

                                        {imagePreview ? (
                                            <div className="preview-container">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="img-fluid preview-image shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn-remove-preview"
                                                    onClick={handleRemoveImage}
                                                    title="Xóa ảnh này"
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="py-2 text-muted">
                                                <i className="bi bi-cloud-arrow-up text-info fs-3 d-block mb-1"></i>
                                                <span className="small fw-medium">Kéo thả ảnh vào đây hoặc click để chọn</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Nội dung chi tiết bài viết</label>
                                <textarea
                                    required className="form-control" rows="6"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="d-flex justify-content-end gap-2 border-top pt-3">
                                <button type="button" className="btn btn-secondary btn-sm px-3" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                                <button type="submit" className="btn btn-info btn-sm text-white px-4 fw-medium">Lưu cấu hình</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default AdminBlogs;