import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useState } from 'react';

const defaultSong = {
    id: 1,
    Title: 'Please choose a song',
    Artist: '',
    ImageURL: require('../assets/default_l8mbsa.png'),
    songURL: '',
};

const OverlayMediaScreen = ({ isModalVisible, isOverlay, song, followPlayMedia }) => {
    const [heightItem, setHeightItem] = useState(0);
    const [track, setTrack] = useState(song || defaultSong);

    handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setHeightItem(width);
    };

    return (
        <Modal style={{ flex: 1 }} visible={isModalVisible} transparent animationType="fade">
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.image} onLayout={this.handleLayout}>
                        <Image source={{ uri: track.ImageURL }} style={{ borderRadius: 12, width: '100%', height: heightItem }} />
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
                    {followPlayMedia}
                    <TouchableOpacity style={styles.bottom} onPress={isOverlay}>
                        <Text style={styles.bottomText}>Back to Media Player</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
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
    container: {
        flex: 1,
        flexDirection: 'column',
        gap: 50,
        alignItems: 'center',
    },
    image: {
        borderWidth: 6,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderRadius: 18,
        width: '70%',
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
