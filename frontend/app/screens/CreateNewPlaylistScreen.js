import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomGridLayout from '../components/CustomGridLayout';
import { searchTrack } from './../api/track';
import { getStoreData } from '../utils/AsyncStorage';
import { createPlaylist } from '../api/playlist';
import SongItem from '../components/SongItem';
import ToggleButton from '../components/ToggleButton';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';

const CreateNewPlaylistScreen = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [namePlaylistText, setNamePlaylistText] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [dataTracks, setDataTracks] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButtonHeader} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={'#3C4647'} style={{ paddingVertical: 10 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            setSearchText('');
            setPage(1);
            setNamePlaylistText('');
            setIsSelected(false);
            setSelectedItems([]);
            setDataTracks([]);
            return;
        }, [])
    );

    const RenderItem = ({ item }) => {
        const isSelected = selectedItems.includes(item._id);
        const [select, setSelect] = useState(isSelected);

        const toggleItemAndSelect = () => {
            if (isSelected) {
                setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((selected) => selected !== item._id));
            } else {
                setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item._id]);
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

        return <SongItem item={item} iconRight={renderIconRight()} />;
    };

    useEffect(() => {
        setPage(1);
        setDataTracks([]);
    }, [searchText]);

    useEffect(() => {
        const fetchData = async () => {
            await getData(searchText, page);
        };
        fetchData();
    }, [page, searchText]);

    const getData = async (text, page) => {
        try {
            const response = await searchTrack(text, page);
            const { code, data } = response;
            if (code === 200) {
                setDataTracks((prevData) => [...prevData, ...data]);
            }
        } catch (error) {
            console.error('Error:', error);
            return;
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const profile0 = await getStoreData('profile0');
            if (profile0 !== null) {
                const { _id } = JSON.parse(profile0);
                const response = await createPlaylist(_id, namePlaylistText, selectedItems);
                const { code, message, data } = response;
                if (code == 201) {
                    navigation.navigate('PlayMedia', { dataTracksOrigin: data?.tracks });
                    alert('Playlist creation successful');
                } else {
                    alert(message);
                }
            } else {
                alert('Please create a profile to use this feature');
            }
        } catch (error) {
            return;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedItems.length < 1 || namePlaylistText === '') {
            setIsSelected(false);
        } else {
            setIsSelected(true);
        }
    }, [selectedItems, namePlaylistText]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomAnimatedLoader visible={isLoading} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Create new playlist</Text>
                    <Text style={styles.playlistName}>Playlist name</Text>
                    <TextInput
                        placeholder="Enter the name of the playlist"
                        style={styles.inputNamePlaylist}
                        onChangeText={(text) => setNamePlaylistText(text)}
                        value={namePlaylistText}
                    />
                </View>
                <View style={styles.addPlaylist}>
                    <View style={styles.addPlaylistHeader}>
                        <Text style={styles.addToPlaylistText}>Add to playlist</Text>
                        <Text style={styles.selectedText}>{selectedItems.length} selected</Text>
                    </View>
                    <View style={styles.searchView}>
                        <View style={styles.headerSearch}>
                            <View style={styles.search}>
                                <Ionicons name="search" color="#757575" size={24} style={{ padding: 10 }} />
                                <TextInput
                                    placeholder="Search"
                                    style={styles.inputStyle}
                                    onChangeText={(text) => setSearchText(text)}
                                    value={searchText}
                                />
                                {searchText !== '' ? (
                                    <Ionicons name="close" size={24} style={{ padding: 10 }} onPress={() => setSearchText('')} />
                                ) : (
                                    ''
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentSearch}>
                        {dataTracks.length !== 0 ? (
                            <CustomGridLayout
                                data={dataTracks?.map((item, index) => (
                                    <RenderItem item={item} key={index} />
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
                <ToggleButton
                    isDisabled={isSelected}
                    onPress={handleSubmit}
                    lable="Done"
                    backgroundColorActive="#315F64"
                    backgroundColorInactive="#EFEFF1"
                    colorActive="#fff"
                    colorInactive="#CACECE"
                    styleButton={{
                        marginTop: 'auto',
                        marginBottom: 24,
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default CreateNewPlaylistScreen;

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
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#DFE0E2',
    },
    headerText: {
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
        color: '#222C2D',
        marginBottom: 16,
    },
    playlistName: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
    inputNamePlaylist: {
        height: 36,
        fontSize: 16,
        lineHeight: 24,
    },
    addPlaylist: {
        flex: 1,
        flexDirection: 'column',
        gap: 12,
    },
    addPlaylistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addToPlaylistText: {
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 28,
        color: '#222C2D',
    },
    selectedText: {
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 28,
        color: '#757575',
    },
    searchView: {},
    searchInput: {},

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
        borderWidth: 1,
        borderColor: '#DFE0E2',
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

    contentSearch: {
        flex: 1,
    },
    removeText: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 20,
        color: '#C31E1E',
        padding: 6,
        paddingRight: 0,
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
});
