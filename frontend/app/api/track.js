import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const searchTrack = async (title, pageNumber) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/track/searchTrack?title=${title}&pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error('Error in searchTrack:', error);
        throw error;
    }
};

export const getTracksByArtist = async (artist, pageNumber) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/track/artist?artist=${artist}&pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error('Error in searchTrack:', error);
        throw error;
    }
};

export const getTrackById = async (id) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/track?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in searchTrack:', error);
        throw error;
    }
};
