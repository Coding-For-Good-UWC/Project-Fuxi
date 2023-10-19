import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import colours from '../config/colours';
import CustomGridLayout from '../components/CustomGridLayout';
import playlist from '../data/data';
import { useNavigation } from '@react-navigation/native';
import TipComponent from './../components/TipComponent';
import WithProfile from '../components/WithProfile';
import RenderPlayListItem from '../components/RenderPlayListItem';
import RenderItemLikedSong from '../components/RenderItemLikedSong';

const LibraryScreen = () => {
    const navigation = useNavigation();
    const { width } = Dimensions.get('screen');
    const heightItem = (width - 40 - 20) / 2;

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

    const data = [
        <RenderItemLikedSong heightItem={heightItem} />,
        <RenderPlayListItem
            onpress={() => navigation.navigate('PlaylistDetailsScreen', { dataPlaylist: playlist })}
            heightItem={heightItem}
            data={listImages}
        />,
    ];

    const Header = () => (
        <>
            <WithProfile />
            <TipComponent />
            <TouchableOpacity
                style={styles.buttonNewPlaylist}
                onPress={() => navigation.navigate('CreateNewPlaylistScreen')}
            >
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
});
