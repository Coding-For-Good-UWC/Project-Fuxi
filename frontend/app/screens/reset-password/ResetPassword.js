import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import TextInputEffectLabel from '../../components/TextInputEffectLabel';
import { useNavigation } from '@react-navigation/native';

const ResetPassword = () => {
    const navigation = useNavigation();
    const [isValid, setIsValid] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({
        email: '',
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
        return isValid;
    };

    const handleSubmit = () => {
        const { email, password } = formData;
        if (validateNullFormData(formData)) {
            console.log(formData);
            navigation.navigate('ResetPasswordCheckEmail', { email: formData.email });
        }
    };

    useEffect(() => {
        const validate = validateNullFormData(formData);
        setIsValid(validate);
    }, [formData]);
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                    <Ionicons name="arrow-back-outline" size={24} style={styles.iconArrowBack} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Reset password</Text>
                <Text style={styles.descriptionText}>Please enter your account's email.</Text>
                <View style={styles.form}>
                    <TextInputEffectLabel
                        label="Email"
                        onChangeText={(text) => handleInputChange('email', text)}
                        value={formData.email}
                        error={errors.email}
                        style={styles.input}
                    />
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
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ResetPassword;

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
