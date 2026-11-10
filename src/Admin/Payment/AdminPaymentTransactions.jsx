import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiService from '../../service/apiService';
import './AdminPayment.css';

const formatDate = (value) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return {
        date: new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date),
        time: new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23'
        }).format(date)
    };
};

const formatAmount = (amount, currency) => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return '—';

    const normalizedCurrency = (currency || 'VND').toUpperCase();
    try {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: normalizedCurrency
        }).format(value);
    } catch {
        return `${value.toLocaleString('vi-VN')} ${normalizedCurrency}`;
    }
};

const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
        case 'SUCCESS':
            return 'text-bg-success';
        case 'PENDING':
            return 'text-bg-warning';
        case 'FAILED':
        case 'CANCELLED':
            return 'text-bg-danger';
        default:
            return 'text-bg-secondary';
    }
};

function AdminPaymentTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchTransactions = async () => {
            try {
                const response = await apiService.getAllTransactions();
                const data = response?.data ?? response;
                if (!Array.isArray(data)) {
                    throw new Error('Dữ liệu lịch sử giao dịch không hợp lệ.');
                }
                if (isMounted) setTransactions(data);
            } catch (requestError) {
                console.error('Lỗi tải lịch sử giao dịch:', requestError);
                if (isMounted) {
                    setError(requestError.response?.data?.message || requestError.message || 'Không thể tải lịch sử giao dịch.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchTransactions();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleRetry = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiService.getAllTransactions();
            const data = response?.data ?? response;
            if (!Array.isArray(data)) {
                throw new Error('Dữ liệu lịch sử giao dịch không hợp lệ.');
            }
            setTransactions(data);
        } catch (requestError) {
            console.error('Lỗi tải lịch sử giao dịch:', requestError);
            const message = requestError.response?.data?.message || requestError.message || 'Không thể tải lịch sử giao dịch.';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="admin-payment-page">
            <div className="admin-payment-card">
                <div className="admin-payment-heading">
                    <div>
                        <h2 className="h5 fw-bold mb-1">Lịch sử giao dịch</h2>
                        <p className="text-secondary mb-0">Theo dõi các giao dịch thanh toán của người dùng.</p>
                    </div>
                    <button className="btn btn-outline-primary" type="button" onClick={handleRetry} disabled={loading}>
                        <i className="bi bi-arrow-clockwise me-2"></i>Làm mới
                    </button>
                </div>

                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Mã Giao dịch</th>
                                <th scope="col">Tên gói</th>
                                <th scope="col">Điểm</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Thời gian tạo</th>
                                <th scope="col">Email người dùng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td className="py-5 text-center text-secondary" colSpan="7">Đang tải lịch sử giao dịch...</td></tr>
                            ) : error ? (
                                <tr>
                                    <td className="py-5 text-center" colSpan="7">
                                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={handleRetry}>
                                            Thử tải lại
                                        </button>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr><td className="py-5 text-center text-secondary" colSpan="7">Chưa có giao dịch nào.</td></tr>
                            ) : transactions.map((transaction, index) => {
                                const createdAt = formatDate(transaction.createdAt);
                                return (
                                    <tr key={transaction.id ?? index}>
                                        <td className="text-secondary">{transaction.id ?? '—'}</td>
                                        <td className="fw-semibold">{transaction.packageName || '—'}</td>
                                        <td>{Number(transaction.pointAwarded || 0).toLocaleString('vi-VN')}</td>
                                        <td>{formatAmount(transaction.amout, transaction.currency)}</td>
                                        <td>
                                            <span className={`badge ${getStatusClass(transaction.status)}`}>
                                                {transaction.status || 'Không rõ'}
                                            </span>
                                        </td>
                                        <td>
                                            {createdAt ? (
                                                <time dateTime={transaction.createdAt} className="d-inline-flex flex-column">
                                                    <span>{createdAt.date}</span>
                                                    <span className="small text-secondary">{createdAt.time}</span>
                                                </time>
                                            ) : '—'}
                                        </td>
                                        <td>{transaction.userEmail || '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default AdminPaymentTransactions;