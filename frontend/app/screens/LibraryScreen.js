import { Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import colours from '../config/colours';
import CustomGridLayout from '../components/CustomGridLayout';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import WithProfile from '../components/WithProfile';
import PlaylistItem from '../components/PlaylistItem';
import PlaylistLikedSongItem from '../components/PlaylistLikedSongItem';
import { getAllPlayListByProfileId } from '../api/playlist';
import { getStoreData } from '../utils/AsyncStorage';
import { AppContext } from '../context/AppContext';

const LibraryScreen = () => {
    const { isReRender } = useContext(AppContext);
    const navigation = useNavigation();
    const { width } = Dimensions.get('screen');
    const heightItem = (width - 40 - 20) / 2;
    const [dataPlaylist, setDataPlaylist] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                await getPlaylist();
            })();
            return;
        }, [])
    );

    useEffect(() => {
        getPlaylist();
    }, [isReRender]);

    async function getPlaylist() {
        try {
            const profile0 = await getStoreData('profile0');
            if (profile0 !== null) {
                const { _id } = JSON.parse(profile0);
                const response = await getAllPlayListByProfileId(_id);
                const { code, message, data } = response;
                if (code == 200) {
                    const sortPlaylist = data.sort((a, b) => {
                        if (a.namePlaylist === 'Suggestion for you') return -1;
                        if (b.namePlaylist === 'Suggestion for you') return 1;
                        return 0;
                    });
                    setDataPlaylist(sortPlaylist);
                }
            } else {
                setDataPlaylist([]);
            }
        } catch (error) {
            return;
        }
    }

    const Header = () => (
        <>
            <WithProfile />
            {/* <TipComponent /> */}
            <TouchableOpacity style={styles.buttonNewPlaylist} onPress={() => navigation.navigate('CreateNewPlaylistScreen')}>
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
                    data={[
                        <PlaylistLikedSongItem heightItem={heightItem} />,
                        ...dataPlaylist.map((dataItem, index) => (
                            <PlaylistItem
                                key={index}
                                heightItem={heightItem}
                                data={dataItem}
                                onPress={() => navigation.navigate('PlaylistDetailsScreen', { dataPlaylistDetail: dataItem })}
                            />
                        )),
                    ]}
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
