import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../service/apiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const res = await apiService.getMyProfile();
            setUser(res.data); // Lưu nguyên cục JSON profile vào state
        } catch (err) {
            console.error("Lỗi lấy thông tin profile:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Tự động chạy khi f5 lại trang nếu có token
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser, refreshProfile: fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);