import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomGridLayout from '../components/CustomGridLayout';
import SongItem from '../components/SongItem';
import { getSuggestionsInPlaymedia } from '../api/playlist';
import { Ionicons } from '@expo/vector-icons';
import { getStoreData } from '../utils/AsyncStorage';

const PlayMediaDetailAndSuggestion = ({ selectSound, dataTracks, setDataTracks }) => {
    const [dataSuggest, setDataSuggest] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (selectSound !== undefined && selectSound !== null) {
                try {
                    const profile0 = await getStoreData('profile0');
                    let profileId = null;
                    if (profile0 !== null) {
                        const { _id } = JSON.parse(profile0);
                        profileId = _id;
                    }
                    const response = await getSuggestionsInPlaymedia(
                        profileId,
                        selectSound.Artist || '',
                        selectSound.Language || '',
                        selectSound.Genre || '',
                        selectSound?.Era || ''
                    );
                    const { code, message, data } = response;
                    if (code === 200) {
                        setDataSuggest(data);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    return;
                }
            }
        };

        fetchData();
    }, [selectSound]);

    const renderSuggestionSection = (data, header, additionalHeaderInfo = '') =>
        typeof data !== 'undefined' &&
        data.length !== 0 && (
            <View style={styles.section}>
                <Text style={styles.textSectionHeader}>{`${header} ${additionalHeaderInfo}`}</Text>
                <CustomGridLayout
                    data={data.map((item, index) => (
                        <RenderItem key={index} item={item} />
                    ))}
                    columns={1}
                    styleCell={{ borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}
                    scrollEnabled={false}
                />
            </View>
        );

    const RenderItem = ({ item }) => {
        const isSelected = dataTracks.includes(item);
        const [select, setSelect] = useState(isSelected);

        const toggleItemAndSelect = () => {
            if (isSelected) {
                setDataTracks((prevItems) => prevItems.filter((selected) => selected !== item));
            } else {
                setDataTracks((prevItems) => [...prevItems, item]);
            }
        };

        const renderIconRight = () => {
            return (
                <TouchableOpacity onPress={toggleItemAndSelect}>
                    <Ionicons
                        name={!select ? 'add-circle-outline' : 'remove-circle-outline'}
                        color="#757575"
                        size={30}
                        style={{ padding: 6, paddingRight: 0 }}
                    />
                </TouchableOpacity>
            );
        };

        return <SongItem item={item} iconRight={renderIconRight()} />;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={styles.detailTrack}>
                        <Image
                            source={selectSound?.ImageURL ? { uri: selectSound.ImageURL } : require('../assets/default_l8mbsa.png')}
                            style={styles.songImage}
                        />
                        <View style={styles.rowItemText}>
                            <Text style={styles.titleText} numberOfLines={1}>
                                {selectSound?.Title || ''}
                            </Text>
                            <Text style={styles.artistText} numberOfLines={1}>
                                Artist: {selectSound?.Artist || ''}
                            </Text>
                            <Text style={styles.artistText} numberOfLines={1}>
                                Release: {selectSound?.Era || 'Unknown'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.listSection}>
                        {renderSuggestionSection(dataSuggest?.listTrackByArtist, 'Suggestion from musician', selectSound?.Artist)}
                        {renderSuggestionSection(dataSuggest?.listTrackByLanguageAndGenre, 'Maybe you want to hear')}
                        {renderSuggestionSection(dataSuggest?.listTrackByEra, 'Songs released in the same year')}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PlayMediaDetailAndSuggestion;

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
        gap: 20,
    },
    detailTrack: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(109, 184, 191, 0.14)',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    songImage: {
        height: 70,
        width: 70,
        borderRadius: 4,
    },
    rowItemText: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    titleText: {
        fontWeight: '500',
        fontSize: 15,
        color: '#222C2D',
    },
    artistText: {
        fontWeight: '500',
        fontSize: 12,
        color: '#757575',
    },

    listSection: {
        flex: 1,
        flexDirection: 'column',
        gap: 30,
    },
    section: {
        flexDirection: 'column',
        gap: 10,
    },
    textSectionHeader: {
        fontWeight: '500',
        fontSize: 16,
        color: '#1A1A1A',
    },
});
