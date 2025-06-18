import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for your API
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


    // Email Routes
    handleContactUsForm: (contactData: {
        name: string;
        email: string;
        message: string;
    }) => api.post('/contact-us', contactData),

    // Detail Routes
    getUserDetails: () => api.get('/user/details'),
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
    }) => api.post('/user/create-profile', profileData)
};

export default apiService;
