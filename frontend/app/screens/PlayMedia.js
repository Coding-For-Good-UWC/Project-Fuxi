import 'react-native-gesture-handler';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    AppRegistry,
    Dimensions,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import BottomSheetViewPlaylist from '../components/BottomSheetViewPlaylist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const PlayMedia = () => {
    const buttonSheetRef = useRef(null);
    const snapPoints = ['50%', '100%'];
    const [isOpen, setIsOpen] = useState(false);

    function handleBottomSheet() {
        buttonSheetRef.current?.present();
        setTimeout(() => {
            setIsOpen(true);
        }, 100);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <SafeAreaView
                    style={[
                        styles.safeArea,
                        { backgroundColor: isOpen ? 'gray' : 'white' },
                    ]}
                >
                    <BottomSheetModal
                        overDragResistanceFactor={0}
                        ref={buttonSheetRef}
                        index={0}
                        snapPoints={snapPoints}
                        handleIndicatorStyle={{ display: 'none' }}
                        backgroundStyle={{
                            borderRadius: 0,
                        }}
                        onDismiss={() => setIsOpen(false)}
                    >
                        <View>
                            <Text>BottomSheetViewPlaylist</Text>
                        </View>
                    </BottomSheetModal>
                    <View style={styles.playlistHeader}>
                        <View style={styles.viewImage}>
                            <Image
                                style={styles.image}
                                source={require('../assets/AlbumArt.png')}
                            />
                        </View>
                        <Text style={styles.trackText}>I Will Survive</Text>
                        <Text style={styles.patientText}>Gloria Gaynor</Text>
                    </View>
                    <View style={styles.playmediaCenter}>
                        <View style={styles.timePlay}>
                            <View style={styles.timePlayView}></View>
                        </View>
                        <View style={styles.navigationPlayer}>
                            <TouchableOpacity>
                                <Ionicons
                                    name="play-skip-back"
                                    size={40}
                                    color={'#222C2D'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons
                                    name="pause-circle"
                                    size={60}
                                    color={'#222C2D'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons
                                    name="play-skip-forward"
                                    size={40}
                                    color={'#222C2D'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.following}>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Ionicons
                                name="heart-outline"
                                size={50}
                                color={'#222C2D'}
                            />
                            <Text>Like</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Ionicons
                                name="sad-outline"
                                size={50}
                                color={'#222C2D'}
                            />
                            <Text>Dislike</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.viewPlaylistBottom}
                        onPress={handleBottomSheet}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                textAlign: 'center',
                                paddingVertical: 18,
                                fontSize: 16,
                            }}
                        >
                            View playlist
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default PlayMedia;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playlistHeader: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewImage: {
        marginTop: 30,
        height: 250,
        width: 250,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.06,
    },
    image: {
        borderRadius: 10,
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
    trackText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222C2D',
        marginTop: 10,
    },
    patientText: {
        fontSize: 16,
        color: '#757575',
    },
    playmediaCenter: {
        flex: 1,
    },
    timePlay: {
        width: 350,
    },
    timePlayView: {
        height: 2,
        backgroundColor: '#000',
    },
    navigationPlayer: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    following: {
        height: 150,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 180,
    },
    viewPlaylistBottom: {
        height: 60,
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        backgroundColor: '#1A1A1A',
    },
});
