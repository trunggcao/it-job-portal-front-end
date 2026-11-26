import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import apiService from '../service/apiService';
import axiosClient from '../service/axiosClient';
import './NotificationBell.css';

const NOTIFICATION_META = {
    JOB_APPLICATION: {
        icon: 'bi-person-check-fill',
        badgeClass: 'bg-primary-subtle text-primary',
        route: '/employer/dashboard',
    },
    COMPANY_VERIFICATION_APPROVED: {
        icon: 'bi-patch-check-fill',
        badgeClass: 'bg-success-subtle text-success',
        route: '/employer/verify-company',
    },
    COMPANY_VERIFICATION_REJECTED: {
        icon: 'bi-x-octagon-fill',
        badgeClass: 'bg-danger-subtle text-danger',
        route: '/employer/verify-company',
    },
};

const DEFAULT_META = {
    icon: 'bi-bell-fill',
    badgeClass: 'bg-secondary-subtle text-secondary',
    route: null,
};

function extractNotificationList(response) {
    const raw = response?.data ?? response;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.content)) return raw.content;
    return [];
}

function extractUnreadCount(response) {
    const raw = response?.data ?? response;
    if (typeof raw === 'number') return raw;
    if (typeof raw?.unreadCount === 'number') return raw.unreadCount;
    if (typeof raw?.count === 'number') return raw.count;
    if (typeof raw?.data === 'number') return raw.data;
    return null;
}

