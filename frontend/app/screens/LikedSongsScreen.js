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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import playlist from '../data/data';
import CustomGridLayout from '../components/CustomGridLayout';
import SearchTrackScreen from './SearchTrackScreen';
import RenderItemSong from '../components/RenderItemSong';

const LikedSongsScreen = () => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButtonHeader} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={'#3C4647'} style={{ paddingVertical: 10 }} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity
                        style={styles.roundButtonHeader}
                        onPress={() => navigation.navigate('SearchTrackScreen')}
                    >
                        <Ionicons name="search" size={24} color={'#3C4647'} style={{ paddingVertical: 10 }} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const EmptySongs = () => (
        <>
            <Text style={styles.headerText}>Liked songs</Text>
            <View style={styles.emptyView}>
                <Ionicons name="heart" color="#ECEDEE" size={60} />
                <Text style={styles.emptyText}>All liked songs will appear here.</Text>
            </View>
        </>
    );

    const NotEmptySongs = () => (
        <>
            <Text style={styles.headerText}>Liked songs</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.playListTotalName}>{playlist?.tracks?.length} songs</Text>
                <Ionicons name="ellipse" color="#E2E3E4" size={10} />
                <Text style={styles.playListTotalName}>3h 42m</Text>
            </View>
            <View style={{ borderTopColor: '#ECEDEE', borderTopWidth: 1 }}></View>
            <View style={{ flex: 1 }}>
                <CustomGridLayout data={RenderListSong} columns={1} styleLayout={{}} />
            </View>
        </>
    );

    const RenderListSong = playlist.tracks?.map((item, index) => (
        <RenderItemSong
            key={index}
            item={item}
            iconRight={
                <TouchableOpacity>
                    <Ionicons name="heart" color="#137882" size={30} />
                </TouchableOpacity>
            }
        />
    ));

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>{playlist?.tracks !== null ? <NotEmptySongs /> : <EmptySongs />}</View>
        </SafeAreaView>
    );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 24,
    },
    headerText: {
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
        color: '#222C2D',
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
