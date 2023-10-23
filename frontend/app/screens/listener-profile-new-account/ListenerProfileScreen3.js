import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

const ListenerProfileScreen3 = () => {
    const { loginAuthContext } = useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();
    const nameProfile = route.params.nameProfile;
    const token = route.params.token;

    const handleGoToHomeScreen = async () => {
        await loginAuthContext(token);
    };

    const handleGoToPlayMediaScreen = async () => {
        await loginAuthContext(token);
    };

    return (
        <View style={styles.container}>
            <Ionicons name="checkmark-circle-outline" color="#137882" size={70} />
            <View style={styles.title}>
                <Text style={styles.titleText}>{nameProfile} profile is ready!</Text>
                <Text style={styles.subtitleText}>You can managed all your profiles later in Settings.</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: '#315F64',
                        },
                    ]}
                    onPress={handleGoToPlayMediaScreen}
                >
                    <Text style={[styles.buttonText, { color: '#fff' }]}>Welcome, let's play some music now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: '#fff',
                            borderColor: '#B1D5D8',
                            borderWidth: 1,
                        },
                    ]}
                    onPress={() => {
                        navigation.navigate('ListenerProfileMain', { resetState: true });
                    }}
                >
                    <Text style={[styles.buttonText, { color: '#137882' }]}>Create another profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleGoToHomeScreen}>
                    <Text style={[styles.buttonText, { color: '#222C2D' }]}>Go to Home screen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ListenerProfileScreen3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        marginTop: 30,
        flexDirection: 'column',
        alignItems: 'center',
    },
    titleText: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: '#222C2D',
    },
    subtitleText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '400',
        marginTop: 8,
        color: '#3C4647',
    },
    buttonContainer: {
        marginTop: 48,
        flexDirection: 'column',
        gap: 18,
    },
    button: {
        borderRadius: 100,
        paddingVertical: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        paddingHorizontal: 52,
        textAlign: 'center',
    },
});
