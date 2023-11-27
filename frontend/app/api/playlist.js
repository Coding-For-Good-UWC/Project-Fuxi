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

// export const getPlaylistSuggestions = async (profileId, pageNumber) => {
//     try {
//         const response = await axios.get(`${apiUrl}/dev/playlist/suggest?profileId=${profileId}&pageNumber=${pageNumber}`);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

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

export const addTrackInPlaylist = async (playlistId, trackId) => {
    try {
        const response = await axios.put(`${apiUrl}/dev/playlist/add-track`, {
            playlistId: playlistId,
            trackId: trackId,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const removeTrackInPlaylist = async (playlistId, trackId) => {
    try {
        const response = await axios.put(`${apiUrl}/dev/playlist/remove-track`, {
            playlistId: playlistId,
            trackId: trackId,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deletePlaylist = async (playlistId) => {
    try {
        const response = await axios.delete(`${apiUrl}/dev/playlist`, {
            data: {
                playlistId: playlistId,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteAllPlaylist = async (profileId) => {
    try {
        const response = await axios.delete(`${apiUrl}/dev/playlists`, {
            data: {
                profileId: profileId,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getSuggestionsInPlaymedia = async (profileId, playlistId, artist, language, genre, era) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/playlist/suggest-media`, {
            profileId: profileId,
            playlistId: playlistId,
            artist: artist,
            language: language,
            genre: genre,
            era: era,
        });
        return response.data;
    } catch (error) {
        console.error('Error in searchTrack:', error);
        throw error;
    }
};

export const addSuggetionTrackWhenLikeInPlaylist = async (profileId, playlistId, currentTrackId, preference) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/playlist/add-track-like`, {
            profileId: profileId,
            playlistId: playlistId,
currentTrackId: currentTrackId,
            preference: preference,
            });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addSuggetionTrackWhenDislikeInPlaylist = async (profileId, playlistId) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/playlist/add-10track`, {
            profileId: profileId,
            playlistId: playlistId,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const randomNextTrack = async (profileId, trackIds, trackId) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/playlist/random-next-track`, {
            profileId: profileId,
            trackIds: trackIds,
            trackId: trackId,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
