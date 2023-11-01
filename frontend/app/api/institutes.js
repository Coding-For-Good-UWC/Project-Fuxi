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

export const resetPassword = async (email) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/reset-password`, {
            email: email,
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
