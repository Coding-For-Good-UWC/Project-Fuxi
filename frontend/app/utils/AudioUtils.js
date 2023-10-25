import { Audio } from 'expo-av';

export const getDuration = async (uri) => {
    const sound = new Audio.Sound();
    try {
        await sound.loadAsync({ uri });
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
            const durationMillis = status.durationMillis;
            const durationSeconds = durationMillis / 1000;
            return durationSeconds;
        } else {
            // console.error('Unable to download song.');
            return null;
        }
    } catch (error) {
        // console.error('Error when reading song time:', error);
        return null;
    } finally {
        await sound.unloadAsync();
    }
};

export const totalDurationTracks = async (tracks) => {
    let total = 0;
    for (const track of tracks) {
        const duration = await getDuration(track.URI);
        if (duration) {
            total += duration;
        }
    }
    return total;
};

export const formatTime = (seconds) => {
    if (seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    } else {
        return '0:00';
    }
};

export const secondsToTimeString = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};
