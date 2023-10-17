import 'react-native-gesture-handler';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import ToggleDialog from './ToggleDialog';

const PlayMediaComponent = ({ song, duration, position, handleSliderChange, isPlaying, handlePause, handlePlay }) => {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const statusLikeEnum = { Normal: '#222C2D', Medium: '#137882', High: '#FFC857' };
    const [statusLike, setStatusLike] = useState(null);
    const [statusDislike, setStatusDislike] = useState(null);

    const showDialogLike = () => {
        if (statusLike == null) {
            setDialogProps({
                title: 'Like this song?',
                desc: 'This song will be played more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusLike(),
                onPressNo: () => setIsDialogVisible(false),
            });
        } else if (statusLike == statusLikeEnum.Medium) {
            setDialogProps({
                title: 'Like this song?',
                desc: 'We’ll play this song more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusLike(),
                onPressNo: () => setIsDialogVisible(false),
            });
        } else {
            setDialogProps({
                title: 'Like this song?',
                desc: 'This song will be played more frequently for you.',
                labelYes: 'Yes, I like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusLike(),
                onPressNo: () => setIsDialogVisible(false),
            });
        }
        setIsDialogVisible(true);
    };

    const showDialogDislike = () => {
        if (statusLike == null) {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusDislike(),
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
        } else if (statusLike == statusLikeEnum.Medium) {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusDislike(),
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
        } else {
            setDialogProps({
                title: 'Dislike this song?',
                desc: 'This song will be played less frequently for you.',
                labelYes: 'I don’t like it',
                labelNo: 'No, go back',
                onPressYes: () => handleStatusDislike(),
                onPressNo: () => setIsDialogVisible(false),
                styleBtnYes: { backgroundColor: '#E84C4C' },
            });
        }
        setIsDialogVisible(true);
    };

    const handleStatusLike = () => {
        if (statusLike == null) {
            setStatusLike(statusLikeEnum.Medium);
        } else if (statusLike == statusLikeEnum.Medium) {
            setStatusLike(statusLikeEnum.High);
        } else {
            setStatusLike(null);
        }
        setIsDialogVisible(false);
    };

    const handleStatusDislike = () => {
        if (statusLike == null) {
            setStatusLike(statusLikeEnum.Medium);
        } else if (statusLike == statusLikeEnum.Medium) {
            setStatusLike(statusLikeEnum.High);
        } else {
            setStatusLike(null);
        }
        setIsDialogVisible(false);
    };

    const defaultSong = {
        Artist: '',
        Title: 'Choose song in playlist',
        ImageURL: 'https://res.cloudinary.com/dusmue7d9/image/upload/v1695711862/default_l8mbsa.png',
        songURL: '',
    };

    const formatTime = (seconds) => {
        if (seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        } else {
            return '00:00';
        }
    };

    const currentSong = song || defaultSong;

    return (
        <>
            <View style={styles.playlistHeader}>
                <View style={styles.viewImage}>
                    <Image style={styles.image} source={{ uri: currentSong.ImageURL }} />
                </View>
                <Text style={styles.trackText} numberOfLines={2}>
                    {currentSong.Title}
                </Text>
                <Text style={styles.patientText} numberOfLines={1}>
                    {currentSong.Artist}
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
                        thumbTintColor="#137882"
                        minimumTrackTintColor="#009688"
                        maximumTrackTintColor="#000000"
                    />
                </View>
                <View style={styles.progressLevelDuration}>
                    <Text style={styles.progressLabelText}>{formatTime(position)}</Text>
                    <Text style={styles.progressLabelText}>{formatTime(duration)}</Text>
                </View>
                <View style={styles.navigationPlayer}>
                    <TouchableOpacity>
                        <Ionicons name="play-skip-back" size={40} color={'#222C2D'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={isPlaying ? handlePause : handlePlay}>
                        <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={60} color={'#222C2D'} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="play-skip-forward" size={40} color={'#222C2D'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.following}>
                <TouchableOpacity style={styles.center} onPress={() => showDialogLike()}>
                    <Ionicons
                        name={statusLike !== null ? 'heart' : 'heart-outline'}
                        size={50}
                        color={statusLike !== null ? statusLike : '#222C2D'}
                    />
                    <Text>{statusLike === statusLikeEnum.High ? 'Super Like' : 'Like'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.center} onPress={() => showDialogDislike()}>
                    <Ionicons name="sad-outline" size={50} color={statusDislike !== null ? statusLike : '#222C2D'} />
                    <Text>Dislike</Text>
                </TouchableOpacity>
            </View>
            <ToggleDialog
                visible={isDialogVisible}
                title={dialogProps.title}
                desc={dialogProps.desc}
                labelYes={dialogProps.labelYes}
                labelNo={dialogProps.labelNo}
                onPressYes={dialogProps.onPressYes}
                onPressNo={dialogProps.onPressNo}
                styleBtnYes={dialogProps.styleBtnYes}
            />
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

    center: { alignItems: 'center' },
});
