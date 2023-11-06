import { Platform, StatusBar, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomGridLayout from '../components/CustomGridLayout';
import { searchTrack } from '../api/track';
import ReactSongItem from '../components/ReactSongItem';

const SearchTrackScreen = () => {
    const navigation = useNavigation();
    const textInputRef = useRef(null);
    const [text, setText] = useState('');
    const [page, setPage] = useState(1);
    const [dataTracks, setDataTracks] = useState([]);

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
        console.log(page);
        const fetchData = async () => {
            await getData(text, page);
        };
        fetchData();
    }, [page, text]);

    const getData = async (text, page) => {
        try {
            const response = await searchTrack(text, page);
            const { code, message, data } = JSON.parse(response);
            if (code === 200) {
                setDataTracks((prevData) => [...prevData, ...data]);
            }
        } catch (error) {
            console.error('Error:', error);
            return;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                {dataTracks.length !== 0 ? (
                    <CustomGridLayout
                        data={dataTracks?.map((item, index) => (
                            <ReactSongItem key={index} item={item} />
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
        </SafeAreaView>
    );
};

export default SearchTrackScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
        padding: 20,
        flexDirection: 'column',
        gap: 16,
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
    container: {
        flex: 1,
        // backgroundColor: 'yellow',
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
});
