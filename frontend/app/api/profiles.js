import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const getAllProfilesByInstituteUId = async (uid) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/profiles?uid=${uid}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getProfileById = async (id) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/profile?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const createProfile = async (userUid, fullname, yearBirth, genres, description) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/profile `, {
            instituteUid: userUid,
            fullname: fullname,
            yearBirth: yearBirth,
            genres: genres,
            description: description,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteProfile = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/dev/profile?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateProfile = async (id, fullname, yearBirth, language, genres, description) => {
    try {
        const response = await axios.put(`${apiUrl}/dev/profile `, {
            id: id,
            fullname: fullname,
            yearBirth: yearBirth,
            language: language,
            genres: genres,
            description: null,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