function parseCreatedAt(createdAt) {
    if (!createdAt) return null;
    if (Array.isArray(createdAt) && createdAt.length >= 3) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = createdAt;
        return new Date(year, month - 1, day, hour, minute, second);
    }
    const parsed = new Date(createdAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatRelativeTime(createdAt) {
    const date = parseCreatedAt(createdAt);
    if (!date) return '';

    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 60) return 'Vừa xong';

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

async function fetchNotificationSnapshot() {
    const [listResult, countResult] = await Promise.allSettled([
        apiService.getNotifications(),
        apiService.getUnreadNotificationCount(),
    ]);

    const hasList = listResult.status === 'fulfilled';
    const list = hasList ? extractNotificationList(listResult.value) : null;

    let unreadCount = null;
    if (countResult.status === 'fulfilled') {
        unreadCount = extractUnreadCount(countResult.value);
    }
    if (unreadCount === null && list) {
        unreadCount = list.filter((item) => !item.isRead).length;
    }

    return { list, unreadCount };
}

function NotificationBell({ token }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(Boolean(token));
    const [markingAll, setMarkingAll] = useState(false);

    const dropdownRef = useRef(null);
    const knownIdsRef = useRef(new Set());

    const applySnapshot = (snapshot) => {
        if (snapshot.list) {
            setNotifications(snapshot.list);
            knownIdsRef.current = new Set(
                snapshot.list.map((item) => item.id).filter((id) => id != null)
            );
        }
        if (snapshot.unreadCount !== null) {
            setUnreadCount(snapshot.unreadCount);
        }
    };

    useEffect(() => {
        if (!token) return undefined;

        let isActive = true;
        fetchNotificationSnapshot()
            .then((snapshot) => {
                if (isActive) {
                    applySnapshot(snapshot);
                }
            })
            .catch((err) => {
                console.error('Lỗi tải danh sách thông báo:', err);
            })
            .finally(() => {
                if (isActive) {
                    setLoading(false);
                }
            });

        const baseUrl = (axiosClient.defaults.baseURL || 'http://localhost:5454/api/v1.0').replace(/\/$/, '');
        const client = new Client({
            webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                client.subscribe('/user/queue/notifications', (frame) => {
                    if (!frame.body) return;
                    try {
                        const incoming = JSON.parse(frame.body);
                        const isDuplicate = incoming.id != null && knownIdsRef.current.has(incoming.id);

                        if (incoming.id != null) {
                            knownIdsRef.current.add(incoming.id);
                        }

                        setNotifications((prev) => {
                            if (isDuplicate) {
                                return prev.map((item) => (item.id === incoming.id ? incoming : item));
                            }
                            return [incoming, ...prev];
                        });

                        if (!isDuplicate && !incoming.isRead) {
                            setUnreadCount((prev) => prev + 1);
                            const toastContent = incoming.title
                                ? `${incoming.title}${incoming.message ? `: ${incoming.message}` : ''}`
                                : (incoming.message || 'Bạn có thông báo mới');

                            if (incoming.type === 'COMPANY_VERIFICATION_REJECTED') {
                                toast.error(toastContent);
                            } else if (incoming.type === 'COMPANY_VERIFICATION_APPROVED') {
                                toast.success(toastContent);
                            } else {
                                toast.info(toastContent);
                            }
                        }
                    } catch (err) {
                        console.error('Lỗi xử lý thông báo real-time:', err);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Lỗi STOMP WebSocket:', frame.headers?.message || frame.body);
            },
        });

        client.activate();

        return () => {
            isActive = false;
            client.deactivate();
        };
    }, [token]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleToggle = async () => {
        const nextOpen = !isOpen;
        setIsOpen(nextOpen);
        if (nextOpen) {
            try {
                const snapshot = await fetchNotificationSnapshot();
                applySnapshot(snapshot);
            } catch (err) {
                console.error('Lỗi làm mới danh sách thông báo:', err);
            }
        }
    };

    const handleNotificationClick = async (item) => {
        if (!item.isRead && item.id != null) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));

            try {
                await apiService.markNotificationAsRead(item.id);
            } catch (err) {
                console.error('Lỗi đánh dấu thông báo đã đọc:', err);
            }
        }

        setIsOpen(false);
        const meta = NOTIFICATION_META[item.type] || DEFAULT_META;
        if (meta.route) {
            navigate(meta.route);
        }
    };

    const handleMarkAllAsRead = async (e) => {
        e.stopPropagation();
        if (markingAll || unreadCount === 0) return;

        try {
            setMarkingAll(true);
            await apiService.markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Lỗi đánh dấu tất cả thông báo đã đọc:', err);
            toast.error('Không thể đánh dấu tất cả thông báo đã đọc.');
        } finally {
            setMarkingAll(false);
        }
    };

    if (!token) return null;

    return (
        <div className="notification-wrapper me-1" ref={dropdownRef}>
            <button
                type="button"
                className={`notification-bell-btn position-relative ${isOpen ? 'active' : ''}`}
                onClick={handleToggle}
                aria-label="Thông báo"
                aria-expanded={isOpen}
                title="Thông báo"
            >
                <i className={`bi ${unreadCount > 0 ? 'bi-bell-fill' : 'bi-bell'} fs-6`}></i>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-light">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-dark small">Thông báo</span>
                            {unreadCount > 0 && (
                                <span className="badge rounded-pill bg-primary-subtle text-primary">
                                    {unreadCount} chưa đọc
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            className="btn btn-link btn-sm text-decoration-none p-0 small fw-medium"
                            onClick={handleMarkAllAsRead}
                            disabled={markingAll || unreadCount === 0}
                        >
                            {markingAll ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
                        </button>
                    </div>

                    <div className="notification-list">
                        {loading && notifications.length === 0 ? (
                            <div className="text-center py-4 text-secondary small">
                                <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                                <div>Đang tải thông báo...</div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-4 px-3 text-muted small">
                                <i className="bi bi-bell-slash fs-3 d-block mb-2 text-secondary opacity-50"></i>
                                Bạn chưa có thông báo nào.
                            </div>
                        ) : (
                            notifications.map((item, index) => {
                                const meta = NOTIFICATION_META[item.type] || DEFAULT_META;
                                const isUnread = !item.isRead;
                                return (
                                    <button
                                        key={item.id ?? `${item.type}-${index}`}
                                        type="button"
                                        className={`notification-item ${isUnread ? 'unread' : ''}`}
                                        onClick={() => handleNotificationClick(item)}
                                    >
                                        <span className={`notification-type-icon ${meta.badgeClass}`}>
                                            <i className={`bi ${meta.icon}`}></i>
                                        </span>
                                        <div className="flex-grow-1 min-w-0">
                                            <div className={`small text-dark ${isUnread ? 'fw-bold' : 'fw-medium'}`}>
                                                {item.title || 'Thông báo mới'}
                                            </div>
                                            {item.message && (
                                                <div className="small text-secondary mt-1" style={{ lineHeight: 1.35 }}>
                                                    {item.message}
                                                </div>
                                            )}
                                            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                                                {formatRelativeTime(item.createdAt)}
                                            </div>
                                        </div>
                                        {isUnread && <span className="notification-unread-dot" title="Chưa đọc"></span>}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
