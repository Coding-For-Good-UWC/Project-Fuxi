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
import { useRoute } from '@react-navigation/native';
import CustomGridLayout from './../components/CustomGridLayout';
import playlist from '../data/data';
import SlotPlayer from '../components/SlotPlayer';

const PlaylistDetailsScreen = () => {
    const navigation = useNavigation();
    const [heightItem, setHeightItem] = useState(0);
    const [heightItem2, setHeightItem2] = useState(0);
    const { height } = Dimensions.get('window');
    const route = useRoute();
    const dataPlaylist = route.params.dataPlaylist;

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

    const imageHeader = [];
    for (let i = 0; i < 4; i++) {
        const item = (
            <Image
                source={{ uri: playlist.tracks[i].artwork }}
                style={{ width: heightItem / 2, height: heightItem / 2 }}
            />
        );
        imageHeader.push(item);
    }

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
                    <TouchableOpacity
                        style={styles.roundButtonHeader}
                        onPress={() => navigation.navigate('ModalSearchScreen')}
                    >
                        <Ionicons name="search" size={24} color={'#3C4647'} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const RenderItemSong = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.rowItem}
                onPress={() => {
                    navigation.navigate('PlayMedia', { track: item, playlist: dataPlaylist });
                }}
            >
                <Image source={{ uri: item.artwork }} style={styles.songImage} />
                <View style={styles.rowItemText}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.artistText}>{item.artist}</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="heart" color="#137882" size={30} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const RenderListSong = playlist.tracks.map((item, index) => <RenderItemSong key={index} item={item} />);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ borderRadius: 6, overflow: 'hidden', width: '70%' }} onLayout={this.handleLayout}>
                        <CustomGridLayout columns={2} data={imageHeader} />
                    </View>
                </View>
                <View style={styles.playListDetail}>
                    <Text style={styles.playListName}>{dataPlaylist.namePlaylist}</Text>
                    <View style={styles.playListTracksAndTime}>
                        <Text style={styles.playListTotalName}>{dataPlaylist.tracks.length} songs</Text>
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
            <SlotPlayer />
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
        flex: 1,
        paddingVertical: 6,
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    songImage: {
        height: 50,
        width: 50,
        borderRadius: 4,
    },
    rowItemText: {
        flex: 1,
        flexDirection: 'column',
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
