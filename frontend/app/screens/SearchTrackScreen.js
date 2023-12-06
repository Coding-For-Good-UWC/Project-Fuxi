import { Platform, StatusBar, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomGridLayout from '../components/CustomGridLayout';
import { searchTrack } from '../api/track';
import SongItem from '../components/SongItem';
import { addTrackInPlaylist, getPlaylistById, removeTrackInPlaylist } from '../api/playlist';
import { getStoreData } from '../utils/AsyncStorage';

const SearchTrackScreen = () => {
    const route = useRoute();
    const playlistId = route.params?.playlistId;
    const navigation = useNavigation();
    const textInputRef = useRef(null);
    const [text, setText] = useState('');
    const [page, setPage] = useState(1);
    const [dataTracks, setDataTracks] = useState([]);
    const [trackIds, setTrackIds] = useState([]);

    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setPage(1);
        setDataTracks([]);
    }, [text]);

    useEffect(() => {
        const fetchData = async () => {
            await getData(text, page);
        };
        fetchData();
    }, [page, text]);

    useEffect(() => {
        if (playlistId !== undefined) {
            const fetchData = async () => {
                const response = await getPlaylistById(playlistId);
                const { code, message, data } = response;
                if (code === 200) {
                    setTrackIds(data.tracks.map((track) => track._id));
                }
            };
            fetchData();
        }
    }, [playlistId]);

    const getData = async (text, page) => {
        try {
            const profile0 = await getStoreData('profile0');
            const { genres } = JSON.parse(profile0);
            const response = await searchTrack(text, page, genres);
            const { code, message, data } = response;
            if (code === 200) {
                setDataTracks((prevData) => [...prevData, ...data]);
            }
        } catch (error) {
            console.error('Error:', error);
            return;
        }
    };

    const RenderItem = ({ item }) => {
        if (playlistId !== undefined) {
            const isSelected = trackIds.includes(item._id);
            const [select, setSelect] = useState(isSelected);

            const toggleItemAndSelect = async () => {
                if (!select) {
                    const profile0 = await getStoreData('profile0');
                    if (profile0 === null) {
                        return;
                    }
                    const { _id } = JSON.parse(profile0);
                    const response = await addTrackInPlaylist(_id, playlistId, item?._id);
                    if (response?.code !== 200) {
                        alert(response?.message);
                    } else {
                        setSelect((prevSelect) => !prevSelect);
                    }
                } else {
                    await removeTrackInPlaylist(playlistId, item?._id);
                    setSelect((prevSelect) => !prevSelect);
                }
            };

            const renderIconRight = () => {
                return (
                    <TouchableOpacity onPress={toggleItemAndSelect}>
                        {select ? (
                            <Text style={styles.removeText}>Remove</Text>
                        ) : (
                            <Ionicons name="add" color="#757575" size={30} style={{ padding: 6, paddingRight: 0 }} />
                        )}
                    </TouchableOpacity>
                );
            };

            return <SongItem item={item} iconRight={renderIconRight()} onPress={() => navigation.navigate('PlayMedia', { track: item, isCircle: false})} />;
        } else {
            return <SongItem item={item} onPress={() => navigation.navigate('PlayMedia', { track: item, isCircle: false })} />;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerSearch}>
                    <View style={styles.search}>
                        <Ionicons name="search" size={24} style={{ padding: 10 }} />
                        <TextInput
                            ref={textInputRef}
                            placeholder="Find in Playlist"
                            style={styles.inputStyle}
                            onChangeText={(text) => setText(text)}
                            value={text}
                        />
                        {text !== '' ? <Ionicons name="close" size={24} style={{ padding: 10 }} onPress={() => setText('')} /> : ''}
                    </View>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={1}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerList}>
                    {dataTracks.length !== 0 ? (
                        <CustomGridLayout
                            data={dataTracks?.map((item, index) => (
                                <RenderItem key={index} item={item} />
                            ))}
                            columns={1}
                            handleEndReached={() => setPage(page + 1)}
                        />
                    ) : (
                        <View style={styles.emptyView}>
                            <Text style={styles.emptyText}>No songs found</Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SearchTrackScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
        flexDirection: 'column',
        gap: 16,
    },
    container: {
        padding: 20,
        flexDirection: 'column',
    },
    headerSearch: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
    },
    search: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#137882',
        borderRadius: 4,
        height: '100%',
        overflow: 'hidden',
    },
    inputStyle: {
        flex: 1,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },
    cancelButtonText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
        padding: 16,
        paddingRight: 0,
    },
    containerList: {
        marginTop: 10,
    },
    emptyView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: '50%',
    },
    emptyText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#757575',
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
    removeText: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 20,
        color: '#C31E1E',
        padding: 6,
        paddingRight: 0,
    },
});
