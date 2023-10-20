import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const getPlaylistById = async (playlistId) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/playlist?playlistId=${playlistId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllPlayListByProfileId = async (profileId) => {
    try {
        const response = await axios.get(`${apiUrl}/dev/playlists?profileId=${profileId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createPlaylist = async (profileId, namePlaylist, tracks) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/playlist`, {
            profileId: profileId,
            namePlaylist: namePlaylist,
            tracks: tracks,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updatePlaylist = async () => {};

export const deletePlaylist = async (playlistId) => {
    try {
        const response = await axios.delete(`${apiUrl}/dev/playlist?playlistId=${playlistId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
