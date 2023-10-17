import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import colours from '../config/colours';
import CustomGridLayout from '../components/CustomGridLayout';
import { LinearGradient } from 'expo-linear-gradient';
import playlist from '../data/data';
import { useNavigation } from '@react-navigation/native';
import TipComponent from './../components/TipComponent';

const LibraryScreen = () => {
    const navigation = useNavigation();
    const [heightItem, setHeightItem] = useState(0);

    handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setHeightItem(width);
    };

    const songImages = [];
    if (playlist.tracks && Array.isArray(playlist.tracks)) {
        const songImages = playlist.tracks.map((song) => (
            <Image source={{ uri: song.artwork }} style={{ width: heightItem / 2, height: heightItem / 2 }} />
        ));
    } else {
        console.log('songs is undefined or not an array');
    }

    const listImages = [
        <Image
            source={{ uri: 'https://i.ytimg.com/vi/w68MGL20Mf0/0.jpg' }}
            style={{ width: heightItem / 2, height: heightItem / 2 }}
        />,
        <Image
            source={{ uri: 'https://i.ytimg.com/vi/KyMm5HRd1Ks/0.jpg' }}
            style={{ width: heightItem / 2, height: heightItem / 2 }}
        />,
        <Image
            source={{ uri: 'https://i.ytimg.com/vi/Ctxti-H7hZ8/0.jpg' }}
            style={{ width: heightItem / 2, height: heightItem / 2 }}
        />,
        <Image
            source={{ uri: 'https://i.ytimg.com/vi/h2oJbwgQpA0/0.jpg' }}
            style={{ width: heightItem / 2, height: heightItem / 2 }}
        />,
    ];

    const RenderItemLikedSong = () => (
        <TouchableOpacity onLayout={this.handleLayout} onPress={() => navigation.navigate('LikedSongsScreen')}>
            <View style={{ height: heightItem }}>
                <LinearGradient colors={['#1e957f', '#13747e']} style={[styles.itemLikedSong, { height: heightItem }]}>
                    <Ionicons name="heart" color="#fff" size={70} style={styles.iconHeart} />
                </LinearGradient>
            </View>
            <Text style={styles.likesSongText}>Liked songs</Text>
        </TouchableOpacity>
    );

    const RenderPlayListItem = ({ onpress }) => (
        <TouchableOpacity onLayout={this.handleLayout} onPress={onpress}>
            <View style={{ height: heightItem, borderRadius: 6, overflow: 'hidden' }}>
                <CustomGridLayout columns={2} data={listImages} />
            </View>
            <Text style={styles.likesSongText} numberOfLines={2}>
                Ninaazarova's playlist
            </Text>
        </TouchableOpacity>
    );

    const data = [
        <RenderItemLikedSong />,
        <RenderPlayListItem onpress={() => navigation.navigate('PlaylistDetailsScreen', { dataPlaylist: playlist })} />,
    ];

    const Header = () => (
        <>
            <TipComponent />
            <TouchableOpacity style={styles.buttonNewPlaylist} onPress={() => navigation.navigate('PlayMedia')}>
                <Ionicons name="add" color={colours.deepTurquoise} size={20} />
                <Text style={styles.buttonNewPlaylistText}>Create new playlist</Text>
            </TouchableOpacity>
            <View style={{ height: 20 }} />
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Good morning!</Text>
                <CustomGridLayout
                    columns={2}
                    gap={20}
                    data={data}
                    styleCell={styles.cellStyle}
                    header={<Header />}
                    footer={<View style={{ height: 40 }} />}
                />
            </View>
        </SafeAreaView>
    );
};

export default LibraryScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 0,
    },
    headerTitle: {
        fontWeight: '600',
        fontSize: 30,
        lineHeight: 36,
        color: '#222C2D',
        paddingBottom: 10,
    },
    buttonNewPlaylist: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B1D5D8',
        borderRadius: 6,
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 8,
    },
    buttonNewPlaylistText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: colours.deepTurquoise,
    },
    cellStyle: {},
    itemLikedSong: {
        borderRadius: 6,
        backgroundColor: 'yellow',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    likesSongText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#222C2D',
        marginTop: 12,
    },
});
