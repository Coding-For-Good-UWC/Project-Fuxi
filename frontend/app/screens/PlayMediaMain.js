import 'react-native-gesture-handler';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions, View } from 'react-native';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomGridLayout from './../components/CustomGridLayout';
import SongItem from '../components/SongItem';
import PlayMediaComponent from '../components/PlayMediaComponent';
import BottomSheetScrollView from '../components/BottomSheetScrollView';
import FollowPlayMedia from '../components/FollowPlayMedia';
import { addSuggetionTrackWhenDislikeInPlaylist, deletePlaylist, getPlaylistById, randomNextTrack, removeTrackInPlaylist } from '../api/playlist';
import { getStoreData } from '../utils/AsyncStorage';

async function findPreviousTrack(playlistId, tracks, trackId) {
    const index = tracks.findIndex((track) => track._id === trackId);
    if (index === -1) {
        const profile0 = await getStoreData('profile0');
        const { _id } = JSON.parse(profile0);
        const trackIds = tracks.map((track) => track._id);
        const response = await randomNextTrack(_id, trackIds, trackId);
        if (response.data !== null) {
            return response.data;
        }
    }
    const previousIndex = index === 0 ? tracks.length - 1 : index - 1;
    return tracks[previousIndex];
}

async function findNextTrack(playlistId, tracks, trackId) {
    const index = tracks.findIndex((track) => track._id === trackId);
    if (index === -1) {
        const profile0 = await getStoreData('profile0');
        const { _id } = JSON.parse(profile0);
        const trackIds = tracks.map((track) => track._id);
        const response = await randomNextTrack(_id, trackIds, trackId);
        if (response.data !== null) {
            return response.data;
        }
    }

    const nextIndex = index === tracks.length - 1 ? 0 : index + 1;

    if (nextIndex === 0) {
        if (!playlistId) {
            const profile0 = await getStoreData('profile0');
            const { _id } = JSON.parse(profile0);
            const trackIds = tracks.map((track) => track._id);
            const response = await randomNextTrack(_id, trackIds, trackId);
            if (response.data !== null) {
                return response.data;
            }
        }
    }
    return tracks[nextIndex];
}

const PlayMediaMain = ({ playlistId, selectSound, setSelectSound, dataTracks, setDataTracks, currentReactTrack }) => {
    const navigation = useNavigation();
    const [reactTrack, setReactTrack] = useState(currentReactTrack || {});

    const bottomSheetRef = useRef(null);

    const expandHandler = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (playlistId) {
                const response = await getPlaylistById(playlistId);
                setDataTracks(response.data.tracks);
            }
        };

        fetchData();
    }, []);

    const handleTrackPress = async (item) => {
        setSelectSound(item);
        const isItemIdExist = dataTracks.findIndex((data) => data._id === item._id);
        if (isItemIdExist === -1) {
            dataTracks.push(item);
        }
    };

    const handlePrevTrack = async () => {
        if (Object.keys(dataTracks).length !== 0) {
            await handleTrackPress(await findPreviousTrack(playlistId, dataTracks, selectSound._id));
        }
    };

    const handleNextTrack = async () => {
        if (Object.keys(dataTracks).length !== 0) {
            await handleTrackPress(await findNextTrack(playlistId, dataTracks, selectSound._id));
        }
    };

    const removeTrack = async () => {
        const trackArrRemove = dataTracks.filter((track) => track._id !== selectSound._id);
        if (Object.keys(trackArrRemove).length !== 0) {
            if (playlistId !== null && playlistId !== undefined) {
                await removeTrackInPlaylist(playlistId, selectSound._id);
                if (Object.keys(trackArrRemove).length <= 5) {
                    const profile0 = await getStoreData('profile0');
                    const { _id } = JSON.parse(profile0);
                    await addSuggetionTrackWhenDislikeInPlaylist(_id, playlistId);
                    const response = await getPlaylistById(playlistId);
                    setDataTracks(response.data.tracks);
                } else {
                    setDataTracks(trackArrRemove);
                }
            }
            handleNextTrack();
        }
        if (Object.keys(trackArrRemove).length === 0) {
            if (playlistId !== undefined) {
                navigation.navigate('LibraryScreen');
                await deletePlaylist(playlistId);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <PlayMediaComponent selectSound={selectSound} handlePrevTrack={handlePrevTrack} handleNextTrack={handleNextTrack} />
                <FollowPlayMedia
                    playlistId={playlistId}
                    selectSound={selectSound}
                    reactTrack={reactTrack}
                    setReactTrack={setReactTrack}
                    dataTracks={dataTracks}
                    setDataTracks={setDataTracks}
                    removeTrack={removeTrack}
                    handleNextTrack={handleNextTrack}
                />
                {Object.keys(dataTracks).length >= 1 && (
                    <TouchableOpacity style={styles.viewPlaylistBottom} onPress={expandHandler}>
                        <Text style={styles.viewPlaylistText}>View playlist</Text>
                    </TouchableOpacity>
                )}
            </View>
            <BottomSheetScrollView ref={bottomSheetRef} snapTo={'50%'} backgroundColor="#fff" backDropColor="#000">
                <CustomGridLayout
                    data={dataTracks?.map((item, index) => (
                        <SongItem key={index} item={item} onPress={() => setSelectSound(item)} />
                    ))}
                    columns={1}
                    styleLayout={{ paddingHorizontal: 20 }}
                    styleCell={{ borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}
                />
            </BottomSheetScrollView>
        </SafeAreaView>
    );
};

export default PlayMediaMain;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    viewPlaylistBottom: {
        height: 60,
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        backgroundColor: '#1A1A1A',
        zIndex: 1,
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
