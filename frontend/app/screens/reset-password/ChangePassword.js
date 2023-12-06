import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import TextInputEffectLabel from '../../components/TextInputEffectLabel';
import { useNavigation } from '@react-navigation/native';
import { getStoreData } from '../../utils/AsyncStorage';
import { changePassword } from '../../api/institutes';
import CustomAnimatedLoader from '../../components/CustomAnimatedLoader';

const ChangePassword = () => {
    const navigation = useNavigation();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        let error = '';
        if (field === 'oldPassword' && value === '') {
            error = 'OTP is required.';
        } else if (field === 'oldPassword' && value.trim().length < 8) {
            error = 'Password must be at least 8 characters.';
        } else if (field === 'password' && value === '') {
            error = 'Password is required.';
        } else if (field === 'password' && value.trim().length < 8) {
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
        if (formData.oldPassword.trim() === '') {
            isValid = false;
        } else if (formData.oldPassword.trim().leng < 8) {
            isValid = false;
        }
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

    const handleSubmit = async () => {
        setIsLoading(true);
        if (validateFormData(formData) && validateErrors(errors)) {
            const userInfo = await getStoreData('userInfo');
            const { email } = JSON.parse(userInfo);
            try {
                console.log(formData);
                const { oldPassword, password, confirmPassword } = formData;
                if (password === confirmPassword) {
                    const response = await changePassword(email, oldPassword, password);
                    const { code, message, data } = response;
                    if (code === 200) {
                        alert(message)
                        navigation.navigate('TabNavigator');
                    } else {
                        alert(message)
                    }
                } else {
                    alert('Confirm password is required')
                }
            } catch (err) {
                console.error('Error decoding or checking token:', err);
                return;
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please enter all fields correctly')
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
            <CustomAnimatedLoader visible={isLoading} />
            <View style={styles.container}>
                <Text style={styles.headerText}>Change password</Text>
                <Text style={styles.descriptionText}>Please enter your new password below.</Text>
                <View style={styles.form}>
                    <TextInputEffectLabel
                        label="Enter old password"
                        type="password"
                        onChangeText={(text) => handleInputChange('oldPassword', text)}
                        value={formData.oldPassword}
                        error={errors.oldPassword}
                    />
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
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChangePassword;

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
