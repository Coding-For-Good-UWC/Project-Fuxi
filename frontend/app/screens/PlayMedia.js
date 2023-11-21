import 'react-native-gesture-handler';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions, View } from 'react-native';
import React, { useContext, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomGridLayout from './../components/CustomGridLayout';
import SongItem from '../components/SongItem';
import PlayMediaComponent from '../components/PlayMediaComponent';
import OverlayMediaScreen from './OverlayMediaScreen';
import BottomSheetScrollView from '../components/BottomSheetScrollView';
import FollowPlayMedia from '../components/FollowPlayMedia';
import { deletePlaylist, removeTrackInPlaylist } from '../api/playlist';
import { getStoreData } from '../utils/AsyncStorage';
import { AppContext } from '../context/AppContext';
import PlayMediaDetailAndSuggestion from './PlayMediaDetailAndSuggestion';

const defaultSong = {
    Artist: '',
    Title: 'Choose song in playlist',
    ImageURL: require('../assets/default_l8mbsa.png'),
    URI: '',
};

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

const PlayMedia = () => {
    const width = Dimensions.get('window').width;
    const { isReRender, setIsReRender } = useContext(AppContext);
    const route = useRoute();
    const navigation = useNavigation();
    const { dataTracksOrigin, currentReactTrack, playlistId } = route.params;

    const [reactTrack, setReactTrack] = useState(currentReactTrack || {});
    const [selectSound, setSelectSound] = useState(route.params?.track || dataTracksOrigin[0] || defaultSong);
    const [dataTracks, setDataTracks] = useState(dataTracksOrigin || []);

    const [isOverlay, setIsOverlay] = useState(false);
    const [seconds, setSeconds] = useState(90);
    const bottomSheetRef = useRef(null);

    const expandHandler = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    const startCountdown = () => {
        const intervalId = setInterval(() => {
            if (seconds > 0) {
                setSeconds((prevSeconds) => prevSeconds - 1);
            } else {
                setIsOverlay(true);
                clearInterval(intervalId);
            }
        }, 1000);

        return intervalId;
    };

    const handleTrackPress = async (item) => {
        console.log(item.Title);
        setSeconds(90);
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
            const profile0 = await getStoreData('profile0');
            if (profile0 !== null) {
                const { _id } = JSON.parse(profile0);
                await removeTrackInPlaylist(_id, selectSound._id);
            }
        } else {
            setIsReRender(!isReRender);
            if (playlistId !== undefined) {
                await deletePlaylist(playlistId);
                navigation.navigate('LibraryScreen');
            }
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButtonHeader} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-down" size={30} color={'#3C4647'} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <SafeAreaView style={styles.safeArea}>
                        <OverlayMediaScreen
                            selectSound={selectSound}
                            isModalVisible={isOverlay}
                            isOverlay={() => setIsOverlay(false)}
                            followPlayMedia={
                                <FollowPlayMedia
                                    selectSound={selectSound}
                                    reactTrack={reactTrack}
                                    setReactTrack={setReactTrack}
                                    dataTracks={dataTracks}
                                    setDataTracks={setDataTracks}
                                    handleNextTrack={handleNextTrack}
                                />
                            }
                        />
                        <Carousel
                            loop={false}
                            enabled={true}
                            width={width}
                            height={'100%'}
                            data={[
                                <>
                                    <PlayMediaComponent
                                        selectSound={selectSound}
                                        handlePrevTrack={handlePrevTrack}
                                        handleNextTrack={handleNextTrack}
                                    />
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
                                </>,
                                <PlayMediaDetailAndSuggestion selectSound={selectSound} dataTracks={dataTracks} setDataTracks={setDataTracks} />,
                            ]}
                            renderItem={({ item }) => <View style={{ flex: 1 }}>{item}</View>}
                        />
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

export default PlayMedia;

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
