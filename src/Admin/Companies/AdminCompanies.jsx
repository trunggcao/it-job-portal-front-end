import React, { useState, useEffect } from 'react';
import apiService from '../../service/apiService';
import { toast } from 'react-toastify';

function AdminCompanies() {
    // === Các State Quản Lý Dữ Liệu ===
    const [companiesList, setCompaniesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');

    // === Hàm gọi API lấy danh sách Công ty ===
    const fetchCompanies = async (keyword = "") => {
        try {
            setLoading(true);
            // Gọi hàm getAllCompanies từ apiService bạn cung cấp
            const response = await apiService.getAllCompanies(keyword);

            setCompaniesList(response.data || response);
        } catch (error) {
            console.error("Lỗi hệ thống khi gọi API lấy danh sách công ty:", error);
            // Bắn thông báo lỗi lên màn hình thông qua react-toastify
            const errorMsg = error.response?.data?.message || "Không thể tải danh sách doanh nghiệp từ máy chủ!";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Tự động nạp dữ liệu khi giao diện được load lần đầu
    useEffect(() => {
        fetchCompanies();
    }, []);

    // Xử lý tìm kiếm khi người dùng nhấn Enter hoặc bấm nút tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchCompanies(searchKeyword.trim());
    };

    return (
        <div className="companies-page-container">
            <style>{`
                .table-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
                .search-box {
                    max-width: 300px;
                }
            `}</style>

            <div className="card table-card p-4 bg-white">
                {/* Tiêu đề & Thanh tìm kiếm */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-building-fill text-danger me-2"></i>Xác thực hồ sơ doanh nghiệp
                    </h5>

                    <form onSubmit={handleSearchSubmit} className="search-box input-group input-group-sm">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm tên công ty..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle border-light">
                        <thead className="table-light small text-secondary">
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Tên công ty</th>
                                <th>Website</th>
                                <th>Địa chỉ trụ sở</th>
                                <th>Trạng thái</th>
                                <th style={{ width: '150px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Đang đợi API phản hồi */}
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-secondary">
                                        <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                                        Đang tải dữ liệu hồ sơ doanh nghiệp...
                                    </td>
                                </tr>
                            ) : /*API trả về mảng rỗng */
                                companiesList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Không tìm thấy doanh nghiệp nào trên hệ thống.
                                        </td>
                                    </tr>
                                ) : (
                                    /* Render danh sách thành công */
                                    companiesList.map((company) => (
                                        <tr key={company.id}>
                                            <td># {company.id}</td>
                                            <td className="fw-bold text-dark">{company.companyName}</td>
                                            <td>
                                                {company.website && company.website.trim() !== "" ? (
                                                    <a
                                                        href={`https://${company.website}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-decoration-none text-primary"
                                                    >
                                                        {company.website}
                                                    </a>
                                                ) : (
                                                    <span className="text-muted small italic">Chưa cập nhật</span>
                                                )}
                                            </td>
                                            <td>{company.address}</td>
                                            <td>
                                                {company.isDeleted === true || company.isDeleted === "True" ? (
                                                    <span className="badge bg-danger-subtle text-danger px-2 py-1">Đã khóa</span>
                                                ) : (
                                                    <span className="badge bg-success-subtle text-success px-2 py-1">Hoạt động</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-light text-warning border-light-subtle me-1"
                                                    title="Sửa thông tin"
                                                    onClick={() => alert(`Sửa công ty: ${company.companyName}`)}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger fw-semibold"
                                                    title="Thay đổi trạng thái khóa"
                                                    onClick={() => alert(`Thay đổi trạng thái Lock của ID: ${company.id}`)}
                                                >
                                                    <i className="bi bi-toggle-on me-1"></i> Lock
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminCompanies;