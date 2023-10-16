import 'react-native-gesture-handler';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import colours from '../config/colours';
import { useNavigation, useRoute } from '@react-navigation/native';
import playlist from './../data/data';

const defaultSong = {
    artwork: 'https://res.cloudinary.com/dusmue7d9/image/upload/v1695711862/default_l8mbsa.png',
    title: 'Choose song in playlist',
    artist: '',
    url: '',
};

const PlayMedia = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const buttonSheetRef = useRef(null);
    const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [selectSound, setSelectSound] = useState(route.params?.track || null);
    const [sound, setSound] = useState();

    const handleTrackPress = async (item) => {
        if (sound) {
            await sound.unloadAsync();
        }
        console.log(item.title);
        const { sound, status } = await Audio.Sound.createAsync({
            uri: item.url,
        });
        setDuration(status.durationMillis / 1000);
        setSelectSound(item);
        setSound(sound);
        setIsPlaying(true);
        await sound.playAsync();
    };

    useLayoutEffect(() => {
        if (selectSound) {
            handleTrackPress(selectSound);
        }
    }, [navigation]);

    function handleBottomSheet() {
        buttonSheetRef.current?.present();
        setTimeout(() => {
            setIsOpenBottomSheet(true);
        }, 100);
    }

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

    const handleSliderChange = (value) => {
        if (sound) {
            const newPositionMillis = value * 1000;
            sound.setPositionAsync(newPositionMillis);
            setPosition(value);
        }
    };

    const getSoundToUpdate = (currentIndex, songList) => {
        const lastIndex = songList.length;

        if (currentIndex == lastIndex) {
            return songList[0];
        }
        if (currentIndex < 0) {
            return songList[lastIndex - 1];
        }

        return songList[currentIndex];
    };

    const handleNextPrevSound = async (index) => {
        if (sound) {
            await sound.unloadAsync();
            setIsPlaying(false);
        }

        const updateSound = getSoundToUpdate(index, playlist.tracks);

        const { sound, status } = await Audio.Sound.createAsync({
            uri: updateSound.url,
        });
        setDuration(status.durationMillis / 1000);
        setPosition(0);
        setSelectSound(updateSound);
        setSound(sound);
        await sound.playAsync();
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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

    useEffect(() => {
        return () => {
            if (sound) {
                console.log('Unloading Sound');
                setIsPlaying(false);
                sound.unloadAsync();
            }
        };
    }, [sound, selectSound]);

    // useEffect(() => {
    //     if (sound && isPlaying) {
    //         sound.setOnPlaybackStatusUpdate((status) => {
    //             setPosition(status.positionMillis / 1000);
    //         });
    //     }
    // }, [sound, isPlaying]);

    const renderSongs = ({ item, index }) => {
        return (
            <View style={styles.rowItem}>
                <TouchableOpacity
                    onPress={() => handleTrackPress(item)}
                    style={{ flexDirection: 'row', width: '100%' }}
                >
                    <View style={styles.viewSong}>
                        <Image source={{ uri: item.artwork }} style={styles.songImage} />
                    </View>
                    <View style={styles.rowItemText}>
                        <Text style={styles.titleText}>{item.title}</Text>
                        <Text style={styles.artistText}>{item.artist}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const RenderPlayer = ({ song }) => {
        const currentSong = song || defaultSong;
        return (
            <>
                <View style={styles.playlistHeader}>
                    <View style={styles.viewImage}>
                        <Image
                            style={[styles.image, { opacity: isOpenBottomSheet ? 0.6 : 1 }]}
                            source={{ uri: currentSong.artwork }}
                        />
                    </View>
                    <Text style={styles.trackText} numberOfLines={2}>
                        {currentSong.title}
                    </Text>
                    <Text style={styles.patientText} numberOfLines={1}>
                        {currentSong.artist}
                    </Text>
                </View>
                <View style={styles.playmediaCenter}>
                    <View style={styles.progressBarView}>
                        <Slider
                            style={styles.progressBar}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onValueChange={handleSliderChange}
                            thumbTintColor={colours.deepTurquoise}
                            minimumTrackTintColor={colours.genreMalay}
                            maximumTrackTintColor="#000000"
                        />
                    </View>
                    <View style={styles.progressLevelDuration}>
                        <Text style={styles.progressLabelText}>{formatTime(position)}</Text>
                        <Text style={styles.progressLabelText}>{formatTime(duration)}</Text>
                    </View>
                    <View style={styles.navigationPlayer}>
                        <TouchableOpacity
                            onPress={() => {
                                if (selectSound) {
                                    handleNextPrevSound(selectSound.id - 2 || 0);
                                }
                            }}
                        >
                            <Ionicons name="play-skip-back" size={40} color={'#222C2D'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={isPlaying ? handlePause : handlePlay}>
                            <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={60} color={'#222C2D'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (selectSound) {
                                    handleNextPrevSound(selectSound.id || 0);
                                }
                            }}
                        >
                            <Ionicons name="play-skip-forward" size={40} color={'#222C2D'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.following}>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <Ionicons name="heart-outline" size={50} color={'#222C2D'} />
                        <Text>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <Ionicons name="sad-outline" size={50} color={'#222C2D'} />
                        <Text>Dislike</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <SafeAreaView style={[styles.safeArea, { backgroundColor: isOpenBottomSheet ? '#A9A9A9' : 'white' }]}>
                    <RenderPlayer song={selectSound} />
                    <BottomSheetModal
                        overDragResistanceFactor={0}
                        ref={buttonSheetRef}
                        snapPoints={['50%', '100%']}
                        index={0}
                        handleIndicatorStyle={{ display: 'none' }}
                        backgroundStyle={{
                            borderRadius: 0,
                        }}
                        onDismiss={() => setIsOpenBottomSheet(false)}
                        enablePanDownToClose
                    >
                        <FlatList
                            data={playlist.tracks}
                            renderItem={renderSongs}
                            style={styles.listSongs}
                            keyExtractor={(item) => item.id}
                        />
                    </BottomSheetModal>
                    <TouchableOpacity style={styles.viewPlaylistBottom} onPress={handleBottomSheet}>
                        <Text style={styles.viewPlaylistText}>View playlist</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default PlayMedia;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
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
