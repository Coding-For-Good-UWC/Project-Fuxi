import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const resetPasswordSendOTP = async (email, CodeOTP) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/mailer/reset-password`, {
            email: email,
            CodeOTP: CodeOTP,
        });
        return response.data;
    } catch (error) {
        console.error('Error in searchTrack:', error);
        throw error;
    }
};
