import { useState } from 'react';
import apiService from '../service/apiService';
import './PointCheckout.css';

const packages = [
    { id: 1, name: 'Basic 1', points: 10, amount: 10000 },
    { id: 2, name: 'Standard', points: 50, amount: 50000 },
    { id: 3, name: 'Premium', points: 100, amount: 100000 },
    { id: 4, name: 'Pro', points: 200, amount: 180000 },
    { id: 5, name: 'VIP', points: 500, amount: 420000 },
    { id: 6, name: 'Ultimate', points: 1000, amount: 800000 },
];

export default function PointCheckout() {
    // Mặc định chọn gói Standard
    const [selectedPackage, setSelectedPackage] = useState(packages[1]);
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const stripeRequest = {
                name: `Nạp ${selectedPackage.points} Points (${selectedPackage.name})`,
                amount: selectedPackage.amount,
                quantity: 1,
                currency: 'vnd'
            };

            const response = await apiService.createCheckoutSession(stripeRequest);
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
                            {packages.map((pkg) => {
                                const isActive = selectedPackage.id === pkg.id;
                                return (
                                    <div class="col-md-4" key={pkg.id}>
                                        <div
                                            className={`pricing-card ${isActive ? 'active' : ''}`}
                                            onClick={() => setSelectedPackage(pkg)}
                                        >
                                            <div class="pricing-header">
                                                <div class="plan-title">{pkg.name}</div>
                                                <div class="plan-price">{pkg.amount.toLocaleString('vi-VN')}đ</div>
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
                                    {selectedPackage.name} ({selectedPackage.points} Points)
                                </span>
                            </div>

                            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
                                <span class="text-secondary">Tổng thanh toán:</span>
                                <span class="fw-bold fs-4 text-white">
                                    {selectedPackage.amount.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>

                            <button
                                className="btn btn-checkout w-100 fs-6"
                                onClick={handleCheckout}
                                disabled={loading}
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