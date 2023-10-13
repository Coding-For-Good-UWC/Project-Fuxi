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
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import CustomGridLayout from './../components/CustomGridLayout';
import songs from '../data/data';

const PlaylistDetailsScreen = () => {
    const navigation = useNavigation();
    const [heightItem, setHeightItem] = useState(0);
    const [heightItem2, setHeightItem2] = useState(0);
    const { height } = Dimensions.get('window');

    handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setHeightItem(width);
    };

    handleLayout2 = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setHeightItem2(width);
    };

    const handleStartPlaylist = () => {
        navigation.navigate('PlayMedia');
    };

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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButtonHeader} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={'#3C4647'} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity style={styles.roundButtonHeader}>
                        <Ionicons name="search" size={24} color={'#3C4647'} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const RenderItemSong = ({ item, index }) => {
        return (
            <View style={styles.rowItem}>
                <TouchableOpacity
                    // onPress={() => handleTrackPress(item)}
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

    const RenderListSong = songs.map((item, index) => <RenderItemSong key={index} item={item} />);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ borderRadius: 6, overflow: 'hidden', width: '70%' }} onLayout={this.handleLayout}>
                        <CustomGridLayout columns={2} data={listImages} />
                    </View>
                </View>
                <View style={styles.playListDetail}>
                    <Text style={styles.playListName}>Ninaazarova's playlist</Text>
                    <View style={styles.playListTracksAndTime}>
                        <Text style={styles.playListTotalName}>120 songs</Text>
                        <Ionicons name="ellipse" color="#E2E3E4" size={10} />
                        <Text style={styles.playListTotalName}>3h 42m</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.buttonPlay} onPress={handleStartPlaylist}>
                    <Ionicons name="play" color="#fff" size={20} />
                    <Text style={styles.playText}>Play</Text>
                </TouchableOpacity>
                <View onLayout={this.handleLayout2}>
                    <View style={{ borderTopColor: '#ECEDEE', borderTopWidth: 1 }}></View>
                    <CustomGridLayout data={RenderListSong} columns={1} styleLayout={{ height: heightItem2 + 20 }} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PlaylistDetailsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    },
    container: {
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 24,
    },
    playListDetail: {
        flexDirection: 'column',
        gap: 8,
    },
    playListName: {
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
        color: '#222C2D',
    },
    playListTracksAndTime: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    playListTotalName: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
    buttonPlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#315F64',
        gap: 8,
        borderRadius: 100,
    },
    playText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#fff',
        paddingVertical: 12,
    },

    rowItem: {
        flexDirection: 'row',
        paddingVertical: 6,
        marginVertical: 2,
    },
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
        fontWeight: '500',
        fontSize: 15,
        lineHeight: 24,
        color: '#222C2D',
    },
    artistText: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
});
