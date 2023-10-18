import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import FollowPlayMedia from './FollowPlayMedia';

const PlayMediaComponent = ({ song, duration, position, handleSliderChange, isPlaying, handlePause, handlePlay }) => {
    const defaultSong = {
        Artist: '',
        Title: 'Choose song in playlist',
        ImageURL: 'https://res.cloudinary.com/dusmue7d9/image/upload/v1695711862/default_l8mbsa.png',
        songURL: '',
    };

    const currentSong = song || defaultSong;

    const formatTime = (seconds) => {
        if (seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        } else {
            return '0:00';
        }
    };

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
            <FollowPlayMedia />
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
        paddingHorizontal: 20,
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
});
