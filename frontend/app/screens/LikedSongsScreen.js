import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomGridLayout from '../components/CustomGridLayout';
import { getStoreData } from '../utils/AsyncStorage';
import { getLikeTrackByProfileId } from '../api/profileReact';
import { secondsToTimeString, totalDurationTracks } from '../utils/AudioUtils';
import ReactSongItem from '../components/ReactSongItem';
import ToggleDialog from '../components/ToggleDialog';

const LikedSongsScreen = () => {
    const navigation = useNavigation();
    const [countTracks, setCountTracks] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [dataLikedTrack, setDataLikedTrack] = useState([]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

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

    const removeTrack = async (trackId) => {
        const trackArrRemove = dataLikedTrack.filter((item) => item.track._id !== trackId);
        setDataLikedTrack(trackArrRemove);
        setCountTracks(trackArrRemove.length);
        setTotalDuration(
            await totalDurationTracks(
                trackArrRemove.map((item) => {
                    return {
                        URI: item.track.URI,
                    };
                })
            )
        );
    };

    async function getPlaylist() {
        try {
            const profile0 = await getStoreData('profile0');
            if (profile0 !== null) {
                const { _id } = JSON.parse(profile0);
                const response = await getLikeTrackByProfileId(_id);
                const { code, message, data } = response;
                if (code == 200) {
                    setCountTracks(data.length);
                    setDataLikedTrack(data);
                    setTotalDuration(
                        await totalDurationTracks(
                            data.map((item) => {
                                return {
                                    URI: item.track.URI,
                                };
                            })
                        )
                    );
                }
            } else {
                setCountTracks(0);
                setDataLikedTrack([]);
                setTotalDuration(0);
            }
        } catch (error) {
            return;
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                await getPlaylist();
            })();
            return;
        }, [])
    );

    const EmptySongs = () => (
        <>
            <Text style={styles.headerText}>Liked songs</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.playListTotalName}>{countTracks} songs</Text>
                <Ionicons name="ellipse" color="#E2E3E4" size={10} />
                <Text style={styles.playListTotalName}>{secondsToTimeString(totalDuration)}</Text>
            </View>
            <View style={{ borderTopColor: '#ECEDEE', borderTopWidth: 1 }}></View>
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
                            item={dataTrack.track}
                            reactTrack={dataTrack.preference}
                            dataTracksOrigin={dataLikedTrack.map((item) => item.track)}
                            setIsDialogVisible={setIsDialogVisible}
                            setDialogProps={setDialogProps}
                            iconRight={
                                <TouchableOpacity>
                                    <Ionicons name="heart" color="#137882" size={30} />
                                </TouchableOpacity>
                            }
                            removeTrack={removeTrack}
                            isCircle={true}
                        />
                    ))}
                    columns={1}
                    styleLayout={{}}
                />
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>{Object.keys(dataLikedTrack).length !== 0 ? <NotEmptySongs /> : <EmptySongs />}</View>
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
    emptyView: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        color: '#757575',
    },
});
