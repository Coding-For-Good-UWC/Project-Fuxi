import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const SettingScreen = () => {
    const { logoutAuthContext } = useContext(AuthContext);

    const handleLogOut = () => {
        logoutAuthContext();
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <View>
                <TouchableOpacity onPress={handleLogOut}>
                    <Text style={{ fontSize: 20, fontWeight: '600', padding: 30, backgroundColor: '#13747e' }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
