import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const signUpInstitute = async (name, email, password) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/signup`, {
            name: name,
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        console.error('Error in signUpInstitute:', error);
        throw error;
    }
};

export const signInInstitute = async (email, password) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/signin`, {
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        console.error('Error in signInInstitute:', error);
        throw error;
    }
};

export const updateOTP = async (email, CodeOTP) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/update-otp`, {
            email: email,
            CodeOTP: CodeOTP,
        });
        return response.data;
    } catch (error) {
        console.error('Error in resetPassword:', error);
        throw error;
    }
};

export const changePassword = async (email, oldPassword, newPassword) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/change-password`, {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword,
        });
        return response.data;
    } catch (error) {
        console.error('Error in resetPassword:', error);
        throw error;
    }
};

export const changePasswordInReset = async (token, CodeOTP, newPassword) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/change-reset-password`, {
            token: token,
            OTP: CodeOTP,
            newPassword: newPassword,
        });
        return response.data;
    } catch (error) {
        console.error('Error in resetPassword:', error);
        throw error;
    }
};

export const deleteAccount = async (email) => {
    try {
        const response = await axios.delete(`${apiUrl}/dev/institute`, {
            data: {
                email: email,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const verifyAccount = async (token, OTP) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/verify-account`, {
            token: token,
            OTP: OTP,
        });
        return response.data;
    } catch (error) {
        console.error('Error in resetPassword:', error);
        throw error;
    }
};
