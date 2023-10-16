import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const createPlaylist = async (profileId, namePlaylist, tracks) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/playlist`, {
            profileId: profileId,
            namePlaylist: namePlaylist,
            tracks: tracks,
        });
        return response.data;
    } catch (error) {
        console.error('Error in createPlaylist:', error);
        throw error;
    }
};
