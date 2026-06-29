import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import JobListPage from './Job/JobListPage';
import JobDetailPage from './Job/JobDetailPage';
import CompanyListPage from './Company/CompanyListPage';
import CompanyDetailPage from './Company/CompanyDetailPage';
import RegisterPage from './Auth/RegisterPage';
import LoginPage from './Auth/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// BỔ SUNG: Import trang Dashboard của Nhà tuyển dụng
import EmployerDashboard from './Employer/EmployerDashboard';
import UserProfilePage from './Candidate/UserProfilePage';
import CreateJob from './Employer/CreateJob';
import UpdateJob from './Employer/UpdateJob';
import CreateCompany from './Employer/Company/CreateCompany';
import CompanyCheckRoute from './Employer/Company/CompanyCheckRoute';
import VerifyCompany from './Employer/VerifyCompany/VerifyCompany';
import AdminLayout from './Layout/AdminLayout';
import AdminSkills from './Admin/Skills/AdminSkills';
import AdminDashboard from './Admin/AdminDashboard';
import AdminUsers from './Admin/Users/AdminUsers';
import AdminJobs from './Admin/Jobs/AdminJobs';
import AdminCompanies from './Admin/Companies/AdminCompanies';
import AdminBlogs from './Admin/Blogs/AdminBlogs';
import AdminCompanyVerifications from './Admin/Companies/AdminCompanyVerifications';
import AdminDetailCompanyVerification from './Admin/Companies/AdminDetailCompanyVerification';
import FindCandidate from './Employer/FindCandidate/FindCandidate';
import CandidateProfile from './Candidate/CandidateProfile/CandidateProfile';
import CandidateDetail from './Employer/FindCandidate/CandidateDetail';
import BlogListPage from './Blog/BlogListPage';
import BlogDetailPage from './Blog/BlogDetailPage';

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
    <>
      <ToastContainer position="top-right" autoClose={3000} />
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

          {/* Blog*/}
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />

          {/* Xác thực tài khoản */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/*Route trang Hồ sơ cá nhân (Yêu cầu đăng nhập mới xem được) */}
          <Route path="/profile" element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          } />
          {/*Route trang Hồ sơ OpenToWork (Yêu cầu đăng nhập mới xem được) */}
          <Route path="/profile-cv" element={
            <PrivateRoute>
              <CandidateProfile />
            </PrivateRoute>
          } />

          {/* Route bảo mật dành riêng cho Nhà tuyển dụng */}
          <Route path="/employer/dashboard" element={
            <EmployerRoute>
              <CompanyCheckRoute>
                <EmployerDashboard />
              </CompanyCheckRoute>
            </EmployerRoute>
          } />

          {/* 2. Trang tạo tin tuyển dụng mới */}
          <Route path="/employer/create-job" element={
            <EmployerRoute>
              <CompanyCheckRoute>
                <CreateJob />
              </CompanyCheckRoute>
            </EmployerRoute>
          } />

          <Route path="/employer/update-job/:id" element={
            <EmployerRoute>
              <CompanyCheckRoute>
                <UpdateJob />
              </CompanyCheckRoute>
            </EmployerRoute>
          } />

          {/* Trang tạo công ty mới */}
          <Route path="/employer/create-company" element={
            <EmployerRoute>
              <CreateCompany />
            </EmployerRoute>
          } />

          {/* Trang xác thực */}
          <Route path="/employer/verify-company" element={
            <EmployerRoute>
              <VerifyCompany />
            </EmployerRoute>
          } />

          <Route path="/employer/find-candidates" element={
            <EmployerRoute>
              <FindCandidate />
            </EmployerRoute>
          } />
          <Route path="/employer/candidate-cv/:id" element={
            <EmployerRoute>
              <CandidateDetail />
            </EmployerRoute>
          } />
        </Route>


        {/* Trang Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="companyverifications" element={<AdminCompanyVerifications />} />
          <Route path="companyverifications/:id" element={<AdminDetailCompanyVerification />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;