import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const BottomSheetViewPlaylist = () => {
    return (
        <BottomSheetModalProvider>
            <BottomSheetModal>
                <View>
                    <Text>BottomSheetViewPlaylist</Text>
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

export default BottomSheetViewPlaylist;

const styles = StyleSheet.create({});
