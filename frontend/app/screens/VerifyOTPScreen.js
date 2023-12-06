import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import TextInputEffectLabel from '../components/TextInputEffectLabel';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addItemToAsyncStorageArray, getStoreData, storeData } from '../utils/AsyncStorage';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';
import { updateOTP, verifyAccount } from '../api/institutes';
import { SendEmailLogin, SendEmailSignUp } from '../api/mailer';
import { AuthContext } from '../context/AuthContext';

const VerifyOTPScreen = () => {
    const { loginAuthContext } = useContext(AuthContext);
    const route = useRoute();
    const { token, email, navigationToScreenName } = route.params;
    const navigation = useNavigation();
    const [isValidOTP, setIsValidOTP] = useState(false);
    const [isValidResend, setIsValidResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [seconds, setSeconds] = useState(120);
    const [text, setText] = useState('Resend OTP');

    const [formData, setFormData] = useState({
        OTP: '',
    });

    const [errors, setErrors] = useState({
        OTP: '',
    });

    const startCountdown = () => {
        const intervalId = setInterval(() => {
            if (seconds > 0) {
                setSeconds((prevSeconds) => prevSeconds - 1);
                setText(`Resend OTP (${seconds - 1}s)`);
            } else {
                setIsValidResend(true);
                setText('Resend OTP');
                clearInterval(intervalId);
            }
        }, 1000);

        return intervalId;
    };

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        let error = '';
        if (field === 'OTP' && value.trim() === '') {
            error = 'OTP is required';
        } else if (field === 'OTP' && value.trim().length < 6) {
            error = 'Please enter the full OTP code.';
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    const validateNullFormData = (formData) => {
        let isValid = true;
        if (formData.OTP.trim() === '') {
            isValid = false;
        } else if (formData.OTP.trim().length < 6) {
            isValid = false;
        } else if (formData.OTP.trim().length > 10) {
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const { OTP } = formData;
        if (validateNullFormData(formData)) {
            try {
                const tokenVerify = await getStoreData('tokenVerifyAccount');
                const existVerify = await verifyAccount(tokenVerify, parseInt(OTP, 10));
                if (existVerify.code === 200) {
                    await addItemToAsyncStorageArray('ArrayEmailVerify', email);
                    if (navigationToScreenName === 'ListenerProfileMain') {
                        navigation.navigate('ListenerProfileMain', { token: token });
                    } else if (navigationToScreenName === 'LibraryScreen') {
                        loginAuthContext(token);
                    }
                } else {
                    alert(existVerify.message);
                }
            } catch (error) {
                alert('OTP verification error');
                return;
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        try {
            const CodeOTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const response = await updateOTP(email, CodeOTP);
            await storeData('tokenVerifyAccount', response.data);
            if (navigationToScreenName === 'ListenerProfileMain') {
                await SendEmailSignUp(email, CodeOTP);
            } else if (navigationToScreenName === 'LibraryScreen') {
                await SendEmailLogin(email, CodeOTP);
            }
        } catch (error) {
            alert('Error sending email');
            console.log(error);
            return;
        } finally {
            setIsValidResend(false);
            setSeconds(180);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const validate = validateNullFormData(formData);
        setIsValidOTP(validate);
    }, [formData]);

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
                <Text style={styles.textHeader}>Enter the OTP you received at</Text>
                <Text style={styles.textEmail}>{email || 'example@gmail.com'}</Text>
                <View style={{ marginTop: 20 }}>
                    <TextInputEffectLabel
                        label="Enter OTP"
                        onChangeText={(text) => handleInputChange('OTP', text)}
                        value={formData.OTP}
                        error={errors.OTP}
                        keyboardType="numeric"
                    />
                    <View style={{ marginBottom: 30 }}>
                        <TouchableOpacity
                            style={[
                                styles.toggleActive,
                                {
                                    backgroundColor: !isValidResend ? '#EFEFF1' : '#315F64',
                                },
                            ]}
                            onPress={handleResend}
                            disabled={!isValidResend}
                        >
                            <Text
                                style={[
                                    styles.activeText,
                                    {
                                        color: !isValidResend ? '#CACECE' : '#fff',
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
                                    backgroundColor: !isValidOTP ? '#EFEFF1' : '#315F64',
                                },
                            ]}
                            onPress={handleSubmit}
                            disabled={!isValidOTP}
                        >
                            <Text
                                style={[
                                    styles.activeText,
                                    {
                                        color: !isValidOTP ? '#CACECE' : '#fff',
                                    },
                                ]}
                            >
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 80 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    },
    textHeader: {
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 24,
        color: '#222C2D',
        textAlign: 'center',
    },
    textEmail: {
        fontWeight: '400',
        fontSize: 18,
        lineHeight: 24,
        color: '#4A4D4F',
        textAlign: 'center',
    },
    container: {
        paddingHorizontal: 20,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        gap: 10,
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
