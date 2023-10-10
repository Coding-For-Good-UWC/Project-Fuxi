import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ResetPasswordCheckEmail = () => {
    const [isValid, setIsValid] = useState(false);
    const navigation = useNavigation();
    const [seconds, setSeconds] = useState(5);
    const [text, setText] = useState('Resend email');

    const route = useRoute();
    const email = route.params.email;

    const startCountdown = () => {
        const intervalId = setInterval(() => {
            if (seconds > 0) {
                setSeconds((prevSeconds) => prevSeconds - 1);
                setText(`Resend email (${seconds - 1}s)`);
            } else {
                setIsValid(true);
                setText('Resend email');
                clearInterval(intervalId);
            }
        }, 1000);

        return intervalId;
    };

    const handleSubmit = () => {
        setIsValid(false);
        setSeconds(5);
    };

    useEffect(() => {
        const intervalId = startCountdown();
        return () => {
            clearInterval(intervalId);
        };
    }, [seconds]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                    <Ionicons name="arrow-back-outline" size={24} style={styles.iconArrowBack} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Check your email</Text>
                <Text style={styles.descriptionText}>
                    We’ve sent password reset instructions to your email <Text style={styles.email}>{email}.</Text>
                </Text>
                <Text style={styles.descriptionText}>If it doesn’t arrive soon, please check your spam folder.</Text>
                <View style={styles.toggle}>
                    <TouchableOpacity
                        style={[
                            styles.toggleActive,
                            {
                                backgroundColor: !isValid ? '#EFEFF1' : '#315F64',
                            },
                        ]}
                        onPress={handleSubmit}
                        disabled={!isValid}
                    >
                        <Text
                            style={[
                                styles.activeText,
                                {
                                    color: !isValid ? '#CACECE' : '#fff',
                                },
                            ]}
                        >
                            {text}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ResetPasswordCheckEmail;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        paddingHorizontal: 20,
    },
    iconArrowBack: {
        paddingLeft: 0,
        padding: 12,
    },
    headerText: {
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
        color: '#222C2D',
    },
    descriptionText: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        color: '#4A4D4F',
        marginTop: 8,
    },
    email: {
        fontWeight: '600',
    },
    form: {
        marginTop: 16,
    },
    input: { marginBottom: 0 },
    toggle: {
        marginTop: 32,
    },
    toggleActive: {
        borderRadius: 100,
    },
    activeText: {
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
});
