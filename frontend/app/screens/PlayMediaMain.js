import 'react-native-gesture-handler';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions, View } from 'react-native';
import React, { useRef, useState, useCallback } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomGridLayout from './../components/CustomGridLayout';
import SongItem from '../components/SongItem';
import PlayMediaComponent from '../components/PlayMediaComponent';
import BottomSheetScrollView from '../components/BottomSheetScrollView';
import FollowPlayMedia from '../components/FollowPlayMedia';
import { deletePlaylist, removeTrackInPlaylist } from '../api/playlist';
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

const PlayMediaMain = ({ playlistId, selectSound, setSelectSound, dataTracks, setDataTracks, currentReactTrack }) => {
    const navigation = useNavigation();
    const [reactTrack, setReactTrack] = useState(currentReactTrack || {});

    const bottomSheetRef = useRef(null);

    const expandHandler = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    const handleTrackPress = async (item) => {
        console.log(item.Title);
        setSelectSound(item);
    };

    const handlePrevTrack = async () => {
        if (Object.keys(dataTracks).length !== 0) {
            await handleTrackPress(findPreviousTrack(dataTracks, selectSound._id));
        }
    };

    const handleNextTrack = async () => {
        if (Object.keys(dataTracks).length !== 0) {
            await handleTrackPress(findNextTrack(dataTracks, selectSound._id));
        }
    };

    const removeTrack = async () => {
        const trackArrRemove = dataTracks.filter((track) => track._id !== selectSound._id);
        setDataTracks(trackArrRemove);
        if (Object.keys(trackArrRemove).length !== 0) {
            if (playlistId !== null && playlistId !== undefined) {
                const response = await removeTrackInPlaylist(playlistId, selectSound._id);
                console.log(response.data);
            }
        } else {
            if (playlistId !== undefined) {
                navigation.navigate('LibraryScreen');
                await deletePlaylist(playlistId);
            }
        }
    };

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <SafeAreaView style={styles.safeArea}>
                        <View style={{ backgroundColor: '#fff', flex: 1 }}>
                            <PlayMediaComponent selectSound={selectSound} handlePrevTrack={handlePrevTrack} handleNextTrack={handleNextTrack} />
                            <FollowPlayMedia
                                selectSound={selectSound}
                                reactTrack={reactTrack}
                                setReactTrack={setReactTrack}
                                removeTrack={removeTrack}
                                handleNextTrack={handleNextTrack}
                            />
                            {Object.keys(dataTracks).length !== 0 && (
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
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
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
