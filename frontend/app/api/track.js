import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const searchTrack = async (title, pageNumber) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/track/searchTrack`, {
            title: title,
            pageNumber: pageNumber,
        });
        return response.data;
    } catch (error) {
        console.error('Error in searchTrack:', error);
        throw error;
    }
};
