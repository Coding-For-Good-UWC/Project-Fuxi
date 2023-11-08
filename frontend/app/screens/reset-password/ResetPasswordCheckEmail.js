import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomAnimatedLoader from '../../components/CustomAnimatedLoader';
import { resetPassword } from '../../api/institutes';
import { storeData } from '../../utils/AsyncStorage';

const ResetPasswordCheckEmail = () => {
    const navigation = useNavigation();
    const [seconds, setSeconds] = useState(120);
    const [text, setText] = useState('Resend email');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await resetPassword(email);
            const { code, message, data } = response;
            if (code == 200) {
                await storeData('tokenResetPassword', data);
            } else {
                alert('Error sending email');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
            return;
        } finally {
            setIsValid(false);
            setSeconds(180);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const intervalId = startCountdown();
        return () => {
            clearInterval(intervalId);
        };
    }, [seconds]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomAnimatedLoader visible={isLoading} />
            <View style={styles.container}>
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
                <View style={styles.toggle}>
                    <TouchableOpacity
                        style={[
                            styles.toggleActive,
                            {
                                backgroundColor: '#315F64',
                            },
                        ]}
                        onPress={() => navigation.navigate('ResetPasswordNew')}
                    >
                        <Text
                            style={[
                                styles.activeText,
                                {
                                    color: '#fff',
                                },
                            ]}
                        >
                            Move to change password
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
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    },
    container: {
        flex: 1,
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
