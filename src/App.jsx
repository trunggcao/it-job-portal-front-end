import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import JobListPage from './Job/JobListPage';
import JobDetailPage from './Job/JobDetailPage';
import CompanyListPage from './Company/CompanyListPage';
import CompanyDetailPage from './Company/CompanyDetailPage';
import RegisterPage from './Auth/RegisterPage';
import LoginPage from './Auth/LoginPage';

// BỔ SUNG: Import trang Dashboard của Nhà tuyển dụng
// Hãy điều chỉnh lại đường dẫn (path) này cho chính xác với cấu trúc thư mục thực tế của bạn
import EmployerDashboard from './Employer/EmployerDashboard';
import UserProfilePage from './Candidate/UserProfilePage';
import CreateJob from './Employer/CreateJob';

// Component bọc bảo vệ Route phân quyền
const EmployerRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'ROLE_EMPLOYER') {
    // Nếu không có quyền hoặc chưa đăng nhập, điều hướng sang trang login
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Nếu chưa đăng nhập (không có token), đá ngay sang trang login
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Cấu hình MainLayout bọc xung quanh các trang */}
      <Route element={<MainLayout />}>

        {/* Tự động chuyển hướng từ trang chủ "/" sang "/jobs" */}
        <Route path="/" element={<Navigate to="/jobs" replace />} />

        {/* Trang danh sách việc làm */}
        <Route path="/jobs" element={<JobListPage />} />

        {/* Trang chi tiết việc làm */}
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Trang danh sách và chi tiết công ty */}
        <Route path="/companies" element={<CompanyListPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />

        {/* Xác thực tài khoản */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/*Route trang Hồ sơ cá nhân (Yêu cầu đăng nhập mới xem được) */}
        <Route path="/profile" element={
          <PrivateRoute>
            <UserProfilePage />
          </PrivateRoute>
        } />

        {/* Route bảo mật dành riêng cho Nhà tuyển dụng */}
        <Route path="/employer/dashboard" element={
          <EmployerRoute>
            <EmployerDashboard />
          </EmployerRoute>
        } />

        {/* 2. Trang tạo tin tuyển dụng mới */}
        <Route path="/employer/create-job" element={
          <EmployerRoute>
            <CreateJob />
          </EmployerRoute>
        } />

      </Route>
    </Routes>
  );
}

export default App;