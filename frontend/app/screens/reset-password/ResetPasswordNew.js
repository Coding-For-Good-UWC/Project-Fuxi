import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import TextInputEffectLabel from '../../components/TextInputEffectLabel';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordNew = () => {
    const navigation = useNavigation();
    const [isValid, setIsValid] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        let error = '';
        if (field === 'password' && value === '') {
            error = 'Password is required.';
        } else if (field === 'password' && value.length < 8) {
            error = 'Password must be at least 8 characters.';
        } else if (field === 'confirmPassword' && value === '') {
            error = 'Confirm password is required.';
        } else if (field === 'confirmPassword' && value !== formData.password) {
            error = 'Passwords do not match.';
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    const validateFormData = (formData) => {
        let isValid = true;
        if (formData.password.trim() === '') {
            isValid = false;
        } else if (formData.password.trim().leng < 8) {
            isValid = false;
        }
        if (formData.confirmPassword !== formData.password) {
            isValid = false;
        }
        return isValid;
    };

    const validateErrors = (errors) => {
        let isValid = true;
        if (errors.password.trim() !== '') {
            isValid = false;
        }
        if (errors.confirmPassword.trim() !== '') {
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = () => {
        if (validateFormData(formData) && validateErrors(errors)) {
            console.log(formData);
            // navigation.navigate('');
        }
    };

    useEffect(() => {
        const isValidateFormData = validateFormData(formData);
        const isValidateErrors = validateErrors(errors);
        if (isValidateFormData && isValidateErrors) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [formData]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerText}>Reset password</Text>
                <Text style={styles.descriptionText}>Please enter your account's email.</Text>
                <View style={styles.form}>
                    <TextInputEffectLabel
                        label="Password"
                        type="password"
                        onChangeText={(text) => handleInputChange('password', text)}
                        value={formData.password}
                        error={errors.password}
                    />
                    <TextInputEffectLabel
                        label="Re-enter password"
                        type="password"
                        onChangeText={(text) => handleInputChange('confirmPassword', text)}
                        value={formData.confirmPassword}
                        error={errors.confirmPassword}
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
                                Done
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toggleInactive}
                            // onPress={() => navigation.navigate('ResetPassword')}
                        >
                            <Text style={styles.inactiveText}>Back to Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ResetPasswordNew;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        paddingHorizontal: 20,
        marginTop: 40,
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
        lineHeight: 24,
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
        lineHeight: 24,
        color: '#222C2D',
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
});
