import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import React from 'react';
import ListenerProfileScreen1 from './ListenerProfileScreen1';

const ListenerProfileMain = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ListenerProfileScreen1 />
        </SafeAreaView>
    );
};

export default ListenerProfileMain;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 30,
    },
});
