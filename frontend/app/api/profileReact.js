import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const getReactTrackByProfileId = async (profileId) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/profile-react?profileId=${profileId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getLikeTrackByProfileId = async (profileId) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/profile-react/like?profileId=${profileId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const createProfileReact = async (profileId, reactTracks) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/profile-react`, {
            profileId: profileId,
            reactTracks: reactTracks,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const addReactTrack = async (profileId, trackId, preference) => {
    // preference = Enum['strongly dislike', 'dislike', 'neutral', 'like', 'strongly like']
    try {
        const response = await axios.put(`${apiUrl}/dev/profile-react/add`, {
            profileId: profileId,
            trackId: trackId,
            preference: preference,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const removeReactTrack = async (profileId, trackId) => {
    try {
        const response = await axios.put(`${apiUrl}/dev/profile-react/remove`, {
            profileId: profileId,
            trackId: trackId,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteProfileReact = async (profileId) => {
    try {
        const response = await axios.delete(`${apiUrl}/dev/profile-react?profileId=${profileId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
