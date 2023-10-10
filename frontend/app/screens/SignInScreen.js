import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import colours from '../config/colours';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';
import TextInputEffectLabel from '../components/TextInputEffectLabel';
import { useNavigation } from '@react-navigation/native';
import { signInInstitute } from '../api/institutes';
import { storeData } from '../utils/AsyncStorage';

const SignInScreen = () => {
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        let error = '';
        if (field === 'email' && value.trim() === '') {
            error = 'Email is required';
        } else if (field === 'email' && !isValidEmail(value)) {
            error = 'Invalid email address.';
        } else if (field === 'password' && value.length < 8) {
            error = 'Password must be at least 8 characters.';
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    const validateNullFormData = (formData) => {
        let isValid = true;

        if (formData.email.trim() === '') {
            isValid = false;
        } else if (!isValidEmail(formData.email)) {
            isValid = false;
        }

        if (formData.password.trim() === '') {
            isValid = false;
        } else if (formData.password.trim().length < 8) {
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        const { email, password } = formData;
        if (validateNullFormData(formData)) {
            console.log('Form is valid:', formData);
            const response = await signInInstitute(email, password);
            const { statusCode, message, institute, token } = JSON.parse(response);
            if (statusCode == 200) {
                console.log(token);
                storeData('token-user', token);
                navigation.navigate('ListenerProfileMain');
            } else if (statusCode == 400) {
                alert(message);
            } else if (statusCode == 401) {
                alert(message);
            }
            navigation.navigate('LibrariesScreen');
        }
    };

    useEffect(() => {
        const validate = validateNullFormData(formData);
        setIsValid(validate);
    }, [formData]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomAnimatedLoader
                visible={loading}
                source={require('../assets/loader/ellipsis-horizontal-loader.json')}
            />
            <View style={styles.brand}>
                <Text style={styles.brandText}>FUXI</Text>
            </View>
            <View style={styles.signIn}>
                <Text style={styles.headerFormText}>Sign in to your account</Text>
                <TextInputEffectLabel
                    label="Email"
                    onChangeText={(text) => handleInputChange('email', text)}
                    value={formData.email}
                    error={errors.email}
                />
                <TextInputEffectLabel
                    label="Password"
                    type="password"
                    onChangeText={(text) => handleInputChange('password', text)}
                    value={formData.password}
                    error={errors.password}
                />
                <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ResetPassword')}>
                    <Text style={styles.forgotPasswordText}>Forgot password</Text>
                </TouchableOpacity>
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
                            Sign in
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.toggleInactive}
                        onPress={() => navigation.navigate('CreateAccountScreen')}
                    >
                        <Text style={styles.inactiveText}>Create new account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    brand: {},
    brandText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colours.deepTurquoise,
        letterSpacing: 8,
        textAlign: 'center',
        paddingVertical: 40,
    },
    signIn: {
        paddingHorizontal: 20,
    },
    headerFormText: {
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
        color: '#222C2D',
        marginBottom: 10,
    },
    forgotPassword: {},
    forgotPasswordText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: colours.deepTurquoise,
    },
    toggle: {
        marginTop: 32,
    },
    toggleActive: {
        borderRadius: 100,
        marginTop: 32,
    },
    activeText: {
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    toggleInactive: {
        borderRadius: 100,
        marginTop: 12,
    },
    inactiveText: {
        fontWeight: '500',
        fontSize: 16,
        color: '#222C2D',
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
});
