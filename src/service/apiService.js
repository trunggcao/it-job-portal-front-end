import axiosClient from "./axiosClient";

const apiService = {

    getAllJobs: (params) => {
        return axiosClient.get('/jobs', { params });
    },
    getJobById: (jobId) => {
        return axiosClient.get(`/jobs/${jobId}`);
    },
    getAllCompanies: (searchKeyword = "") => {
        return axiosClient.get(`/companies?search=${searchKeyword}`);
    },
    getCompanyById: (id) => {
        return axiosClient.get(`/companies/${id}`);
    },
    register: (userDTO) => {

        return axiosClient.post('/register', userDTO);
    },
    login: (authDTO) => {
        return axiosClient.post('/login', authDTO);
    },
    applyJob: (jobId, resumeDTO) => {
        return axiosClient.post(`/candidate/resumes/apply/jobs/${jobId}`, resumeDTO);
    },
    getMyProfile: () => {
        return axiosClient.get('/me');
    },
    getMyAppliedJobs: () => {
        return axiosClient.get('/candidate/resumes/my-apply');
    },
    // REcruiter API
    getEmployerJobs: () => {
        return axiosClient.get('/jobs/employer/my-jobs');
    },
    getResumesByJobId: (jobId) => {
        return axiosClient.get(`/recruiter/resumes/jobs/${jobId}`);
    },
    getAllSkills: () => {
        return axiosClient.get('/skills');
    },
    // create Job
    createJob: (jobDTO) => {
        return axiosClient.post('/jobs', jobDTO);
    },

};

export default apiService;