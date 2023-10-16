import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import playlist from '../data/data';
import CustomGridLayout from '../components/CustomGridLayout';

const CreateNewPlaylistScreen = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [namePlaylistText, setNamePlaylistText] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selected) => selected !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleSubmit = async () => {};

    useEffect(() => {
        console.log(selectedItems);
        if (selectedItems.length < 1 || namePlaylistText === '') {
            setIsSelected(false);
        } else {
            setIsSelected(true);
        }
    }, [selectedItems, namePlaylistText]);

    const handleTextChange = (newText) => {
        console.log(newText);
        setSearchText(newText);
    };

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

    const EmptySongs = () => (
        <>
            <View style={styles.emptyView}>
                <Text style={styles.emptyText}>No songs found</Text>
            </View>
        </>
    );

    const NotEmptySongs = () => (
        <>
            <View onLayout={this.handleLayout2}>
                <CustomGridLayout data={RenderListSong} columns={1} styleLayout={{}} />
            </View>
        </>
    );

    const RenderItemSong = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.rowItem}
                onPress={() => {
                    // navigation.navigate('PlayMedia', { track: item, playlist: dataPlaylist });
                }}
            >
                <Image source={{ uri: item.artwork }} style={styles.songImage} />
                <View style={styles.rowItemText}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.artistText}>{item.artist}</Text>
                </View>
                {selectedItems.includes(item) ? (
                    <TouchableOpacity onPress={() => toggleItem(item)}>
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => toggleItem(item)}>
                        <Ionicons name="add" color="#757575" size={30} style={{ padding: 6, paddingRight: 0 }} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const RenderListSong = playlist.tracks?.map((item, index) => <RenderItemSong key={index} item={item} />);

    return (
        <SafeAreaView style={styles.safeArea}>
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
                                    onChangeText={handleTextChange}
                                    value={searchText}
                                />
                                {searchText !== '' ? (
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        style={{ padding: 10 }}
                                        onPress={() => handleTextChange('')}
                                    />
                                ) : (
                                    ''
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentSearch}>
                        {playlist?.tracks !== null ? <NotEmptySongs /> : <EmptySongs />}
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: isSelected ? '#315F64' : '#EFEFF1',
                        },
                    ]}
                    disabled={!isSelected}
                    onPress={handleSubmit}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color: isSelected ? '#fff' : '#CACECE',
                            },
                        ]}
                    >
                        Done
                    </Text>
                </TouchableOpacity>
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

    button: {
        borderRadius: 100,
        marginTop: 'auto',
        marginBottom: 24,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
});
