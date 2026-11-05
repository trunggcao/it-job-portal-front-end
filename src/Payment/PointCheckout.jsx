import { useEffect, useState } from 'react';
import apiService from '../service/apiService';
import './PointCheckout.css';

export default function PointCheckout() {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [packagesLoading, setPackagesLoading] = useState(true);
    const [packagesError, setPackagesError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadPackages = async () => {
            try {
                const response = await apiService.getPackages();
                const data = response?.data ?? response;

                if (!Array.isArray(data)) {
                    throw new Error('Dữ liệu gói điểm không hợp lệ');
                }

                const activePackages = data.filter((pkg) => pkg.isActive);
                const defaultPackage = activePackages.find(
                    (pkg) => pkg.name?.toLowerCase() === 'standard'
                ) ?? activePackages[0] ?? null;

                if (isMounted) {
                    setPackages(activePackages);
                    setSelectedPackage(defaultPackage);
                }
            } catch (error) {
                console.error('Lỗi tải gói điểm:', error);
                if (isMounted) {
                    setPackagesError(error?.response?.data?.message || error.message || 'Không thể tải danh sách gói điểm');
                }
            } finally {
                if (isMounted) {
                    setPackagesLoading(false);
                }
            }
        };

        loadPackages();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleCheckout = async () => {
        if (!selectedPackage) return;

        setLoading(true);
        try {
            const checkoutRequest = {
                packageId: selectedPackage.id,
                quantity: 1,
                currency: 'vnd'
            };

            const response = await apiService.createCheckoutSession(checkoutRequest);
            const data = response?.data ?? response;

            if (data?.status !== 'SUCCESS' || !data?.sessionUrl) {
                throw new Error(data?.message || 'Không thể khởi tạo phiên thanh toán');
            }

            window.location.assign(data.sessionUrl);
        } catch (error) {
            console.error('Lỗi thanh toán Stripe:', error);
            const backendMessage = error?.response?.data?.message;
            alert(backendMessage || error.message || 'Không thể kết nối tới Server Backend!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="point-checkout d-flex align-items-center py-5">
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="fw-bold text-white mb-2">Chọn Gói Nạp Điểm</h2>
                    <p class="text-secondary">Chọn gói điểm dịch vụ mong muốn và tiến hành thanh toán</p>
                </div>

                <div class="row g-4 align-items-start">
                    <div class="col-lg-8">
                        <div class="row g-3">
                            {packagesLoading ? (
                                <div class="col-12 text-center text-secondary">Đang tải các gói điểm...</div>
                            ) : packagesError ? (
                                <div class="col-12 text-center text-danger">{packagesError}</div>
                            ) : packages.length === 0 ? (
                                <div class="col-12 text-center text-secondary">Hiện chưa có gói điểm khả dụng.</div>
                            ) : packages.map((pkg) => {
                                const isActive = selectedPackage.id === pkg.id;
                                return (
                                    <div class="col-md-4" key={pkg.id}>
                                        <div
                                            className={`pricing-card ${isActive ? 'active' : ''}`}
                                            onClick={() => setSelectedPackage(pkg)}
                                        >
                                            <div class="pricing-header">
                                                <div class="plan-title">{pkg.name}</div>
                                                <div class="plan-price">{Number(pkg.price).toLocaleString('vi-VN')}đ</div>
                                                <div class="text-secondary small mt-1">{pkg.points} Points</div>
                                            </div>
                                            <div class="wave-footer">
                                                <button type="button" class="btn-buy">
                                                    {isActive ? 'Đã Chọn' : 'Chọn Gói'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="summary-card p-4 text-center">
                            <h4 class="fw-bold text-white mb-4">Thông Tin Đơn Hàng</h4>

                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="text-secondary">Gói đang chọn:</span>
                                <span className="selected-package fw-bold">
                                    {selectedPackage ? `${selectedPackage.name} (${selectedPackage.points} Points)` : '-'}
                                </span>
                            </div>

                            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
                                <span class="text-secondary">Tổng thanh toán:</span>
                                <span class="fw-bold fs-4 text-white">
                                    {selectedPackage ? `${Number(selectedPackage.price).toLocaleString('vi-VN')} VNĐ` : '-'}
                                </span>
                            </div>

                            <button
                                className="btn btn-checkout w-100 fs-6"
                                onClick={handleCheckout}
                                disabled={loading || packagesLoading || !selectedPackage}
                            >
                                {loading ? (
                                    <>
                                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang tạo phiên thanh toán...
                                    </>
                                ) : (
                                    <>
                                        <i class="fa-solid fa-bolt me-2"></i>Thanh Toán Ngay
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}