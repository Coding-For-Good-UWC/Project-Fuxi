import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import PlayMedia from '../screens/PlayMedia';

const SlotPlayer = () => {
    const navigation = useNavigation();
    const buttonSheetRef = useRef(null);
    const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);

    function handleBottomSheet() {
        buttonSheetRef.current?.present();
        setTimeout(() => {
            setIsOpenBottomSheet(true);
        }, 100);
    }
    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleBottomSheet}>
                    <Image source={{ uri: 'https://i.ytimg.com/vi/w68MGL20Mf0/0.jpg' }} style={styles.image} />
                    <View style={styles.viewNameTrack}>
                        <Text style={styles.nameTrackText} numberOfLines={1}>
                            Cô Độc Đích Hồ Ly (孤独的狐狸) - (DJ Mặc Hàm Bản / DJ默涵版) - Hồ Thục Nhã (胡淑雅).
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="pause" color="#222C2D" size={30} />
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* <BottomSheetModal
                    overDragResistanceFactor={0}
                    ref={buttonSheetRef}
                    index={-1}
                    snapPoints={['100%']}
                    handleIndicatorStyle={{ display: 'none' }}
                    backgroundStyle={{
                        borderRadius: 0,
                    }}
                    onDismiss={() => setIsOpenBottomSheet(false)}
                >
                    <PlayMedia />
                </BottomSheetModal> */}
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default SlotPlayer;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 70,
        bottom: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        gap: 14,
        borderTopWidth: 1,
        borderTopColor: '#DFE0E2',
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 4,
    },
    viewNameTrack: {
        flex: 1,
        flexDirection: 'column',
    },
    nameTrackText: {
        fontWeight: '500',
        fontSize: 15,
        lineHeight: 24,
        color: '#222C2D',
    },
});
