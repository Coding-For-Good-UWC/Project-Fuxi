import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LibrariesScreen = () => {
    const { logoutAuthContext } = useContext(AuthContext);

    const handleLogOut = () => {
        logoutAuthContext();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View>
                <TouchableOpacity style={{ padding: 30, backgroundColor: 'yellow' }} onPress={handleLogOut}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LibrariesScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
