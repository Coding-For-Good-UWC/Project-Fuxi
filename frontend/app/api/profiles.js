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

export const createProfile = async (userUid, fullname, yearBirth, genres) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/profile `, {
            instituteUid: userUid,
            fullname: fullname,
            yearBirth: yearBirth,
            genres: genres,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteProfile = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/dev/profile`, {
            data: {
                id: id,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateProfile = async (profileId, fullname, yearBirth, genres) => {
    try {
        const response = await axios.put(`${apiUrl}/dev/profile `, {
            profileId: profileId,
            fullname: fullname,
            yearBirth: yearBirth,
            genres: genres,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
