import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for your API
// const BASE_URL = 'https://sarajodapi.vercel.app/api/v1'; // Replace with your actual API URL
const BASE_URL = 'https://thoroughly-romantic-quetzal.ngrok-free.app/api/v1'; // Replace with your actual API URL

// Create an Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000 // Adjust timeout as needed
});

// Add a request interceptor to include the authorization token
api.interceptors.request.use(
    async (config: any) => {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: any) => {
        // Handle the error here
        return Promise.reject(error);
    }
);

// API Service functions
const apiService = {
    // Auth Routes
    registerUser: (userData: {
        email: string;
        name: string;
        phoneNumber: string;
    }) => api.post('/auth/register', userData),
    verifyOTPRegister: (otpData: {
        email: string;
        otp: string;
        fullName: string;
        phoneNumber: string;
    }) => api.post('/auth/verify-register-otp', otpData),
    loginUser: (credentials: { email: string }) =>
        api.post('/auth/login', credentials),
    verifyOTPLogin: (otpData: { email: string; otp: string }) =>
        api.post('/auth/verify-login-otp', otpData),
    resendOTP: (email: string) => api.post('/auth/resend-otp', { email }),
    isMasterPass: () => api.get('/auth/is-Master-Pass'),
    validateMasterPass: (masterPassValues: { masterPass: number }) =>
        api.post('/auth/validate-master-password', masterPassValues),
    regitserMasterPass: (masterPassValues: { masterPass: string }) =>
        api.post('/auth/set-master-password', masterPassValues),
    requestOtpForgetPass: (email: any) =>
        api.post('/auth/forget-password', email),
    resetPassVerify: (payload: {
        email: string;
        otp: string;
        newPassword: string;
    }) => api.post('/auth/forget-password-verify', payload),
    updatePasswordWithOtp: (payload: {
        email: string;
        otp: string;
        newPassword: string;
    }) => api.post('/auth/forget-password-verify', payload),

    // Email Routes
    handleContactUsForm: (contactData: {
        name: string;
        email: string;
        message: string;
    }) => api.post('/contact-us', contactData),

    // Detail Routes
    getUserDetails: () => api.get('/user/details'),
    getRefreshToken: () => api.get('/user/refreshToken'),
    updateUserAvatar: (id: string, request: {}) =>
        api.post(`/user/avatar/${id}`, request),
    updateUser: (email: string) => api.post(`/user/update/${email}`),
    deleteUpdateUser: (email: string) => api.delete(`/user/update/${email}`),
    verifyOTPUpdateUser: (otpData: {
        email: string;
        name: string;
        phoneNumber: string;
        otp: string;
    }) => api.put('/user/update/verifyotp', otpData),
    getAllRequest: () => api.get('/user/requests'),
    createProfile: (profileData: {
        profileName: string;
        profileNumber: string;
    }) => api.post('/user/create-profile', profileData),

    //Transaction
    startTransaction: (transactionData: {
        profileId: string;
        transactionCollectionId: string;
        partnerName: string;
        partnerEmail: string;
        partnerPhoneNumber: string;
        active: boolean;
    }) => api.post('/transaction/create-transaction-table', transactionData),
    createTransaction: (transactionPayload: any) =>
        api.post('/transaction/create-transaction', transactionPayload),
    updateTransaction: (transactionId: string, transactionPayload: any) =>
        api.post(
            `/transaction/update-transaction/${transactionId}`,
            transactionPayload
        ),
    getAllTransaction: (profileId: any) =>
        api.post('/transaction/transactions', { profileId }),

    deleteTransaction: (transactionAmountDetailId: string, profileId: any) =>
        api.delete(
            `/transaction/transaction/${transactionAmountDetailId}/${profileId}`
        ),
    deleteTransactionTable: (transactionTableId: string, profileId: string) =>
        api.delete(
            `/transaction/transaction-table/${transactionTableId}/profile/${profileId}`
        ),

    //Business Partner and Request
    getAllRequests: () => api.get('/tickets'),
    // Business Partner APIs
    getAllBusinessPartners: (profileId: string) => api.get(`/user/business-partner/list?profileId=${profileId}`),
    addBusinessPartnerToProfile: (payload: { partnerPhoneNumber: string; profileId: string; role: string; permissions: string[] }) =>
      api.post('/user/business-partner/add', payload),
    removeBusinessPartnerFromProfile: (payload: { partnerUserId: string; profileId: string }) =>
      api.post('/user/business-partner/remove', payload),
    getProfilesForBusinessPartner: () => api.get('/user/business-partner/profiles'),

    //Staff
    addStaffMember: (payload: any) => api.post('/staff', payload),
    getAllStaff: (profileId: any) => api.get(`/staff/${profileId}`),
    payStaffMember: (payload: any) => api.post('/staff/salary', payload),
    deleteStaffMember: (staffId: any) => api.delete(`/staff/${staffId}`)
};

export default apiService;
