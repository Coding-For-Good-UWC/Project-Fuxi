import 'react-native-gesture-handler';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import colours from '../config/colours';
import { useNavigation, useRoute } from '@react-navigation/native';
import playlist from './../data/data';
import CustomGridLayout from './../components/CustomGridLayout';
import SongItem from '../components/SongItem';
import PlayMediaComponent from '../components/PlayMediaComponent';
import OverlayMediaScreen from './OverlayMediaScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomSheetScrollView from '../components/BottomSheetScrollView';
import FollowPlayMedia from '../components/FollowPlayMedia';

const PlayMedia = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [selectSound, setSelectSound] = useState(route.params?.track || null);
    const [dataTracksOrigin, setDataTracksOrigin] = useState(route.params?.dataTracksOrigin || []);
    const [sound, setSound] = useState();

    const [isOverlay, setIsOverlay] = useState(false);
    const [seconds, setSeconds] = useState(9999);
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

    const handleSubmit = () => {
        setIsOverlay(false);
    };

    useEffect(() => {
        const intervalId = startCountdown();
        return () => {
            clearInterval(intervalId);
        };
    }, [seconds]);

    useLayoutEffect(() => {
        if (selectSound) {
            handleTrackPress(selectSound);
        }
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

    const handleTrackPress = async (item) => {
        if (sound) {
            await sound.unloadAsync();
        }
        console.log(item.Title);
        const { sound, status } = await Audio.Sound.createAsync({
            uri: item.URI,
        });
        setDuration(status.durationMillis / 1000);
        setSelectSound(item);
        setSound(sound);
        setIsPlaying(true);
        await sound.playAsync();
    };

    useEffect(() => {
        return () => {
            if (sound) {
                console.log('Unloading Sound');
                setIsPlaying(false);
                sound.unloadAsync();
            }
        };
    }, [sound, selectSound]);

    useEffect(() => {
        if (sound && isPlaying) {
            sound.setOnPlaybackStatusUpdate((status) => {
                if (typeof status.positionMillis === 'number' && !isNaN(status.positionMillis)) {
                    setPosition(status.positionMillis / 1000);
                }
            });
        }
    }, [sound, isPlaying]);

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    {isOverlay ? (
                        <OverlayMediaScreen isOverlay={handleSubmit} song={selectSound} />
                    ) : (
                        <SafeAreaView style={styles.safeArea}>
                            <PlayMediaComponent
                                song={selectSound}
                                duration={duration}
                                position={position}
                                handleSliderChange={(value) => {
                                    if (sound) {
                                        const newPositionMillis = value * 1000;
                                        sound.setPositionAsync(newPositionMillis);
                                        setPosition(value);
                                    }
                                }}
                                isPlaying={isPlaying}
                                handlePlay={async () => {
                                    if (sound) {
                                        await sound.playAsync();
                                        setIsPlaying(true);
                                    }
                                }}
                                handlePause={async () => {
                                    if (sound) {
                                        await sound.pauseAsync();
                                        setIsPlaying(false);
                                    }
                                }}
                            />
                            <FollowPlayMedia />
                            <TouchableOpacity style={styles.viewPlaylistBottom} onPress={expandHandler}>
                                <Text style={styles.viewPlaylistText}>View playlist</Text>
                            </TouchableOpacity>
                            <BottomSheetScrollView ref={bottomSheetRef} snapTo={'50%'} backgroundColor="#fff" backDropColor="#000">
                                <CustomGridLayout
                                    data={dataTracksOrigin?.map((item, index) => (
                                        <SongItem key={index} item={item} />
                                    ))}
                                    columns={1}
                                    styleLayout={{ paddingHorizontal: 20 }}
                                    styleCell={{ borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}
                                />
                            </BottomSheetScrollView>
                        </SafeAreaView>
                    )}
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
};

export default PlayMedia;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
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
    },
    patientText: {
        fontSize: 16,
        color: '#757575',
    },
    playmediaCenter: {
        flex: 1,
    },
    progressBarView: {
        width: 370,
    },
    navigationPlayer: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
    },
    following: {
        height: 150,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 180,
    },
    viewPlaylistBottom: {
        height: 60,
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        backgroundColor: '#1A1A1A',
        zIndex: 1,
    },
    progressBar: {
        width: '100%',
    },
    progressLevelDuration: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressLabelText: {},
    listSongs: {},
    rowItem: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colours.secondary,
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
