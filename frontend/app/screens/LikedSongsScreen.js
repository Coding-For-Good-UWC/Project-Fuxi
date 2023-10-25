import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomGridLayout from '../components/CustomGridLayout';
import { getStoreData } from '../utils/AsyncStorage';
import { getLikeTrackByProfileId } from '../api/profileReact';
import { secondsToTimeString, totalDurationTracks } from '../utils/AudioUtils';
import ReactSongItem from '../components/ReactSongItem';

const LikedSongsScreen = () => {
    const navigation = useNavigation();
    const [countTracks, setCountTracks] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [dataLikedTrack, setDataLikedTrack] = useState([]);

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
                    <TouchableOpacity style={styles.roundButtonHeader} onPress={() => navigation.navigate('SearchTrackScreen')}>
                        <Ionicons name="search" size={24} color={'#3C4647'} style={{ paddingVertical: 10 }} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    async function getPlaylist() {
        try {
            const profile0 = await getStoreData('profile0');
            const { _id } = JSON.parse(profile0);
            const response = await getLikeTrackByProfileId(_id);
            const { code, message, data } = JSON.parse(response);
            if (code == 200) {
                setCountTracks(data[0]?.reactTracks.length);
                setDataLikedTrack(data[0]?.reactTracks?.map((item) => item.track) || []);
                setTotalDuration(
                    await totalDurationTracks(
                        data[0]?.reactTracks?.map((item) => {
                            return {
                                URI: item.track.URI,
                            };
                        }),
                    ),
                );
            } else {
                alert(message);
            }
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    useEffect(() => {
        getPlaylist();
    }, []);

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
                <Text style={styles.playListTotalName}>{countTracks} songs</Text>
                <Ionicons name="ellipse" color="#E2E3E4" size={10} />
                <Text style={styles.playListTotalName}>{secondsToTimeString(totalDuration)}</Text>
            </View>
            <View style={{ borderTopColor: '#ECEDEE', borderTopWidth: 1 }}></View>
            <View style={{ flex: 1 }}>
                <CustomGridLayout
                    data={dataLikedTrack?.map((dataTrack, index) => (
                        <ReactSongItem
                            key={index}
                            item={dataTrack}
                            iconRight={
                                <TouchableOpacity>
                                    <Ionicons name="heart" color="#137882" size={30} />
                                </TouchableOpacity>
                            }
                        />
                    ))}
                    columns={1}
                    styleLayout={{}}
                />
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>{dataLikedTrack?.reactTracks?.length !== 0 ? <NotEmptySongs /> : <EmptySongs />}</View>
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
