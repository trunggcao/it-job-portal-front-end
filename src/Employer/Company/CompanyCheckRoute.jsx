import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../Auth/AuthContext";

function CompanyCheckRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="text-center py-5">Đang tải dữ liệu...</div>;

    // Nếu là Nhà tuyển dụng VÀ chưa có công ty (companyId === null)
    if (user && user.role === 'ROLE_EMPLOYER' && !user.companyId) {
        return <Navigate to="/employer/create-company" replace />;
    }

    return children;
}

export default CompanyCheckRoute;