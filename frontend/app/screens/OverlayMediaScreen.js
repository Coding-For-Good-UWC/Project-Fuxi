import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import FollowPlayMedia from '../components/FollowPlayMedia';

const defaultSong = {
    id: 1,
    Title: 'THỦY CHUNG',
    Artist: 'THƯƠNG VÕ',
    ImageURL: 'https://i.ytimg.com/vi/w68MGL20Mf0/0.jpg',
    songURL: 'https://res.cloudinary.com/dusmue7d9/video/upload/v1695703525/MP3/TH%E1%BB%A6Y_CHUNG_jmdrdq.mp3',
};

const OverlayMediaScreen = ({ isOverlay, song }) => {
    const [heightItem, setHeightItem] = useState(0);
    const [track, setTrack] = useState(song || defaultSong);

    handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setHeightItem(width);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animatable.View animation="fadeIn" duration={500} style={{ flex: 1, flexDirection: 'column', gap: 50 }}>
                <View style={styles.image} onLayout={this.handleLayout}>
                    <Image
                        source={{ uri: track.ImageURL }}
                        style={{ borderRadius: 12, width: '100%', height: heightItem }}
                    />
                </View>
                <View style={styles.aboutFeel}>
                    <View style={styles.aboutFeelHeader}>
                        <Text style={styles.aboutFeelText}>How do you feel about</Text>
                        <Text style={styles.aboutFeelText} numberOfLines={2}>
                            {track.Title}
                        </Text>
                    </View>
                    <Text style={styles.descFeel}>
                        Rate it now to help us recommend better songs for you! This message will disappear in 15s.
                    </Text>
                </View>
                <FollowPlayMedia />
                <TouchableOpacity style={styles.bottom} onPress={isOverlay}>
                    <Text style={styles.bottomText}>Back to Media Player</Text>
                </TouchableOpacity>
            </Animatable.View>
        </SafeAreaView>
    );
};

export default OverlayMediaScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
        paddingHorizontal: 45,
    },
    image: {
        borderWidth: 6,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderRadius: 18,
    },
    aboutFeel: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    aboutFeelHeader: {
        flexDirection: 'column',
    },
    aboutFeelText: {
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 28,
        color: '#FFFFFFD9',
        textAlign: 'center',
    },
    descFeel: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#FFFFFFD9',
        textAlign: 'center',
    },
    bottom: {
        marginTop: 'auto',
    },
    bottomText: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#fff',
        textAlign: 'center',
    },
});
