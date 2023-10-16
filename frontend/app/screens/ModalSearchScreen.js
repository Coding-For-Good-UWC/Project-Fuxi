import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import playlist from '../data/data';
import CustomGridLayout from '../components/CustomGridLayout';
import { searchTrack } from './../api/track';

const ModalSearchScreen = () => {
    const navigation = useNavigation();
    const textInputRef = useRef(null);
    const [text, setText] = useState('');
    const [data, setData] = useState([]);
    const [renderTracks, setRenderTracks] = useState([]);

    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }, []);

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
                <CustomGridLayout data={renderTracks} columns={1} styleLayout={{}} />
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
                <Image source={{ uri: item.ImageURL }} style={styles.songImage} />
                <View style={styles.rowItemText}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {item.Title}
                    </Text>
                    <Text style={styles.artistText}>{item.Artist}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handleTextChange = async (newText) => {
        setText(newText);
        try {
            const response = await searchTrack(newText, 1);
            const { code, data, message } = JSON.parse(response);

            if (code == 200) {
                setData(data);
                setRenderTracks(data.map((item, index) => <RenderItemSong key={index} item={item} />));
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
            return;
        } finally {
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
                        onChangeText={handleTextChange}
                        value={text}
                    />
                    {text !== '' ? (
                        <Ionicons name="close" size={24} style={{ padding: 10 }} onPress={() => handleTextChange('')} />
                    ) : (
                        ''
                    )}
                </View>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>{renderTracks ? <NotEmptySongs /> : <EmptySongs />}</View>
        </SafeAreaView>
    );
};

export default ModalSearchScreen;

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
