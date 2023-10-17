import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const RateSongsScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Text>RateSongsScreen</Text>
        </SafeAreaView>
    );
};

export default RateSongsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
