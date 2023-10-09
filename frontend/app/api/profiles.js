import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const createProfile = async (userUid, fullname, yearBirth, language, genres, description) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/profile `, {
            instituteUid: userUid,
            fullname: fullname,
            yearBirth: yearBirth,
            language: language,
            genres: genres,
            description: description,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
