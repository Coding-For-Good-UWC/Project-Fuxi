import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomGridLayout from '../components/CustomGridLayout';
import ReactSongItem from '../components/ReactSongItem';
import { getPlaylistSuggestions } from '../api/playlist';
import { getStoreData } from '../utils/AsyncStorage';

const SuggestTrackScreen = () => {
    const [dataTracks, setDataTracks] = useState([]);

    useEffect(() => {
        getPlaylistSuggestion();
    }, []);

    async function getPlaylistSuggestion() {
        try {
            const profile0 = await getStoreData('profile0');
            const { _id } = JSON.parse(profile0);
            const response = await getPlaylistSuggestions(_id);
            const { code, message, data } = JSON.parse(response);
            if (code == 200) {
                setDataTracks(data);
            }
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>Suggestion for you</Text>
                <View style={{ borderTopColor: '#ECEDEE', borderTopWidth: 1 }} />
                <View style={{ flex: 1 }}>
                    <CustomGridLayout
                        data={dataTracks?.map((track, index) => (
                            <ReactSongItem key={index} item={track} dataTracksOrigin={dataTracks} />
                        ))}
                        columns={1}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SuggestTrackScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        gap: 20,
    },
    header: {
        fontWeight: '600',
        fontSize: 30,
        lineHeight: 36,
        color: '#222C2D',
    },
});
