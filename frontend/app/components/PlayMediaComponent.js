import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import PlayMediaSlider from './PlayMediaSlider';
import { getReactTrackByTrackId } from '../api/profileReact';
import { preference } from '../utils/utils';
import { getStoreData } from '../utils/AsyncStorage';

function findPreviousTrack(tracks, trackId) {
    const index = tracks.findIndex((track) => track._id === trackId);
    if (index === -1) {
        return null;
    }
    const previousIndex = index === 0 ? tracks.length - 1 : index - 1;
    return tracks[previousIndex];
}

function findNextTrack(tracks, trackId) {
    const index = tracks.findIndex((track) => track._id === trackId);
    if (index === -1) {
        return null;
    }
    const nextIndex = index === tracks.length - 1 ? 0 : index + 1;
    return tracks[nextIndex];
}

const getReact = async (trackId) => {
    const profile0 = await getStoreData('profile0');
    if (profile0 !== null) {
        const { _id } = JSON.parse(profile0);
        const response = await getReactTrackByTrackId(_id, trackId);
        const { data } = response;
        if (data?.preference !== undefined) {
            for (const key in preference) {
                if (preference[key].status === data.preference) {
                    console.log(preference[key]);
                    return preference[key];
                }
            }
        }
    }
};

const PlayMediaComponent = ({ selectSound, setSelectSound, reactTrack, setReactTrack, setSeconds, dataTracksOrigin }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState();
    const [duration, setDuration] = useState(0);

    const handlePlay = async () => {
        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };
    const handlePause = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const handleTrackPress = async (item) => {
        console.log(item.Title);
        setSeconds(90);
        setSelectSound(item);
        const { sound, status } = await Audio.Sound.createAsync({
            uri: item.URI,
        });
        setSound(sound);
        setDuration(status.durationMillis / 1000);
        setIsPlaying(true);
        await sound.playAsync();
    };

    const handlePrevTrack = async () => {
        if (Object.keys(dataTracksOrigin).length !== 0) {
            handleTrackPress(findPreviousTrack(dataTracksOrigin, selectSound._id));
        }
    };

    const handleNextTrack = async () => {
        if (Object.keys(dataTracksOrigin).length !== 0) {
            handleTrackPress(findNextTrack(dataTracksOrigin, selectSound._id));
        }
    };

    useEffect(() => {
        const unloadSound = async () => {
            if (sound) {
                await sound.unloadAsync();
            }
        };
        unloadSound();
        handleTrackPress(selectSound);
        const getReactTrack = async () => {
            const react = await getReact(selectSound._id);
            if (react !== undefined) {
                setReactTrack(react);
            } else {
                setReactTrack([]);
            }
        };
        getReactTrack();
    }, [selectSound]);

    useEffect(() => {
        if (reactTrack.status === 'dislike' || reactTrack.status === 'strongly dislike') {
            handleNextTrack();
        }
    }, [reactTrack]);

    return (
        <>
            <View style={styles.playlistHeader}>
                <View style={styles.viewImage}>
                    <Image style={styles.image} source={{ uri: selectSound.ImageURL }} />
                </View>
                <Text style={styles.trackText} numberOfLines={2}>
                    {selectSound.Title}
                </Text>
                <Text style={styles.patientText} numberOfLines={1}>
                    {selectSound.Artist}
                </Text>
            </View>
            <PlayMediaSlider
                sound={sound}
                duration={duration}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                autoNextTrack={() => handleNextTrack()}
            />
            <View style={styles.navigationPlayer}>
                <TouchableOpacity onPress={handlePrevTrack}>
                    <Ionicons name="play-skip-back" size={40} color={'#222C2D'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={isPlaying ? handlePause : handlePlay}>
                    <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={60} color={'#222C2D'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNextTrack}>
                    <Ionicons name="play-skip-forward" size={40} color={'#222C2D'} />
                </TouchableOpacity>
            </View>
        </>
    );
};

export default PlayMediaComponent;

const styles = StyleSheet.create({
    playlistHeader: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewImage: {
        marginTop: 30,
        height: 250,
        width: 250,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.06,
    },
    image: {
        borderRadius: 10,
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
    trackText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222C2D',
        marginTop: 10,
        textAlign: 'center',
    },
    patientText: {
        fontSize: 16,
        color: '#757575',
    },
    navigationPlayer: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
    },
    viewPlaylistBottom: {
        height: 60,
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        backgroundColor: '#1A1A1A',
    },
    listSongs: {},
    rowItem: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    viewSong: {},
    songImage: {
        height: 50,
        width: 50,
        borderRadius: 4,
        marginRight: 14,
    },
    rowItemText: {
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
    },
    artistText: {
        fontSize: 12,
    },
    viewPlaylistText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 18,
    },
});
