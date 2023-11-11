import axios from 'axios';

export const resetPasswordSendOTP = async (email, CodeOTP) => {
    try {
        const response = await axios.post(`https://oo5ebuu880.execute-api.ap-southeast-1.amazonaws.com/mailer/reset-password`, {
            email: email,
            CodeOTP: CodeOTP,
        });
        return response.data;
    } catch (error) {
        console.error('Error in searchTrack:', error);
        throw error;
    }
};
