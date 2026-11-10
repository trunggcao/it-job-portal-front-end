import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiService from '../../service/apiService';
import './AdminPayment.css';

const initialForm = {
    name: '',
    points: '',
    price: '',
    isActive: true
};

const loadAllPackages = async () => {
    const response = await apiService.getAllPackages();
    const data = response?.data ?? response;
    if (!Array.isArray(data)) {
        throw new Error('Dữ liệu gói thanh toán không hợp lệ.');
    }
    return data;
};

function AdminPaymenPackages() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updatingPackageId, setUpdatingPackageId] = useState(null);
    const [formData, setFormData] = useState(initialForm);

    const fetchPackages = useCallback(async () => {
        try {
            setPackages(await loadAllPackages());
        } catch (requestError) {
            console.error('Lỗi tải danh sách gói thanh toán:', requestError);
            const message = requestError.response?.data?.message || 'Không thể tải danh sách gói thanh toán.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        loadAllPackages()
            .then((data) => {
                if (isMounted) setPackages(data);
            })
            .catch((requestError) => {
                console.error('Lỗi tải danh sách gói thanh toán:', requestError);
                if (isMounted) {
                    setError(requestError.response?.data?.message || 'Không thể tải danh sách gói thanh toán.');
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleRetry = () => {
        setLoading(true);
        setError('');
        fetchPackages();
    };

    const handleToggleActive = async (paymentPackage) => {
        const packageId = paymentPackage.id ?? paymentPackage.packageId;
        if (packageId == null) {
            toast.error('Không tìm thấy ID của gói thanh toán.');
            return;
        }

        const nextStatus = !paymentPackage.isActive;
        setUpdatingPackageId(packageId);

        try {
            const response = await apiService.updatePackage(packageId, nextStatus);
            const updatedPackage = response?.data && typeof response.data === 'object'
                ? response.data
                : null;
            setPackages((currentPackages) => currentPackages.map((currentPackage) => (
                (currentPackage.id ?? currentPackage.packageId) === packageId
                    ? {
                        ...currentPackage,
                        ...(updatedPackage || {}),
                        isActive: nextStatus
                    }
                    : currentPackage
            )));
            toast.success(`Cập nhật trạng thái gói "${paymentPackage.name}" thành công!`);
        } catch (requestError) {
            console.error('Lỗi cập nhật trạng thái gói thanh toán:', requestError);
            toast.error(requestError.response?.data?.message || 'Không thể cập nhật trạng thái gói thanh toán.');
        } finally {
            setUpdatingPackageId(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const packageDTO = {
            name: formData.name.trim(),
            points: Number(formData.points),
            price: Number(formData.price),
            isActive: formData.isActive
        };

        if (!packageDTO.name || !Number.isInteger(packageDTO.points) || packageDTO.points <= 0 ||
            !Number.isFinite(packageDTO.price) || packageDTO.price <= 0) {
            toast.error('Vui lòng nhập tên, số điểm và giá hợp lệ.');
            return;
        }

        setSaving(true);
        try {
            const response = await apiService.createPackage(packageDTO);
            const createdPackage = response?.data ?? response;
            setPackages((currentPackages) => [
                ...currentPackages,
                createdPackage && typeof createdPackage === 'object' && createdPackage.name
                    ? createdPackage
                    : packageDTO
            ]);
            setFormData(initialForm);
            setShowForm(false);
            toast.success('Tạo gói thanh toán thành công.');
        } catch (requestError) {
            console.error('Lỗi tạo gói thanh toán:', requestError);
            toast.error(requestError.response?.data?.message || 'Không thể tạo gói thanh toán.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="admin-payment-page">
            <div className="admin-payment-card">
                <div className="admin-payment-heading">
                    <div>
                        <h2 className="h5 fw-bold mb-1">Quản lý gói thanh toán</h2>
                        <p className="text-secondary mb-0">Danh sách các gói điểm đang được cung cấp.</p>
                    </div>
                    <button className="btn btn-primary" type="button" onClick={() => setShowForm(true)}>
                        <i className="bi bi-plus-lg me-2"></i>Tạo gói mới
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                        <span>{error}</span>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={handleRetry}>
                            Thử lại
                        </button>
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên gói</th>
                                <th scope="col">Điểm</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td className="py-5 text-center text-secondary" colSpan="6">Đang tải danh sách gói...</td></tr>
                            ) : packages.length === 0 ? (
                                <tr><td className="py-5 text-center text-secondary" colSpan="6">Chưa có gói thanh toán nào.</td></tr>
                            ) : packages.map((paymentPackage, index) => (
                                <tr key={paymentPackage.id ?? `${paymentPackage.name}-${index}`}>
                                    <td className="text-secondary">{paymentPackage.id ?? index + 1}</td>
                                    <td className="fw-semibold">{paymentPackage.name || '—'}</td>
                                    <td>{Number(paymentPackage.points || 0).toLocaleString('vi-VN')}</td>
                                    <td>{Number(paymentPackage.price || 0).toLocaleString('vi-VN')} ₫</td>
                                    <td>
                                        <span className={`badge ${paymentPackage.isActive ? 'text-bg-success' : 'text-bg-secondary'}`}>
                                            {paymentPackage.isActive ? 'Đang hoạt động' : 'Đã tắt'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="form-check form-switch d-inline-flex align-items-center gap-2 m-0">
                                            <input
                                                className="form-check-input admin-package-switch"
                                                type="checkbox"
                                                role="switch"
                                                id={`package-switch-${paymentPackage.id ?? paymentPackage.packageId}`}
                                                checked={paymentPackage.isActive === true}
                                                disabled={updatingPackageId === (paymentPackage.id ?? paymentPackage.packageId)}
                                                onChange={() => handleToggleActive(paymentPackage)}
                                                aria-label={`${paymentPackage.isActive ? 'Tắt' : 'Bật'} gói ${paymentPackage.name}`}
                                            />
                                            <label
                                                className={`form-check-label small fw-semibold ${paymentPackage.isActive ? 'text-success' : 'text-secondary'}`}
                                                htmlFor={`package-switch-${paymentPackage.id ?? paymentPackage.packageId}`}
                                            >
                                                {updatingPackageId === (paymentPackage.id ?? paymentPackage.packageId)
                                                    ? 'Đang cập nhật...'
                                                    : paymentPackage.isActive ? 'Đang bật' : 'Đang tắt'}
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="admin-payment-modal-backdrop" role="presentation" onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !saving) setShowForm(false);
                }}>
                    <div className="admin-payment-modal" role="dialog" aria-modal="true" aria-labelledby="create-package-title">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h5 fw-bold mb-0" id="create-package-title">Tạo gói thanh toán</h2>
                            <button className="btn-close" type="button" aria-label="Đóng" onClick={() => setShowForm(false)} disabled={saving}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="package-name">Tên gói</label>
                                <input
                                    className="form-control"
                                    id="package-name"
                                    value={formData.name}
                                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                    placeholder="Ví dụ: Medium"
                                    maxLength="100"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="package-points">Số điểm</label>
                                <input
                                    className="form-control"
                                    id="package-points"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={formData.points}
                                    onChange={(event) => setFormData({ ...formData, points: event.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="package-price">Giá (VNĐ)</label>
                                <input
                                    className="form-control"
                                    id="package-price"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-check form-switch mb-4">
                                <input
                                    className="form-check-input"
                                    id="package-active"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                                />
                                <label className="form-check-label" htmlFor="package-active">Gói đang hoạt động</label>
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-light" type="button" onClick={() => setShowForm(false)} disabled={saving}>
                                    Hủy
                                </button>
                                <button className="btn btn-primary" type="submit" disabled={saving}>
                                    {saving ? 'Đang tạo...' : 'Tạo gói'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminPaymenPackages;