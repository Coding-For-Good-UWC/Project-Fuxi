import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ListenerProfileScreen3 = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Ionicons
                name="checkmark-circle-outline"
                color="#137882"
                size={70}
            />
            <View style={styles.title}>
                <Text style={styles.titleText}>Nina Azarova’s profile</Text>
                <Text style={styles.titleText}>is ready!</Text>
                <Text style={[styles.subtitleText, { marginTop: 8 }]}>
                    You can managed all your
                </Text>
                <Text style={styles.subtitleText}>
                    profiles later in Settings.
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: '#315F64',
                        },
                    ]}
                >
                    <Text style={[styles.buttonText, { color: '#fff' }]}>
                        Play music for Nina now
                    </Text>
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
                        navigation.navigate('ListenerProfileScreen1');
                    }}
                >
                    <Text style={[styles.buttonText, { color: '#137882' }]}>
                        Create another profile
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={[styles.buttonText, { color: '#222C2D' }]}>
                        Go to Home screen
                    </Text>
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
