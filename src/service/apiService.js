import axiosClient from "./axiosClient";

const apiService = {

    // job api
    getAllJobs: (params) => {
        return axiosClient.get('/jobs', { params });
    },
    getJobById: (jobId) => {
        return axiosClient.get(`/jobs/${jobId}`);
    },
    getJobsByCompanyId: (companyId) => {
        return axiosClient.get(`/jobs/companies/${companyId}`);
    },


    createJob: (jobDTO) => {
        return axiosClient.post('/jobs', jobDTO);
    },
    updateJob: (jobId, jobDTO) => {
        return axiosClient.put(`/jobs/${jobId}`, jobDTO);
    },

    // companies api

    createCompany: (companyDTO) => {
        return axiosClient.post('/companies', companyDTO);
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

    //skill API

    getAllSkills: () => {
        return axiosClient.get('/skills');
    },
    searchSkills: (keyword) => {
        return axiosClient.get(`/skills/search?keyword=${keyword}`);
    },

    createSkill: (skillDTO) => {
        return axiosClient.post('/skills', skillDTO);
    },

    updateSkill: (id, skillDTO) => {
        return axiosClient.put(`/skills/${id}`, skillDTO);
    },

    // Company verification API
    getHistoryVerification: (id) => {
        return axiosClient.get(`/verifications/employer/history/${id}`);
    },
    createVerificationRequest: (verificationDTO) => {
        return axiosClient.post('/verifications/employer', verificationDTO);
    },
    getAllVerificationRequests: () => {
        return axiosClient.get('/verifications/admin');
    },
    getVerificationRequestById: (id) => {
        return axiosClient.get(`/verifications/${id}`);
    },
    approveVerificationRequest: (id) => {
        return axiosClient.put(`/verifications/admin/approve-verification/${id}`);
    },
    rejectVerificationRequest: (id, rejectData) => {
        return axiosClient.put(`/verifications/admin/reject-verification/${id}`, rejectData);
    },

    // ADMIN API
    getAllUsers: (keyword = "") => {
        return axiosClient.get('/admin/users', {
            params: {
                keyword: keyword
            }
        });
    },
    getUserById: (id) => {
        return axiosClient.get(`/users/${id}`);
    },
    updateUser: (id, userDTO) => {
        return axiosClient.put(`/users/${id}`, userDTO);
    },


    // Profile Candidate API
    getCandidateProfile: (id) => {
        return axiosClient.get(`/candidate/profiles/${id}`);
    },
    createOrSaveCandidateProfile: (id, profileDTO) => {
        return axiosClient.post(`/candidate/profiles/save/${id}`, profileDTO);
    },

    // Project Candidate API
    getCandidateProjectsByUserId: (id) => {
        return axiosClient.get(`/candidate/projects/user/${id}`);
    },
    createCandidateProject: (id, projectDTO) => {
        return axiosClient.post(`/candidate/projects/add/${id}`, projectDTO);
    },
    updateCandidateProject: (projectId, projectDTO) => {
        return axiosClient.put(`/candidate/projects/update/${projectId}`, projectDTO);
    },
    deleteCandidateProject: (projectId) => {
        return axiosClient.delete(`/candidate/projects/delete/${projectId}`);
    },

    // Find Candidate API (employer)
    findCandidates: (params) => {
        return axiosClient.get('/candidate/profiles/search', { params });
    },
    getCandidateProfileDetail: (profileId, employerId) => {
        return axiosClient.get(`/candidate/profiles/details/${profileId}`, {
            params: {
                employerId: employerId
            }
        });
    },
    getCandidateProjectsByProfileId: (id) => {
        return axiosClient.get(`/candidate/projects/details/${id}`);
    },
    // unlock profile by emloyer
    unlockCandidateProfile: (profileId, employerId) => {
        return axiosClient.post('/candidate/profiles/unlock', null, {
            params: {
                profileId: profileId,
                employerId: employerId
            }
        });
    },

};

export default apiService;